document.addEventListener('DOMContentLoaded', () => {
    if (typeof anime === 'undefined') {
        console.warn('anime.js not loaded, page animations will not run.');
        return;
    }

    const mainTimeline = anime.timeline({
        // Easing is now defined in each animation for more control
    });

    // --- 1. Animate Header ---
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        siteHeader.style.visibility = 'visible';
        mainTimeline.add({
            targets: siteHeader,
            translateY: [-20, 0],
            opacity: [0, 1],
            duration: 550, // User specified
            easing: 'easeOutExpo' // Spring won't resolve in 400ms, switch to a fast easing
        });
    }

    // --- 2. Diverse Main Content Animation ---
    const mainContentElements = document.querySelectorAll('.site-main > *:not(script):not(style)');
    
    if (mainContentElements.length > 0) {
        // Define a set of animation presets
        const animationPresets = [
            { translateX: [-30, 0], opacity: [0, 1], scale: [0.95, 1] },
            { translateX: [30, 0], opacity: [0, 1], scale: [0.95, 1] },
            { translateY: [30, 0], opacity: [0, 1], scale: [0.95, 1] },
            { opacity: [0, 1], scale: [0.8, 1] }
        ];

        mainContentElements.forEach((el, i) => {
            el.style.visibility = 'visible';
            // Pick a preset based on index to create variety
            const preset = animationPresets[i % animationPresets.length];
            
            mainTimeline.add({
                targets: el,
                ...preset, // Spread the preset properties
                duration: 550, // User specified
                easing: 'easeOutExpo'
            }, `-=${380 - i * 20}`); // Adjust cascade for 400ms
        });
    }

    // --- 3. Animate Footer ---
    const siteFooter = document.querySelector('.site-footer-bottom');
    if (siteFooter) {
        siteFooter.style.visibility = 'visible';
        mainTimeline.add({
            targets: siteFooter,
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 550,
            easing: 'easeOutExpo'
        }, '-=350'); // Adjust cascade for 400ms
    }

    // --- 4. Enhanced Button Hover/Click Animations ---
    const allButtons = document.querySelectorAll('.button');
    if (allButtons.length > 0) {
        allButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                anime.remove(button);
                anime({ targets: button, scale: 1.05, duration: 250, easing: 'easeOutQuad' });
            });
            button.addEventListener('mouseleave', () => {
                anime.remove(button);
                anime({ targets: button, scale: 1.0, duration: 400, easing: 'easeOutQuad' });
            });
            button.addEventListener('mousedown', () => {
                anime.remove(button);
                anime({ targets: button, scale: 0.95, duration: 150, easing: 'easeOutQuad' });
            });
            button.addEventListener('mouseup', () => {
                anime.remove(button);
                anime({ targets: button, scale: 1.0, duration: 200, easing: 'easeOutQuad' });
            });
        });
    }
});
