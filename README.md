# Personal Website & Portfolio - cwlum.github.io

This repository contains the source code for the personal website and portfolio of cwlum, accessible at [https://cwlum.github.io/](https://cwlum.github.io/).

## About This Project

This website serves as a central hub to showcase projects, share information, and provide contact details. It is designed to be a clean, responsive, and easily navigable platform.

## Technologies Used

The website is built using fundamental web technologies:

*   **HTML5:** For the structure and content of the web pages.
*   **CSS3:** For styling and layout, including responsive design techniques.
*   **JavaScript (ES6+):** For interactive elements and dynamic content, such as the contact form.

## Project Structure

The repository is organized as follows:

```
├── css/
│   ├── base/
│   │   ├── global.css
│   │   ├── main.css
│   │   └── responsive.css
│   ├── layout/
│   │   ├── footer.css
│   │   ├── header.css
│   │   └── sidebar.css
│   ├── pages/
│   │   ├── academic.css
│   │   └── contact-form.css
│   ├── components/
│   │   └── buttons.css
│   └── portfolio/
│       ├── grid.css
│       └── modal.css
├── js/
│   ├── utils/
│   │   └── page-animations.js
│   ├── components/
│   │   └── navigation/
│   │       ├── nav-toggle.js
│   │       └── sidebar-toggle.js
│   ├── features/
│   │   └── password-protect.js
│   ├── buttons/
│   │   ├── patreon-button.js
│   │   ├── twitter-button.js
│   │   └── vgen-button.js
│   └── portfolio/
│       ├── data.js
│       ├── page.js
│       └── modal.js
├── asset/
│   ├── images/
│   │   ├── logo.PNG
│   │   └── profile-picture.JPG
│   └── portfolio/
│       └── ...
├── academic.html
├── CNAME
├── contact.html
├── index.html
├── LICENSE
├── portfolio.html
├── privacy.html
└── README.md
```

## Getting Started

To view or work on this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/cwlum/cwlum.github.io.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd cwlum.github.io
    ```
3.  **Open `index.html` in your browser:**
    You can simply open the `index.html` file directly in your web browser to view the site. For a more robust local development experience, you can use a local web server. Many code editors (like VS Code with the "Live Server" extension) offer this functionality, or you can use Python's built-in HTTP server:
    ```bash
    python -m http.server
    ```
    Or for Python 3:
    ```bash
    python3 -m http.server
    ```
    Then, open `http://localhost:8000` (or the port indicated by the server) in your browser.

## Viewing the Live Site

The live version of this website is hosted on GitHub Pages and can be accessed at:
[https://cwlum.github.io/](https://cwlum.github.io/)

## Contributing

Contributions, issues, and feature requests are welcome. If you have any suggestions or find a bug, please open an issue in the [GitHub Issues](https://github.com/cwlum/cwlum.github.io/issues) section of this repository.

## License

This project is licensed under the AGPLv3 License - see the [LICENSE](LICENSE) file for details.
