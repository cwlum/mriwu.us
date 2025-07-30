// js/buttons/ripple-effect.js
function initializeRippleEffects() {
    const rippleButtons = document.querySelectorAll('.vgen-button, .patreon-button, .twitter-follow-button');

    rippleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!btn.contains(e.target) || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) {
                return;
            }

            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Remove any existing ripples to prevent overlap
            const existingRipples = btn.querySelectorAll('.ripple');
            existingRipples.forEach(r => r.remove());

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Adjust position to center the ripple
            ripple.style.transform = `translate(-50%, -50%)`;

            btn.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 700); // Match the duration of the CSS animation
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeRippleEffects);

// js/components/navigation/nav-toggle.js
document.addEventListener('DOMContentLoaded', () => {
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
});

// js/components/navigation/sidebar-toggle.js
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
});

// js/utils/page-animations.js
document.addEventListener('DOMContentLoaded', () => {
    if (typeof anime === 'undefined') {
        console.warn('anime.js not loaded, page animations will not run.');
        return;
    }
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
});

// js/features/background-animations.js
document.addEventListener('DOMContentLoaded', () => {
    const animationContainer = document.getElementById('background-animation');
    if (!animationContainer) return;
    const numberOfShapes = 20;
    const shapeTypes = ['circle', 'square', 'triangle'];
    for (let i = 0; i < numberOfShapes; i++) {
        const shape = document.createElement('div');
        const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        shape.classList.add('shape', type);
        const size = Math.random() * 80 + 20;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        if (type === 'triangle') {
            const borderSize = size / 2;
            shape.style.width = '0';
            shape.style.height = '0';
            shape.style.borderLeftWidth = `${borderSize}px`;
            shape.style.borderRightWidth = `${borderSize}px`;
            shape.style.borderBottomWidth = `${size}px`;
        }
        shape.style.left = `${Math.random() * 100}vw`;
        const animationDuration = Math.random() * 15 + 10;
        const animationDelay = Math.random() * 10;
        shape.style.animationDuration = `${animationDuration}s`;
        shape.style.animationDelay = `-${animationDelay}s`;
        animationContainer.appendChild(shape);
    }
});
