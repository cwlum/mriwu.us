const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const archiver = require('archiver');
const fs = require('fs');
const ejs = require('ejs');
const engine = require('ejs-mate');

const app = express();
const port = 3000;

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'admin'));

// --- User Configuration ---
const users = {
    "admin": "$2b$10$NZHUGCTuY8UJ0tIa3yeYNOanf2InFL7Wxiu10yVDybecYG4ymA1yG"
};

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'a_very_secret_key_that_should_be_changed',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
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
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = users[username];

    if (hashedPassword && bcrypt.compareSync(password, hashedPassword)) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/admin/dashboard');
    } else {
        res.send('Incorrect Username and/or Password!');
    }
});

app.get('/admin/dashboard', requireLogin, (req, res) => {
    res.render('dashboard', { title: 'Admin Dashboard' });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin');
});

// --- Portfolio Management ---
const portfolioDataPath = path.join(__dirname, 'data', 'portfolio.json');

const readPortfolioData = () => {
    const data = fs.readFileSync(portfolioDataPath, 'utf-8');
    return JSON.parse(data);
};

const writePortfolioData = (data) => {
    fs.writeFileSync(portfolioDataPath, JSON.stringify(data, null, 2));
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'asset/portfolio')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

app.get('/admin/portfolio', requireLogin, (req, res) => {
    const portfolio = readPortfolioData();
    res.render('portfolio', { portfolio, title: 'Manage Portfolio' });
});

app.post('/admin/portfolio/add', requireLogin, upload.single('image'), (req, res) => {
    const portfolio = readPortfolioData();
    const { title, category, description } = req.body;
    
    const newItem = {
        id: Date.now().toString(),
        title,
        category,
        description,
        src: req.file ? req.file.path.replace(/\\/g, '/') : ''
    };

    portfolio.unshift(newItem);
    writePortfolioData(portfolio);
    res.redirect('/admin/portfolio');
});

app.get('/admin/portfolio/edit/:id', requireLogin, (req, res) => {
    const portfolio = readPortfolioData();
    const item = portfolio.find(p => p.id === req.params.id);
    if (item) {
        res.render('edit-portfolio', { item, title: 'Edit Portfolio Item' });
    } else {
        res.status(404).send('Item not found');
    }
});

app.post('/admin/portfolio/edit/:id', requireLogin, upload.single('image'), (req, res) => {
    const portfolio = readPortfolioData();
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
        writePortfolioData(portfolio);
        res.redirect('/admin/portfolio');
    } else {
        res.status(404).send('Item not found');
    }
});

app.post('/admin/portfolio/delete/:id', requireLogin, (req, res) => {
    let portfolio = readPortfolioData();
    const itemToDelete = portfolio.find(p => p.id === req.params.id);

    if (itemToDelete && itemToDelete.src) {
        const imagePath = path.join(__dirname, itemToDelete.src);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
    
    portfolio = portfolio.filter(p => p.id !== req.params.id);
    writePortfolioData(portfolio);
    res.redirect('/admin/portfolio');
});

// --- Public API Routes ---
app.get('/api/portfolio', (req, res) => {
    const portfolio = readPortfolioData();
    res.json(portfolio);
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

// --- Default Route ---
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Server ---
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
