// js/components/navigation/sidebar-toggle.js
function initializeSidebarToggle() {
    const openSidebarButton = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const siteContainer = document.querySelector('.site-container');
    let isAnimating = false;

    function setSidebarState(isOpen) {
        if (!sidebar || !siteContainer || !openSidebarButton) {
            return;
        }
        if (isAnimating) return;
        isAnimating = true;
        const easing = 'spring(1, 80, 15, 0)';
        if (isOpen) {
            sidebar.classList.add('active');
            openSidebarButton.setAttribute('aria-expanded', 'true');
            anime({
                targets: sidebar,
                translateX: ['-100%', '0%'],
                duration: 800,
                easing: easing,
                begin: () => {
                    sidebar.style.visibility = 'visible';
                }
            });
            anime({
                targets: '.sidebar .form-group, .sidebar .button-container',
                translateX: [-30, 0],
                opacity: [0, 1],
                delay: anime.stagger(80, {start: 200}),
                easing: 'easeOutExpo',
            });
            setTimeout(() => { isAnimating = false; }, 800);
        } else {
            openSidebarButton.setAttribute('aria-expanded', 'false');
            anime({
                targets: sidebar,
                translateX: ['0%', '-100%'],
                duration: 600,
                easing: 'easeInExpo',
                complete: () => {
                    sidebar.classList.remove('active');
                    sidebar.style.visibility = 'hidden';
                }
            });
            setTimeout(() => { isAnimating = false; }, 600);
        }
    }

    if (openSidebarButton && sidebar && siteContainer) {
        openSidebarButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (!sidebar.classList.contains('active')) {
                setSidebarState(true);
            }
        });
        document.addEventListener('click', (event) => {
            if (sidebar.classList.contains('active')) {
                const isClickInsideSidebar = sidebar.contains(event.target);
                const isClickOnOpenButton = openSidebarButton.contains(event.target);
                if (!isClickInsideSidebar && !isClickOnOpenButton) {
                    setSidebarState(false);
                }
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && sidebar.classList.contains('active')) {
                setSidebarState(false);
            }
        });
    }
}

export { initializeSidebarToggle };