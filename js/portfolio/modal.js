document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const prevModalBtn = document.querySelector('.prev-modal-btn');
    const nextModalBtn = document.querySelector('.next-modal-btn');

    let currentModalIndex = 0;
    let openTimeout, closeTimeout;

    if (!modal || !modalImage || !modalCaption || !closeModalBtn || !prevModalBtn || !nextModalBtn) {
        console.error('Modal elements not found.');
        return;
    }

    function closeModal() {
        clearTimeout(openTimeout);
        clearTimeout(closeTimeout);
        modal.classList.remove('modal-opening');
        modal.classList.add('modal-closing');
        closeTimeout = setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('modal-closing');
        }, 400);
    }

    // Expose openModal to the global scope
    window.openModal = function(index) {
        clearTimeout(openTimeout);
        clearTimeout(closeTimeout);

        if (typeof portfolioData === 'undefined' || index < 0 || index >= portfolioData.length) {
            console.error('portfolioData not available or index out of bounds:', index);
            return;
        }
        currentModalIndex = index;
        const item = portfolioData[index];

        modalImage.src = item.src;
        modalCaption.textContent = item.title;

        modal.classList.remove('modal-closing');
        modal.style.display = 'block';
        modal.classList.add('modal-opening');

        openTimeout = setTimeout(() => {
            modal.classList.remove('modal-opening');
        }, 400);

        updateNavButtons();
    };

    function updateNavButtons() {
        prevModalBtn.style.display = currentModalIndex === 0 ? 'none' : 'block';
        nextModalBtn.style.display = currentModalIndex === portfolioData.length - 1 ? 'none' : 'block';
    }

    function showPrev() {
        if (currentModalIndex > 0) {
            currentModalIndex--;
            window.openModal(currentModalIndex);
            if (window.updateCarouselFromModal) {
                window.updateCarouselFromModal(currentModalIndex);
            }
        }
    }

    function showNext() {
        if (currentModalIndex < portfolioData.length - 1) {
            currentModalIndex++;
            window.openModal(currentModalIndex);
            if (window.updateCarouselFromModal) {
                window.updateCarouselFromModal(currentModalIndex);
            }
        }
    }

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    prevModalBtn.addEventListener('click', showPrev);
    nextModalBtn.addEventListener('click', showNext);

    document.addEventListener('keydown', (event) => {
        if (modal.style.display === 'block') {
            if (event.key === 'Escape') closeModal();
            if (event.key === 'ArrowLeft') showPrev();
            if (event.key === 'ArrowRight') showNext();
        }
    });
});
