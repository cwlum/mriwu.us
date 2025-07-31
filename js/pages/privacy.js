// Script for details/summary animation
document.addEventListener('DOMContentLoaded', function () {
    const detailsElements = document.querySelectorAll('details.content-section');
    if (typeof anime === 'undefined') {
        console.warn('anime.js not loaded, details animations will not run.');
        return;
    }
    detailsElements.forEach(details => {
        const summary = details.querySelector('summary');
        const content = details.querySelector('div');
        let isDetailsAnimating = false;
        // Initialize styles for animation
        if (!details.hasAttribute('open')) {
            if (content) {
                content.style.height = '0';
                content.style.opacity = '0';
                content.style.paddingTop = '0';
                content.style.paddingBottom = '0';
                content.style.overflow = 'hidden';
            }
        } else {
             if (content) { content.style.overflow = 'hidden'; }
        }
        if (summary && content) {
            summary.addEventListener('click', (event) => {
                event.preventDefault();
                if (isDetailsAnimating) return;
                isDetailsAnimating = true;
                if (details.open) {
                    anime({
                        targets: content,
                        height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0,
                        duration: 300, easing: 'easeOutQuad',
                        complete: () => { details.open = false; isDetailsAnimating = false; }
                    });
                } else {
                    details.open = true;
                    anime({
                        targets: content,
                        height: [0, content.scrollHeight], opacity: [0, 1], paddingTop: [0, '15px'], paddingBottom: [0, '15px'],
                        duration: 300, easing: 'easeOutQuad',
                        complete: () => { content.style.height = ''; isDetailsAnimating = false; }
                    });
                }
            });
        }
    });
});
