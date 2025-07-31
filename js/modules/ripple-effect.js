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

export { initializeRippleEffects };