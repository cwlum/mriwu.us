const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Define the directory where your static files are located.
const staticFilesPath = path.join(__dirname);

// Serve static files (HTML, CSS, JS, images) from the specified directory.
app.use(express.static(staticFilesPath));

// Set up a default route to serve your index.html file.
app.get('/', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.html'));
});

// Start the server and listen for connections on the specified port.
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('You can access your website by visiting this URL in your browser.');
});
