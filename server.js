require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bcrypt = require('bcrypt');
const multer = require('multer');
const archiver = require('archiver');
const fs = require('fs').promises; // Use promises for async operations
const ejs = require('ejs');
const engine = require('ejs-mate');
const compression = require('compression');
const cache = require('./cache');

const app = express();
const port = 3000;

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'admin'), path.join(__dirname, 'views')]);


// --- Middleware ---
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    store: new FileStore({
        path: './sessions',
        ttl: 86400, // 1 day in seconds
        retries: 0
    }),
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false, // Set to false for file store
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
}));

// --- Authentication Middleware ---
function requireLogin(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/admin');
    }
}

// --- Admin Routes ---
app.get('/admin', (req, res) => {
    res.render('login', { title: 'Admin Login', message: null });
});

app.post('/admin/login', async (req, res) => {
    const { username, password, 'remember-me': rememberMe } = req.body;
    
    try {
        const users = await cache.getUsers();
        const user = users[username];

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.loggedin = true;
            req.session.username = username;
            // The maxAge is now set in the main session config
            res.redirect('/admin/dashboard');
        } else {
            res.render('login', { title: 'Admin Login', message: 'Incorrect Username and/or Password!' });
        }
    } catch (error) {
        res.status(500).render('login', { title: 'Admin Login', message: 'Server error during login.' });
    }
});

app.get('/admin/change-password', requireLogin, (req, res) => {
    res.render('change-password', { title: 'Change Password', error: null, success: null });
});

app.post('/admin/change-password', requireLogin, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const username = req.session.username;

    try {
        const users = await cache.getUsers();
        const user = users[username];

        if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
            return res.render('change-password', { title: 'Change Password', error: 'Incorrect current password.', success: null });
        }

        if (newPassword !== confirmPassword) {
            return res.render('change-password', { title: 'Change Password', error: 'New passwords do not match.', success: null });
        }

        const newHashedPassword = bcrypt.hashSync(newPassword, 10);
        users[username].password = newHashedPassword;

        await cache.updateUsers(users);
        
        console.log(`Password for user '${username}' has been changed.`);
        res.render('change-password', { title: 'Change Password', error: null, success: 'Password changed successfully!' });

    } catch (error) {
        console.error("Error changing password:", error);
        res.render('change-password', { title: 'Change Password', error: 'An error occurred while changing the password.', success: null });
    }
});

app.get('/admin/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password' });
});

app.get('/admin/dashboard', requireLogin, (req, res) => {
    res.render('dashboard', { title: 'Admin Dashboard' });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
});

