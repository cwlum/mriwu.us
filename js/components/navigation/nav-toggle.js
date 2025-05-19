document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const siteNavigation = document.querySelector('.site-navigation'); 
    const mainNavList = document.getElementById('main-nav-list'); // Still needed for aria

    if (navToggle && siteNavigation && mainNavList) {
        navToggle.addEventListener('click', () => {
            siteNavigation.classList.toggle('nav-open'); 
            navToggle.classList.toggle('active');
            // Toggle body-no-scroll based on the new state of the menu
            const isExpanded = siteNavigation.classList.contains('nav-open');
            navToggle.setAttribute('aria-expanded', isExpanded);
            document.body.classList.toggle('body-no-scroll', isExpanded);
        });
    }
});
