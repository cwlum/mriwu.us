// VGen Button JavaScript
document.querySelectorAll('.vgen-button').forEach(btn => {
  btn.addEventListener('click', function(e) {
    // Don't create ripple if the click is not on the button or its children,
    // or if it's a middle/right click or ctrl/meta/shift click
    if (!btn.contains(e.target) || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) {
        // Allow default link behavior
        return;
    }

    var rect = btn.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var ripple = document.createElement('span');
    ripple.classList.add('ripple'); // This is for VGen button, CSS class is .vgen-button .ripple
    ripple.style.left = (x - 10) + 'px'; 
    ripple.style.top = (y - 10) + 'px'; 
    
    var existingRipple = btn.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    btn.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600); 
  });
});
