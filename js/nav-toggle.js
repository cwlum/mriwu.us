document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    // Get the parent <nav> element instead of the <ul> directly for class toggling
    const siteNavigation = document.querySelector('.site-navigation'); 
    const mainNavList = document.getElementById('main-nav-list'); // Still needed for aria

    if (navToggle && siteNavigation && mainNavList) {
        navToggle.addEventListener('click', () => {
            // Toggle class on the <nav> element
            siteNavigation.classList.toggle('nav-open'); 
            navToggle.classList.toggle('active');
            document.body.classList.toggle('body-no-scroll');
            
            // Update aria-expanded attribute based on the <nav> element's class
            const isExpanded = siteNavigation.classList.contains('nav-open');
            navToggle.setAttribute('aria-expanded', isExpanded);
            
            // Optionally, ensure the ul itself also gets a class if needed for direct styling,
            // or rely on descendant selectors from .nav-open on <nav>
            if (isExpanded) {
                mainNavList.classList.add('nav-list-active-for-styles'); // Example if direct styling on UL is preferred
            } else {
                mainNavList.classList.remove('nav-list-active-for-styles');
            }
        });
    }
});
