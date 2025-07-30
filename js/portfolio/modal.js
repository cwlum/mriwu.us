document.addEventListener('DOMContentLoaded', function() {
    // This script assumes 'portfolioItems' is globally available from portfolio-data.js

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const prevModalBtn = document.querySelector('.prev-modal-btn');
    const nextModalBtn = document.querySelector('.next-modal-btn');

    let currentModalItemIndex = 0;
    let openTimeout, closeTimeout; // Separate timeouts for opening and closing

    if (!modal || !modalImage || !modalCaption || !closeModalBtn || !prevModalBtn || !nextModalBtn) {
        console.error('Modal elements (including nav buttons) not found. Ensure they are in portfolio.html and correctly IDed/classed.');
        return; // Stop execution if essential modal elements are missing
    }

    function closeModal() {
        // Clear any pending animations to prevent conflicts
        clearTimeout(openTimeout);
        clearTimeout(closeTimeout);

        modal.classList.remove('modal-opening');
        modal.classList.add('modal-closing');

        closeTimeout = setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('modal-closing'); // Clean up class after animation
        }, 400); // Match CSS animation duration
    }

    // Public function to show an item in the modal
    window.showPortfolioItemInModal = function(index) {
        // Clear any pending animations to ensure a clean start
        clearTimeout(openTimeout);
        clearTimeout(closeTimeout);

        if (typeof portfolioItems === 'undefined' || !Array.isArray(portfolioItems) || index < 0 || index >= portfolioItems.length) {
            console.error('Portfolio items not available or index out of bounds:', index);
            return;
        }
        currentModalItemIndex = index;
        const item = portfolioItems[index];
        
        modalImage.src = item.imgSrc;
        modalCaption.textContent = item.caption || item.altText || 'Artwork';
        
        modal.classList.remove('modal-closing'); // Immediately remove closing class
        modal.style.display = 'block'; // Make modal visible
        modal.classList.add('modal-opening'); // Start opening animation

        // Use a timeout to remove the opening class after animation completes
        openTimeout = setTimeout(() => {
            modal.classList.remove('modal-opening');
        }, 400); // Match CSS animation duration

        // Update nav button visibility
        prevModalBtn.classList.toggle('hidden', currentModalItemIndex === 0);
        nextModalBtn.classList.toggle('hidden', currentModalItemIndex === portfolioItems.length - 1);
    }

    closeModalBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(event) {
        if (event.target === modal) { // Clicked on the modal background
            closeModal();
        }
    });

    prevModalBtn.addEventListener('click', function() {
        if (currentModalItemIndex > 0) {
            window.showPortfolioItemInModal(currentModalItemIndex - 1);
        }
    });

    nextModalBtn.addEventListener('click', function() {
        if (currentModalItemIndex < portfolioItems.length - 1) {
            window.showPortfolioItemInModal(currentModalItemIndex + 1);
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (modal.style.display === 'block') {
            if (event.key === 'Escape') {
                closeModal();
            } else if (event.key === 'ArrowLeft') {
                // Ensure prevModalBtn is not hidden before trying to navigate
                if (!prevModalBtn.classList.contains('hidden') && currentModalItemIndex > 0) {
                    window.showPortfolioItemInModal(currentModalItemIndex - 1);
                }
            } else if (event.key === 'ArrowRight') {
                 // Ensure nextModalBtn is not hidden
                if (!nextModalBtn.classList.contains('hidden') && currentModalItemIndex < portfolioItems.length - 1) {
                    window.showPortfolioItemInModal(currentModalItemIndex + 1);
                }
            }
        }
    });
});
