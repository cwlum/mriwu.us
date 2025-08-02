// js/modules/page-animations.js

function initializePageAnimations() {
    const mainTimeline = anime.timeline({
        easing: 'easeOutCubic', // A slightly faster easing
        duration: 650, // Faster overall duration
        complete: (anim) => {
            // Clean up inline styles after animation is complete for all targets
            anim.animatables.forEach(animatable => {
                const el = animatable.target;
                el.style.transform = '';
                el.style.opacity = '';
                el.style.visibility = '';
            });
        }
    });

    const makeVisible = (anim) => {
        anim.animatables.forEach(animatable => {
            animatable.target.style.visibility = 'visible';
        });
    };

    // Animate Header
    mainTimeline.add({
        targets: '.site-header',
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: 500, // Faster
        begin: makeVisible
    });

    // Animate Main Content and Footer together
    mainTimeline.add({
        targets: '.site-main > *:not(script):not(style), .site-footer-bottom',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(70), // Apply stagger to all elements
        begin: makeVisible
    }, '-=300'); // Overlap slightly more

    // Optimized Button Animations
    const allButtons = document.querySelectorAll('.button');
    allButtons.forEach(button => {
        const hoverAnimation = {
            targets: button,
            scale: 1.05,
            duration: 300,
            easing: 'easeOutQuad'
        };

        const leaveAnimation = {
            targets: button,
            scale: 1.0,
            duration: 300,
            easing: 'easeOutQuad'
        };

        button.addEventListener('mouseenter', () => anime(hoverAnimation));
        button.addEventListener('mouseleave', () => anime(leaveAnimation));
    });
}

export { initializePageAnimations };
