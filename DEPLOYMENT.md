# Project MRIWU.US Deployment & Architecture

This document contains key information about the project's architecture and deployment process.

## Technology Stack

*   **Backend:** Node.js with Express.js
*   **Frontend:** EJS (Embedded JavaScript templates)
*   **Process Manager:** PM2 (Application name: `mriwu.us`)
*   **Web Server / Reverse Proxy:** Nginx

## Deployment & Architecture

*   **Project Root:** `/var/www/mriwu.us`
*   **Deployment Command:** `git pull` followed by `pm2 restart mriwu.us`. If dependencies in `package.json` change, run `npm install` before restarting.
*   **Nginx Configuration:**
    *   The active config file is at `/etc/nginx/sites-available/mriwu.us.conf`.
    *   Nginx is configured as a reverse proxy.
    *   **Static Assets:** Nginx directly serves files from `/asset/`, `/css/`, and `/js/` for high performance.
    *   **Dynamic Requests:** All other requests are proxied to the Node.js application running on `http://localhost:3000`.
*   **Important Note:** If the directory structure for static assets changes, the Nginx configuration file **must** be updated accordingly.
