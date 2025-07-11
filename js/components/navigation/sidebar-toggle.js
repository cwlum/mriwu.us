document.addEventListener('DOMContentLoaded', () => {
    const openSidebarButton = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const siteContainer = document.querySelector('.site-container');
    let isAnimating = false;

    function setSidebarState(isOpen) {
        if (!sidebar || !siteContainer || !openSidebarButton || typeof anime === 'undefined') {
            if (typeof anime === 'undefined') console.warn('anime.js not loaded');
            return;
        }
        if (isAnimating) return;

        isAnimating = true;
        const easing = 'spring(1, 80, 15, 0)'; // A bouncy, physical spring easing

        if (isOpen) {
            sidebar.classList.add('active');
            openSidebarButton.setAttribute('aria-expanded', 'true');
            
            // Animate sidebar sliding in
            anime({
                targets: sidebar,
                translateX: ['-100%', '0%'],
                duration: 800,
                easing: easing,
                begin: () => {
                    sidebar.style.visibility = 'visible';
                }
            });

            // Stagger animation for sidebar children
            anime({
                targets: '.sidebar .form-group, .sidebar .button-container',
                translateX: [-30, 0],
                opacity: [0, 1],
                delay: anime.stagger(80, {start: 200}),
                easing: 'easeOutExpo',
            });

            // Use a simple timeout to set animation flag to false
            setTimeout(() => { isAnimating = false; }, 800);

        } else {
            openSidebarButton.setAttribute('aria-expanded', 'false');
            
            // Animate sidebar sliding out
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
    } else {
        // Warnings for missing elements
    }
});
