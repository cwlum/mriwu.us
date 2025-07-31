# Personal Website & Portfolio - Code Structure

This document outlines the structure of this dynamic web application, built with Node.js and Express.

## Project Structure

```
.
├── admin/                # Admin panel EJS templates
│   ├── change-password.ejs
│   ├── dashboard.ejs
│   ├── edit-portfolio.ejs
│   ├── forgot-password.ejs
│   ├── layout.ejs
│   ├── login.ejs
│   └── manage-portfolio.ejs
├── asset/                # Static assets like images
│   ├── images/
│   └── portfolio/
├── css/                  # Compiled and static CSS files
├── data/                 # JSON files for data storage
│   ├── portfolio.json
│   └── users.json
├── js/                   # Client-side JavaScript
│   ├── main/
│   ├── modules/
│   ├── pages/
│   └── portfolio/
├── sessions/             # Session files (auto-generated)
├── views/                # Public-facing EJS templates
│   ├── partials/         # Reusable EJS partials (header, footer, etc.)
│   ├── contact.ejs
│   ├── index.ejs
│   ├── portfolio.ejs
│   └── privacy.ejs
├── .env                  # Environment variables (ignored by Git)
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies and scripts
├── server.js             # Main Express server file
└── LICENSE               # Project license
```

## Key Components

### `server.js`

This is the heart of the application. It handles:
*   **Server Setup:** Initializes the Express app, sets up the EJS view engine, and defines middleware.
*   **Routing:** Defines all routes for both the public-facing site and the admin panel.
*   **Authentication:** Manages user login, sessions, and password protection for admin routes.
*   **Data Handling:** Includes functions to read from and write to the JSON data files.
*   **API Endpoints:** Provides a `/api/portfolio` endpoint to fetch portfolio data.

### `/admin`

This directory contains all EJS templates for the admin panel. The main layout is defined in `layout.ejs`, which is used by all other admin pages.

### `/views`

This directory holds the EJS templates for the public website. It includes a `partials` subdirectory for reusable components like the header, footer, and sidebar.

### `/data`

This project uses flat-file JSON for data storage, which is simple and effective for a small-scale application.
*   `users.json`: Stores hashed passwords for admin users.
*   `portfolio.json`: Stores all portfolio item data.

### `/asset`

This directory is for static files that are served directly to the client, such as uploaded portfolio images.

## License

Please see the [LICENSE](LICENSE) file for information on how you can use the code in this repository.
