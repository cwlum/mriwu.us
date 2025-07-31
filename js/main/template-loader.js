async function loadTemplate(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch template: ${url}`);
    }
    return response.text();
}

async function loadTemplates() {
    const headerPromise = loadTemplate('/templates/header.html');
    const footerPromise = loadTemplate('/templates/footer.html');

    const [headerHTML, footerHTML] = await Promise.all([headerPromise, footerPromise]);

    const headerElement = document.querySelector('.site-header');
    const footerElement = document.querySelector('.site-footer-bottom');

    if (headerElement) {
        headerElement.outerHTML = headerHTML;
    }

    if (footerElement) {
        footerElement.outerHTML = footerHTML;
    }
}

export { loadTemplates };