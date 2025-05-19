document.addEventListener('DOMContentLoaded', () => {
    const openSidebarButton = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar'); // Assuming sidebar has id="sidebar"
    const siteContainer = document.querySelector('.site-container');
    let isAnimating = false; // Flag to prevent multiple animations

    // Helper function to manage sidebar state
    function setSidebarState(isOpen) {
        if (!sidebar || !siteContainer || !openSidebarButton || typeof anime === 'undefined') {
            if (typeof anime === 'undefined') console.warn('anime.js not loaded');
            return; // Guard clause
        }
        if (isAnimating) return; // Prevent starting new animation if one is in progress

        isAnimating = true;

        if (isOpen) {
            sidebar.classList.add('active'); // For visibility and box-shadow
            // siteContainer.classList.add('sidebar-active'); // Removed for now
            openSidebarButton.setAttribute('aria-expanded', 'true');
            openSidebarButton.classList.add('is-hidden'); // Hide the open button

            anime({
                targets: sidebar,
                translateX: ['-100%', '0%'],
                duration: 350,
                easing: 'easeInOutQuad',
                begin: function() {
                    sidebar.style.visibility = 'visible'; // Ensure visible before animation
                },
                complete: function() {
                    isAnimating = false;
                }
            });
        } else {
            // openSidebarButton.classList.remove('is-hidden'); // Show the open button - moved to animation complete
            openSidebarButton.setAttribute('aria-expanded', 'false');
            
            anime({
                targets: sidebar,
                translateX: ['0%', '-100%'],
                duration: 350,
                easing: 'easeInOutQuad',
                complete: function() {
                    sidebar.classList.remove('active'); // For visibility and box-shadow
                    // siteContainer.classList.remove('sidebar-active'); // Removed for now
                    openSidebarButton.classList.remove('is-hidden'); // Show the open button after animation
                    sidebar.style.visibility = 'hidden'; // Ensure hidden after animation
                    isAnimating = false;
                }
            });
        }
    }

    if (openSidebarButton && sidebar && siteContainer) {
        openSidebarButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click on open button from being caught by document listener
            setSidebarState(true); // Open sidebar
        });

        // Click outside to close
        document.addEventListener('click', (event) => {
            if (sidebar.classList.contains('active')) { // If sidebar is open
                const isClickInsideSidebar = sidebar.contains(event.target);
                // Check if the click is on the open button or its children (e.g. SVG icon)
                const isClickOnOpenButton = openSidebarButton.contains(event.target) || event.target === openSidebarButton;

                if (!isClickInsideSidebar && !isClickOnOpenButton) {
                    setSidebarState(false); // Close sidebar
                }
            }
        });

        // Optional: Close sidebar on 'Escape' key press
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && sidebar.classList.contains('active')) {
                setSidebarState(false);
            }
        });

    } else {
        if (!openSidebarButton) console.warn('Open sidebar button (id="sidebar-toggle") not found.');
        if (!sidebar) console.warn('Sidebar element (id="sidebar") not found.');
        if (!siteContainer) console.warn('Site container element (class="site-container") for sidebar interaction not found.');
    }
});
