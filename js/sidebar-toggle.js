document.addEventListener('DOMContentLoaded', () => {
    const openSidebarButton = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar'); // Assuming sidebar has id="sidebar"
    const siteContainer = document.querySelector('.site-container');

    // Helper function to manage sidebar state
    function setSidebarState(isOpen) {
        if (!sidebar || !siteContainer || !openSidebarButton) return; // Guard clause

        if (isOpen) {
            sidebar.classList.add('active');
            siteContainer.classList.add('sidebar-active');
            openSidebarButton.setAttribute('aria-expanded', 'true');
            openSidebarButton.classList.add('is-hidden'); // Hide the open button
        } else {
            sidebar.classList.remove('active');
            siteContainer.classList.remove('sidebar-active');
            openSidebarButton.setAttribute('aria-expanded', 'false');
            openSidebarButton.classList.remove('is-hidden'); // Show the open button
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
