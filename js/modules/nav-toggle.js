// js/components/navigation/nav-toggle.js
function initializeNavToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const siteNavigation = document.querySelector('.site-navigation'); 
    const mainNavList = document.getElementById('main-nav-list');
    if (navToggle && siteNavigation && mainNavList) {
        navToggle.addEventListener('click', () => {
            siteNavigation.classList.toggle('nav-open'); 
            navToggle.classList.toggle('active');
            const isExpanded = siteNavigation.classList.contains('nav-open');
            navToggle.setAttribute('aria-expanded', isExpanded);
            document.body.classList.toggle('body-no-scroll', isExpanded);
        });
    }
}

export { initializeNavToggle };