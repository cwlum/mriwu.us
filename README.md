# Personal Portfolio Website

A lightweight, file-based portfolio website built with Node.js and Express.

## Project Philosophy

This project prioritizes simplicity and performance. Instead of a dynamic admin panel, content is managed directly through JSON files, and static assets are served with high performance via Nginx.

## Project Structure

```
.
├── asset/                # Static assets like images
│   ├── images/
│   └── portfolio/
├── css/                  # CSS files
├── data/                 # JSON files for data storage
│   └── portfolio.json
├── js/                   # Client-side JavaScript
├── views/                # Public-facing EJS templates
│   ├── partials/         # Reusable EJS partials (header, footer, etc.)
│   ├── contact.ejs
│   ├── index.ejs
│   ├── portfolio.ejs
│   └── privacy.ejs
├── .env                  # Environment variables (ignored by Git)
├── .gitignore            # Git ignore file
├── DEPLOYMENT.md         # Deployment and architecture info
├── package.json          # Project dependencies and scripts
├── server.js             # Main Express server file
└── LICENSE               # Project license
```

## Key Components

### `server.js`

This is the heart of the application. It handles:
*   **Server Setup:** Initializes the Express app, sets up the EJS view engine, and defines middleware.
*   **Routing:** Defines all routes for the public-facing site.
*   **API Endpoints:** Provides a `/api/portfolio` endpoint to fetch portfolio data.

### `/views`

This directory holds the EJS templates for the public website. It includes a `partials` subdirectory for reusable components like the header and footer.

### Content Management

This project uses a flat-file approach for easy content management:
*   **Portfolio Data:** All portfolio items are stored in `/data/portfolio.json`.
*   **To Add/Edit/Delete Items:** Directly modify the `portfolio.json` file.
*   **Images:** Add new portfolio images to the `/asset/portfolio/` directory and reference the correct path in the JSON file.

### `/asset`

This directory is for static files that are served directly to the client, such as portfolio images. For performance, these are served directly by Nginx in the production environment.

## License

Please see the [LICENSE](LICENSE) file for information on how you can use the code in this repository.
