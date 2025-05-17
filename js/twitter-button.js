// Twitter Follow Button JavaScript Ripple Effect
document.querySelectorAll('.twitter-follow-button').forEach(btn => {
  btn.addEventListener('click', function(e) {
    // Allow default link behavior unless it's a direct left click on the button itself
    // and not a modifier key click
    if (e.target !== btn || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) {
        // Allow default link behavior to proceed
        return;
    }
    // If we want to ensure ripple plays out before navigation, we might e.preventDefault()
    // and then navigate after a timeout, but for now, let navigation happen.

    let rect = btn.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let ripple = document.createElement('span');
    ripple.classList.add('twitter-ripple-effect'); // Specific class for this ripple
    ripple.style.left = (x - 10) + 'px'; // Assuming ripple element is 20x20 for centering
    ripple.style.top = (y - 10) + 'px';
    
    // Remove any existing ripple to prevent multiple ripples if clicked fast
    let existingRipple = btn.querySelector('.twitter-ripple-effect');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    btn.appendChild(ripple);

    // Remove the ripple after the animation completes
    setTimeout(() => {
      if (ripple.parentNode) { // Check if ripple still exists and has a parent
        ripple.remove();
      }
    }, 700); // Duration should match CSS animation
  });
});
