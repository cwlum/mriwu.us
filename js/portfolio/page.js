document.addEventListener('DOMContentLoaded', function() {
    // This script assumes 'portfolioItems' is globally available from portfolio-data.js
    // and 'window.showPortfolioItemInModal' is available from portfolio-modal.js

    const grid = document.querySelector('.masonry-grid');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const searchInput = document.getElementById('portfolio-search');

    // Check if portfolioItems is defined (should be by portfolio-data.js)
    if (typeof portfolioItems === 'undefined' || !Array.isArray(portfolioItems)) {
        console.error('Portfolio data is not loaded or is not an array.');
        if (grid) {
            grid.innerHTML = '<p style="text-align: center; color: #ff6b6b;">Could not load portfolio items.</p>';
        }
        return;
    }

    if (!grid) {
        console.error('Masonry grid container not found.');
        return;
    }

    if (portfolioItems.length === 0) {
        grid.innerHTML = '<p style="text-align: center;">No portfolio items to display currently.</p>';
        return;
    }

    let allItemsDOMElements = [];
    let currentCategoryFilter = 'all';
    let currentSearchTerm = '';

    // Function to get URL parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function setupControls() {
        // Pre-fill search from URL if present
        const initialSearchTerm = getQueryParam('search');
        if (searchInput && initialSearchTerm) {
            searchInput.value = initialSearchTerm;
            currentSearchTerm = initialSearchTerm.toLowerCase();
            // applyFilters will be called after items are rendered
        }

        if (categoryFiltersContainer) {
            const categories = ['All', ...new Set(portfolioItems.map(item => item.category).filter(Boolean))];
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category;
                const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
                button.dataset.categoryFilter = categorySlug;
                if (category === 'All') {
                    button.classList.add('active');
                }
                button.addEventListener('click', function() {
                    currentCategoryFilter = this.dataset.categoryFilter;
                    applyFilters();
                    updateActiveCategoryButton(this);
                });
                categoryFiltersContainer.appendChild(button);

                // Add anime.js hover/click animations if anime is available
                if (typeof anime !== 'undefined') {
                    button.addEventListener('mouseenter', () => {
                        anime.remove(button);
                        anime({
                            targets: button,
                            scale: 1.08,
                            duration: 200,
                            easing: 'easeOutQuad'
                        });
                    });
                    button.addEventListener('mouseleave', () => {
                        anime.remove(button);
                        anime({
                            targets: button,
                            scale: 1.0,
                            duration: 300,
                            easing: 'easeOutQuad'
                        });
                    });
                    button.addEventListener('mousedown', () => {
                        anime.remove(button);
                        anime({
                            targets: button,
                            scale: 0.95,
                            duration: 100,
                            easing: 'easeOutQuad'
                        });
                    });
                    button.addEventListener('mouseup', (e) => { // Pass event to check if mouse left while pressed
                        anime.remove(button);
                        // Check if mouse is still over the button; if so, return to hover state
                        const isMouseStillOver = button.matches(':hover');
                        anime({
                            targets: button,
                            scale: isMouseStillOver ? 1.08 : 1.0,
                            duration: 100,
                            easing: 'easeOutQuad'
                        });
                    });
                }
            });
        } else {
            console.error('Category filters container not found.');
        }

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                currentSearchTerm = this.value.toLowerCase();
                applyFilters();
            });
        } else {
            console.error('Search input not found.');
        }
    }

    function applyFilters() {
        if (typeof anime === 'undefined') {
            // Fallback to simple show/hide if anime.js is not loaded
            allItemsDOMElements.forEach(itemElement => {
                const itemCategory = itemElement.dataset.category || '';
                const itemCaptionText = itemElement.querySelector('.caption')?.textContent.toLowerCase() || '';
                const itemAltText = itemElement.querySelector('img')?.alt.toLowerCase() || '';
                const categoryMatch = currentCategoryFilter === 'all' || itemCategory === currentCategoryFilter;
                const searchTermMatch = currentSearchTerm === '' || itemCaptionText.includes(currentSearchTerm) || itemAltText.includes(currentSearchTerm);
                itemElement.style.display = (categoryMatch && searchTermMatch) ? '' : 'none';
            });
            return;
        }

        const itemsToShow = [];
        const itemsToHide = [];

        allItemsDOMElements.forEach(itemElement => {
            const itemCategory = itemElement.dataset.category || '';
            const itemCaptionText = itemElement.querySelector('.caption')?.textContent.toLowerCase() || '';
            const itemAltText = itemElement.querySelector('img')?.alt.toLowerCase() || '';

            const categoryMatch = currentCategoryFilter === 'all' || itemCategory === currentCategoryFilter;
            const searchTermMatch = currentSearchTerm === '' || itemCaptionText.includes(currentSearchTerm) || itemAltText.includes(currentSearchTerm);

            if (categoryMatch && searchTermMatch) {
                itemsToShow.push(itemElement);
            } else {
                itemsToHide.push(itemElement);
            }
        });

        // Animate hiding items
        if (itemsToHide.length > 0) {
            anime({
                targets: itemsToHide,
                opacity: 0,
                scale: 0.8,
                duration: 300,
                easing: 'easeInQuad',
                delay: anime.stagger(50),
                complete: (anim) => {
                    anim.animatables.forEach(animatable => {
                        animatable.target.style.display = 'none';
                    });
                }
            });
        }

        // Animate showing items
        if (itemsToShow.length > 0) {
            // First, make them visible and set initial state for animation if they were hidden
            itemsToShow.forEach(item => {
                item.style.display = ''; // Or 'block', 'flex' etc. depending on item's display type
                item.style.opacity = '0'; // Ensure opacity is 0 before fade-in
                item.style.transform = 'scale(0.8)'; // Ensure scale is small before scale-up
            });

            anime({
                targets: itemsToShow,
                opacity: 1,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad',
                delay: anime.stagger(50, { start: itemsToHide.length > 0 ? 150 : 0 }) // Delay if hiding happened
            });
        }
    }

    function updateActiveCategoryButton(activeButton) {
        if (categoryFiltersContainer) {
            const buttons = categoryFiltersContainer.querySelectorAll('button');
            buttons.forEach(button => button.classList.remove('active'));
            activeButton.classList.add('active');
        }
    }

    portfolioItems.forEach((item, index) => {
        const masonryItem = document.createElement('div');
        masonryItem.classList.add('masonry-item');
        if (item.category) {
            masonryItem.dataset.category = item.category.toLowerCase().replace(/\s+/g, '-');
        }
        masonryItem.dataset.originalIndex = index; // Keep original index if needed

        const img = document.createElement('img');
        img.src = item.imgSrc;
        img.alt = item.altText || 'Portfolio image';
        img.loading = 'lazy';

        // Add click event to image to open modal using the global function
        if (typeof window.showPortfolioItemInModal === 'function') {
            img.addEventListener('click', function() {
                window.showPortfolioItemInModal(index);
            });
        } else {
            // Fallback or error if modal function isn't ready/available
            // This might happen if portfolio-modal.js hasn't loaded or executed yet
            // For simplicity, we'll log an error. Robust solution might involve event queue or promises.
            console.error('showPortfolioItemInModal function not found. Ensure portfolio-modal.js is loaded.');
        }

        const caption = document.createElement('div');
        caption.classList.add('caption');
        caption.textContent = item.caption || 'Untitled';

        masonryItem.appendChild(img);
        masonryItem.appendChild(caption);
        grid.appendChild(masonryItem);
        allItemsDOMElements.push(masonryItem);

        // Add hover animations if anime.js is available
        if (typeof anime !== 'undefined') {
            const itemImage = masonryItem.querySelector('img');
            const itemCaption = masonryItem.querySelector('.caption');

            masonryItem.addEventListener('mouseenter', () => {
                anime.remove(masonryItem);
                if (itemImage) anime.remove(itemImage);
                if (itemCaption) anime.remove(itemCaption);

                anime({
                    targets: masonryItem,
                    translateY: -5,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    duration: 200,
                    easing: 'easeOutQuad'
                });
                if (itemImage) {
                    anime({
                        targets: itemImage,
                        scale: 1.1,
                        duration: 250, // Slightly longer for a smoother zoom
                        easing: 'easeOutQuad'
                    });
                }
                if (itemCaption) {
                    anime({
                        targets: itemCaption,
                        translateY: ['100%', '0%'],
                        opacity: [0, 1],
                        duration: 250,
                        easing: 'easeOutQuad'
                    });
                }
            });
            masonryItem.addEventListener('mouseleave', () => {
                anime.remove(masonryItem);
                if (itemImage) anime.remove(itemImage);
                if (itemCaption) anime.remove(itemCaption);

                anime({
                    targets: masonryItem,
                    translateY: 0,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Matches default shadow
                    duration: 300,
                    easing: 'easeOutQuad'
                });
                if (itemImage) {
                    anime({
                        targets: itemImage,
                        scale: 1.0,
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
                if (itemCaption) {
                    anime({
                        targets: itemCaption,
                        translateY: ['0%', '100%'],
                        opacity: [1, 0],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                }
            });
        }
    });

    if (portfolioItems.length > 0) {
        setupControls();

        // Initial entrance animation for all items
        if (typeof anime !== 'undefined' && allItemsDOMElements.length > 0) {
            allItemsDOMElements.forEach(el => el.style.visibility = 'visible'); // Make them visible for animation
            anime({
                targets: allItemsDOMElements,
                opacity: [0, 1],
                scale: [0.8, 1],
                translateY: [20, 0], // Slight slide up
                delay: anime.stagger(100, { grid: [Math.ceil(allItemsDOMElements.length / 3), 3], from: 'center' }), // Stagger from center
                duration: 500,
                easing: 'easeOutQuad',
            });
        } else {
            // Fallback if anime.js is not loaded, just make them visible
             allItemsDOMElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'scale(1)';
                el.style.visibility = 'visible';
            });
        }
        
        // If there was an initial search term from URL, apply filters now that items are rendered
        // The entrance animation might run concurrently or just before filtering.
        // applyFilters will now also use anime.js if available.
        if (currentSearchTerm) {
            applyFilters();
        }
    }
});
