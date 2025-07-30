# Personal Website & Portfolio - cwlum.github.io

This repository contains the source code for the personal website and portfolio of cwlum, accessible at [https://cwlum.github.io/](https://cwlum.github.io/).

## About This Project

This website serves as a central hub to showcase projects, share information, and provide contact details. It is designed to be a clean, responsive, and easily navigable platform.

## Features

*   **Dynamic Portfolio Grid:** Portfolio items are loaded dynamically from a central data source. The grid supports filtering by category and a real-time search function.
*   **Automatic Sorting:** The portfolio is automatically sorted to display the newest work first.
*   **Engaging Animations:** Utilizes the `anime.js` library to provide smooth, meaningful animations for page transitions, item filtering, and interactive elements.
*   **Interactive Image Modal:** A custom-built modal window for viewing artwork, complete with keyboard navigation (arrow keys and Escape).
*   **Site-Wide Orientation Lock:** Prompts users on landscape-oriented devices to switch to portrait mode for a better viewing experience, implemented across all pages.
*   **Responsive Design:** A mobile-first approach ensures a seamless experience across all device sizes.

## Technologies Used

The website is built using a combination of modern and fundamental web technologies:

*   **HTML5:** For the semantic structure and content of the web pages.
*   **CSS3:** For styling, layout, and animations. Key features include Flexbox, Grid, and custom properties for maintainable theming.
*   **JavaScript (ES6+):** For all interactive functionality, including the portfolio grid, animations, and form handling.
*   **anime.js:** A lightweight and powerful animation library used for creating engaging user interface animations.

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
│   │   ├── background-animations.js
│   │   └── password-protect.js
│   ├── buttons/
│   │   └── ripple-effect.js
│   └── portfolio/
│       ├── data.js
│       ├── page.js
│       └── modal.js
├── js/orientation-check.js
├── js/app.bundle.js
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
