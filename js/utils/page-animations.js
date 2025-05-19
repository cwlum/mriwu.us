document.addEventListener('DOMContentLoaded', () => {
    if (typeof anime === 'undefined') {
        console.warn('anime.js not loaded, page animations will not run.');
        return;
    }

    // Ensure elements exist before trying to animate them
    const siteHeader = document.querySelector('.site-header');
    const profileImageContainer = document.querySelector('.profile-image-container');
    const siteHeading = document.querySelector('.site-heading');
    const siteSubheading = document.querySelector('.site-subheading');
    const socialLinks = document.querySelector('.social-links');
    const vgenButtonContainer = document.querySelector('.vgen-button-container'); // Specific VGen button
    const actionButtons = document.querySelector('.action-buttons');
    const siteFooter = document.querySelector('.site-footer-bottom');

    // Initial states (set via JS to avoid FOUC if CSS isn't perfectly synced)
    // Or, preferably, set these initial states in CSS (e.g., opacity: 0, transform: translateY(-20px))
    // For simplicity here, we'll just run animations. If FOUC is an issue, CSS initial states are better.

    const timeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    });

    if (siteHeader) {
        siteHeader.style.visibility = 'visible'; // Set visible before animation starts
        timeline.add({
            targets: siteHeader,
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 800
        });
    }

    if (profileImageContainer) {
        profileImageContainer.style.visibility = 'visible';
        timeline.add({
            targets: profileImageContainer,
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 800
        }, '-=600'); // Start 600ms before the previous animation ends
    }

    if (siteHeading) {
        siteHeading.style.visibility = 'visible';
        timeline.add({
            targets: siteHeading,
            translateX: [-50, 0],
            opacity: [0, 1],
            duration: 700
        }, '-=600');
    }

    if (siteSubheading) {
        siteSubheading.style.visibility = 'visible';
        timeline.add({
            targets: siteSubheading,
            translateX: [50, 0], // From the right
            opacity: [0, 1],
            duration: 700
        }, '-=600'); // Start relative to siteHeading animation
    }

    if (socialLinks) {
        document.querySelectorAll('.social-links li').forEach(li => li.style.visibility = 'visible');
        timeline.add({
            targets: '.social-links li', // Target individual list items
            translateY: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 500
        }, '-=500');
    }
    
    // Animating VGen button and action buttons together with a slight stagger
    const bottomButtons = [];
    if (vgenButtonContainer) {
        vgenButtonContainer.style.visibility = 'visible';
        bottomButtons.push(vgenButtonContainer);
    }
    if (actionButtons) {
        actionButtons.style.visibility = 'visible';
        bottomButtons.push(actionButtons);
    }

    if (bottomButtons.length > 0) {
        timeline.add({
            targets: bottomButtons,
            translateY: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(150, {start: 300}), // Stagger them slightly, start after a small delay
            duration: 700
        }, '-=400'); // Overlap a bit with social links
    }

    if (siteFooter) {
        siteFooter.style.visibility = 'visible';
        timeline.add({
            targets: siteFooter,
            translateY: [50, 0], // Slide up from bottom
            opacity: [0, 1],
            duration: 800
        }, '-=500'); // Start a bit after bottomButtons or overlap
    }

    // Enhanced button animations for .action-buttons
    const actionButtonsLinks = document.querySelectorAll('.action-buttons a.button');
    if (actionButtonsLinks.length > 0 && typeof anime !== 'undefined') {
        actionButtonsLinks.forEach(button => {
            // Hover animation
            button.addEventListener('mouseenter', () => {
                anime.remove(button); // Remove any ongoing animations on this element
                anime({
                    targets: button,
                    scale: 1.05,
                    boxShadow: '0px 8px 15px rgba(0,0,0,0.2)',
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });

            button.addEventListener('mouseleave', () => {
                anime.remove(button);
                anime({
                    targets: button,
                    scale: 1.0,
                    boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', // Assuming a default box-shadow, adjust if needed
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });

            // Click animation
            button.addEventListener('mousedown', () => {
                anime.remove(button);
                anime({
                    targets: button,
                    scale: 0.95,
                    duration: 100,
                    easing: 'easeOutQuad'
                });
            });

            button.addEventListener('mouseup', () => {
                anime.remove(button);
                anime({ // Animate back to hover state or base state
                    targets: button,
                    scale: 1.05, // Or 1.0 if not returning to hover state
                    duration: 100,
                    easing: 'easeOutQuad'
                });
            });
        });
    }
});
