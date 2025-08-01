require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const ejs = require('ejs');
const engine = require('ejs-mate');
const compression = require('compression');
const cache = require('./cache');

const app = express();
const port = 3000;

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// --- Middleware ---
app.use(compression());

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


// --- Server ---
const startServer = async () => {
    await cache.initializeCache();
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
};

startServer();
