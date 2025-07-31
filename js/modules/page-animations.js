// js/utils/page-animations.js
function initializePageAnimations() {
    const mainTimeline = anime.timeline({});
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        siteHeader.style.visibility = 'visible';
        mainTimeline.add({
            targets: siteHeader,
            translateY: [-20, 0],
            opacity: [0, 1],
            duration: 550,
            easing: 'easeOutExpo'
        });
    }
    const mainContentElements = document.querySelectorAll('.site-main > *:not(script):not(style)');
    if (mainContentElements.length > 0) {
        const animationPresets = [
            { translateX: [-30, 0], opacity: [0, 1], scale: [0.95, 1] },
            { translateX: [30, 0], opacity: [0, 1], scale: [0.95, 1] },
            { translateY: [30, 0], opacity: [0, 1], scale: [0.95, 1] },
            { opacity: [0, 1], scale: [0.8, 1] }
        ];
        mainContentElements.forEach((el, i) => {
            el.style.visibility = 'visible';
            const preset = animationPresets[i % animationPresets.length];
            mainTimeline.add({
                targets: el,
                ...preset,
                duration: 550,
                easing: 'easeOutExpo'
            }, `-=${380 - i * 20}`);
        });
    }
    const siteFooter = document.querySelector('.site-footer-bottom');
    if (siteFooter) {
        siteFooter.style.visibility = 'visible';
        mainTimeline.add({
            targets: siteFooter,
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 550,
            easing: 'easeOutExpo'
        }, '-=350');
    }
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
}

export { initializePageAnimations };