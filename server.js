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

// --- Page Content Routes ---
app.get('/admin/edit', requireLogin, (req, res) => {
    const page = req.query.page;
    const filePath = path.join(__dirname, page);
    const content = fs.readFileSync(filePath, 'utf-8');
    res.render('edit', { page, content });
});

app.post('/admin/edit', requireLogin, (req, res) => {
    const { page, content } = req.body;
    const filePath = path.join(__dirname, page);
    fs.writeFileSync(filePath, content);
    res.redirect('/admin/dashboard');
});

// --- Portfolio Management ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'asset/images/portfolio')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});

const upload = multer({ storage: storage });

app.get('/admin/portfolio', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'portfolio.html'));
});

app.post('/admin/portfolio/add', requireLogin, upload.single('image'), (req, res) => {
    const { title, category, description } = req.body;
    const image = req.file.path;

    const portfolioDataPath = path.join(__dirname, 'js', 'portfolio', 'data.js');
    const portfolioData = fs.readFileSync(portfolioDataPath, 'utf8');

    const newItem = `
    {
        "title": "${title}",
        "category": "${category}",
        "description": "${description}",
        "imageUrl": "${image.replace(/\\/g, '/')}",
        "thumbnailUrl": "${image.replace(/\\/g, '/')}"
    },
];`;

    const updatedPortfolioData = portfolioData.replace(/\n];/, newItem);

    fs.writeFileSync(portfolioDataPath, updatedPortfolioData);

    res.redirect('/admin/dashboard');
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
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname));

// --- Server ---
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});