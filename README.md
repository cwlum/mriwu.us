# Personal Website & Portfolio - Dynamic Version

This repository contains the source code for the personal website and portfolio of cwlum. This version has been migrated from a static GitHub Pages site to a dynamic web application powered by Node.js and Express.

## About This Project

This website serves as a central hub to showcase projects, share information, and provide contact details. The dynamic backend allows for easier content management through a private admin panel.

## Features

*   **Dynamic Portfolio:** Portfolio items are now managed via a JSON file and served through an API, allowing for real-time updates without redeploying code.
*   **Admin Control Panel:** A secure admin dashboard to manage portfolio content (CRUD - Create, Read, Update, Delete) and perform other administrative tasks.
*   **Backend Server:** Built with Node.js and Express, providing robust routing, API endpoints, and content management logic.
*   **Server-Side Rendering:** Uses EJS templating for rendering admin pages.
*   **Process Management:** Ready to be managed by PM2 for production deployment, ensuring the application stays alive.
*   **Responsive Design:** A mobile-first approach ensures a seamless experience across all device sizes.

## Technologies Used

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Backend:** Node.js, Express.js
*   **Templating Engine:** EJS (Embedded JavaScript)
*   **Dependencies:**
    *   `express`: Web framework
    *   `ejs`: Templating engine
    *   `bcrypt`: Password hashing for admin login
    *   `multer`: Handling file uploads (portfolio images)
    *   `pm2`: (Recommended for production) Process manager

## Getting Started

To run this project locally, you will need Node.js and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/cwlum/mriwu.us.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd mriwu.us
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the server:**
    *   **For development:**
        ```bash
        node server.js
        ```
    *   **For production (recommended):**
        Use PM2 to keep the server running in the background.
        ```bash
        # Install PM2 globally if you haven't already
        npm install pm2 -g
        
        # Start the application
        pm2 start server.js --name mriwu-website
        ```
    The application will be running at `http://localhost:3000`.

## Admin Panel

The admin panel is located at `/admin`.
- **Login:** Use the credentials configured in `server.js` to log in.
- **Features:**
    - **Portfolio Management:** Add, edit, and delete portfolio items. Uploaded images are automatically handled.
    - **Website Backup:** Download a `.zip` archive of the entire website.

## Contributing

Contributions, issues, and feature requests are welcome. If you have any suggestions or find a bug, please open an issue in the [GitHub Issues](https://github.com/cwlum/mriwu.us/issues) section of this repository.

## License

This project is licensed under the AGPLv3 License - see the [LICENSE](LICENSE) file for details.
