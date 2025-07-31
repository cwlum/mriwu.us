const fs = require('fs').promises;
const path = require('path');

const portfolioDataPath = path.join(__dirname, 'data', 'portfolio.json');
const usersDataPath = path.join(__dirname, 'data', 'users.json');

let portfolioCache = null;
let usersCache = null;

const readJsonFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file from path: ${filePath}`, error);
        throw error;
    }
};

const writeJsonFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing file to path: ${filePath}`, error);
        throw error;
    }
};

const getPortfolio = async () => {
    if (portfolioCache === null) {
        portfolioCache = await readJsonFile(portfolioDataPath);
    }
    return portfolioCache;
};

const getUsers = async () => {
    if (usersCache === null) {
        usersCache = await readJsonFile(usersDataPath);
    }
    return usersCache;
};

const updatePortfolio = async (data) => {
    portfolioCache = data;
    await writeJsonFile(portfolioDataPath, data);
};

const updateUsers = async (data) => {
    usersCache = data;
    await writeJsonFile(usersDataPath, data);
};

const initializeCache = async () => {
    await getPortfolio();
    await getUsers();
    console.log('Data cache initialized.');
};

module.exports = {
    getPortfolio,
    getUsers,
    updatePortfolio,
    updateUsers,
    initializeCache
};
