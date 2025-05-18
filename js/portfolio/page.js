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

    function setupControls() {
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
        allItemsDOMElements.forEach(itemElement => {
            const itemCategory = itemElement.dataset.category || '';
            const itemCaptionText = itemElement.querySelector('.caption')?.textContent.toLowerCase() || '';
            const itemAltText = itemElement.querySelector('img')?.alt.toLowerCase() || '';

            const categoryMatch = currentCategoryFilter === 'all' || itemCategory === currentCategoryFilter;
            const searchTermMatch = currentSearchTerm === '' || itemCaptionText.includes(currentSearchTerm) || itemAltText.includes(currentSearchTerm);

            if (categoryMatch && searchTermMatch) {
                itemElement.style.display = ''; 
            } else {
                itemElement.style.display = 'none'; 
            }
        });
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
    });

    if (portfolioItems.length > 0) {
        setupControls();
    }
});