// --- Portfolio Management ---

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'asset/portfolio')
    },
    filename: function (req, file, cb) {
        // Ensure the file is saved with a .webp extension
        cb(null, Date.now() + '.webp');
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only webp files
    if (path.extname(file.originalname).toLowerCase() === '.webp') {
        cb(null, true);
    } else {
        cb(new Error('Only .webp files are allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.get('/admin/portfolio', requireLogin, async (req, res) => {
    try {
        const allPortfolio = await cache.getPortfolio();
        const page = parseInt(req.query.page) || 1;
        const perPage = 8; // Items per page
        const totalItems = allPortfolio.length;
        const totalPages = Math.ceil(totalItems / perPage);
        const start = (page - 1) * perPage;
        const end = page * perPage;
        const portfolio = allPortfolio.slice(start, end);

        res.render('manage-portfolio', {
            portfolio,
            title: 'Manage Portfolio',
            currentPage: page,
            totalPages,
            totalItems
        });
    } catch (error) {
        console.error("Error getting portfolio for admin:", error);
        res.status(500).send("Error reading portfolio data.");
    }
});

app.post('/admin/portfolio/add', requireLogin, upload.single('image'), async (req, res) => {
    try {
        const portfolio = await cache.getPortfolio();
        const { title, category, description } = req.body;
        
        const newItem = {
            id: Date.now().toString(),
            title,
            category,
            description,
            src: req.file ? req.file.path.replace(/\\/g, '/') : ''
        };

        portfolio.unshift(newItem);
        await cache.updatePortfolio(portfolio);
        res.redirect('/admin/portfolio');
    } catch (error) {
        res.status(500).send("Error adding portfolio item.");
    }
});

app.get('/admin/portfolio/edit/:id', requireLogin, async (req, res) => {
    try {
        const portfolio = await cache.getPortfolio();
        const item = portfolio.find(p => p.id === req.params.id);
        if (item) {
            res.render('edit-portfolio', { item, title: 'Edit Portfolio Item' });
        } else {
            res.status(404).send('Item not found');
        }
    } catch (error) {
        res.status(500).send("Error finding portfolio item.");
    }
});

app.post('/admin/portfolio/edit/:id', requireLogin, upload.single('image'), async (req, res) => {
    try {
        const portfolio = await cache.getPortfolio();
        const { title, category, description, existingImage } = req.body;
        const index = portfolio.findIndex(p => p.id === req.params.id);

        if (index !== -1) {
            const updatedItem = {
                ...portfolio[index],
                title,
                category,
                description,
                src: req.file ? req.file.path.replace(/\\/g, '/') : existingImage
            };
            portfolio[index] = updatedItem;
            await cache.updatePortfolio(portfolio);
            res.redirect('/admin/portfolio');
        } else {
            res.status(404).send('Item not found');
        }
    } catch (error) {
        res.status(500).send("Error editing portfolio item.");
    }
});

app.post('/admin/portfolio/delete/:id', requireLogin, async (req, res) => {
    try {
        let portfolio = await cache.getPortfolio();
        const itemToDelete = portfolio.find(p => p.id === req.params.id);

        if (itemToDelete && itemToDelete.src) {
            const imagePath = path.join(__dirname, itemToDelete.src);
            try {
                await fs.unlink(imagePath);
            } catch (unlinkError) {
                // Log error if file doesn't exist, but don't block the process
                console.error(`Could not delete file: ${imagePath}`, unlinkError);
            }
        }
        
        portfolio = portfolio.filter(p => p.id !== req.params.id);
        await cache.updatePortfolio(portfolio);
        res.redirect('/admin/portfolio');
    } catch (error) {
        res.status(500).send("Error deleting portfolio item.");
    }
});

// --- Public API Routes ---
app.get('/api/portfolio', async (req, res) => {
    try {
        const portfolio = await cache.getPortfolio();
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve portfolio data." });
    }
});

// --- Public Page Routes ---
app.get('/privacy', (req, res) => {
    res.render('privacy', { title: 'Privacy Policy' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact' });
});

app.get('/portfolio', async (req, res) => {
    try {
        const portfolio = await cache.getPortfolio();
        res.render('portfolio', { portfolio, title: 'Portfolio' });
    } catch (error) {
        res.status(500).send("Error loading portfolio page.");
    }
});

// --- Website Backup ---
app.get('/admin/backup', requireLogin, (req, res) => {
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    archive.on('error', function(err) {
        res.status(500).send({error: err.message});
    });

    // Set the content type and disposition
    res.attachment('website-backup.zip');

    archive.pipe(res);

    archive.glob('**/*', {
        cwd: __dirname,
        ignore: ['node_modules/**', 'website-backup.zip']
    });

    archive.finalize();
});

// --- Root Route ---
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// --- Static Files Middleware ---
const staticOptions = {
    maxAge: '1d', // Cache static assets for 1 day
    setHeaders: (res, path, stat) => {
        res.set('x-timestamp', Date.now());
    }
};

app.use('/css', express.static(path.join(__dirname, 'css'), staticOptions));
app.use('/js', express.static(path.join(__dirname, 'js'), staticOptions));
app.use('/asset', express.static(path.join(__dirname, 'asset'), staticOptions));
app.use('/admin', express.static(path.join(__dirname, 'admin'), staticOptions));


// --- Server ---
const startServer = async () => {
    await cache.initializeCache();
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
};

startServer();
