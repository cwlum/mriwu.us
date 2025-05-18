// Patreon Button JavaScript
document.querySelectorAll('.patreon-button').forEach(btn => {
  btn.addEventListener('click', function(e) {
    // Allow default link behavior unless it's a left click on the button or its children
    if (!btn.contains(e.target) || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
    }
    // e.preventDefault(); // Allow link navigation

    var rect = btn.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    
    // Use specific class names for Patreon ripples
    ['patreon-ripple', 'patreon-ripple2'].forEach((rippleClass, i) => {
      var circle = document.createElement('span');
      circle.classList.add(rippleClass);
      circle.style.left = (x - 10) + 'px'; // Assuming ripple element is 20x20
      circle.style.top = (y - 10) + 'px'; // Assuming ripple element is 20x20
      
      // Remove existing ripple of the same type before adding a new one
      var existingPatreonRipple = btn.querySelector('.' + rippleClass);
      if (existingPatreonRipple) {
          existingPatreonRipple.remove();
      }

      btn.appendChild(circle);
      setTimeout(() => {
        circle.remove();
      }, (rippleClass === 'patreon-ripple' ? 600 : 900));
    });
    // setTimeout(() => { // Allow link navigation
    //     window.location.href = btn.href;
    // }, 100);
  });
});
