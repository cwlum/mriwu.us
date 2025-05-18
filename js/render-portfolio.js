document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.masonry-grid');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const prevModalBtn = document.querySelector('.prev-modal-btn');
    const nextModalBtn = document.querySelector('.next-modal-btn');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const searchInput = document.getElementById('portfolio-search');

    let currentModalItemIndex = 0; // To track the currently displayed item in the modal

    // Check if modal elements exist
    if (!modal || !modalImage || !modalCaption || !closeModalBtn || !prevModalBtn || !nextModalBtn) {
        console.error('Modal elements (including nav buttons) not found. Ensure they are in portfolio.html');
    } else {
        function closeModal() {
            modal.style.display = 'none';
        }

        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });

        function showItemInModal(index) {
            if (index < 0 || index >= portfolioItems.length) {
                console.warn('Attempted to show item out of bounds:', index);
                return;
            }
            currentModalItemIndex = index;
            const item = portfolioItems[index];
            
            modalImage.src = item.imgSrc;
            modalCaption.textContent = item.caption || item.altText || 'Artwork';
            modal.style.display = 'block';

            // Update nav button visibility
            prevModalBtn.classList.toggle('hidden', currentModalItemIndex === 0);
            nextModalBtn.classList.toggle('hidden', currentModalItemIndex === portfolioItems.length - 1);
        }

        prevModalBtn.addEventListener('click', function() {
            if (currentModalItemIndex > 0) {
                showItemInModal(currentModalItemIndex - 1);
            }
        });

        nextModalBtn.addEventListener('click', function() {
            if (currentModalItemIndex < portfolioItems.length - 1) {
                showItemInModal(currentModalItemIndex + 1);
            }
        });
        
        document.addEventListener('keydown', function(event) {
            if (modal.style.display === 'block') {
                if (event.key === 'Escape') {
                    closeModal();
                } else if (event.key === 'ArrowLeft') {
                    if (currentModalItemIndex > 0) {
                        showItemInModal(currentModalItemIndex - 1);
                    }
                } else if (event.key === 'ArrowRight') {
                    if (currentModalItemIndex < portfolioItems.length - 1) {
                        showItemInModal(currentModalItemIndex + 1);
                    }
                }
            }
        });
    }

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

    // --- Combined Filtering Logic (Category & Search) ---
    let allItemsDOMElements = []; // To store all masonry DOM elements for filtering
    let currentCategoryFilter = 'all'; // Default category filter
    let currentSearchTerm = ''; // Default search term

    function setupControls() {
        // Setup Category Filters
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

        // Setup Search Input
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
        // When applying filters, we need to consider which items are visible to determine the "gallery" for modal navigation.
        // However, for simplicity, modal navigation will always iterate through the *entire* portfolioItems list.
        // Filtering only affects the grid display.
        allItemsDOMElements.forEach(itemElement => {
            const itemCategory = itemElement.dataset.category || '';
            const itemCaptionText = itemElement.querySelector('.caption')?.textContent.toLowerCase() || '';
            const itemAltText = itemElement.querySelector('img')?.alt.toLowerCase() || '';

            const categoryMatch = currentCategoryFilter === 'all' || itemCategory === currentCategoryFilter;
            const searchTermMatch = currentSearchTerm === '' || itemCaptionText.includes(currentSearchTerm) || itemAltText.includes(currentSearchTerm);

            if (categoryMatch && searchTermMatch) {
                itemElement.style.display = ''; // Show item
            } else {
                itemElement.style.display = 'none'; // Hide item
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
    // --- End Combined Filtering Logic ---

    portfolioItems.forEach((item, index) => { // Added index here
        const masonryItem = document.createElement('div');
        masonryItem.classList.add('masonry-item');
        if (item.category) {
            masonryItem.dataset.category = item.category.toLowerCase().replace(/\s+/g, '-');
        }
        // Store original index for modal navigation
        masonryItem.dataset.originalIndex = index;


        const img = document.createElement('img');
        img.src = item.imgSrc;
        img.alt = item.altText || 'Portfolio image';
        img.loading = 'lazy';

        if (modal && modalImage && modalCaption && prevModalBtn && nextModalBtn) { // Check all modal related elements
            img.addEventListener('click', function() {
                // The 'item' from the forEach closure is the correct data object.
                // We need its index in the original portfolioItems array.
                // The 'index' from the forEach ((item, index) => ...) is what we need.
                showItemInModal(index);
            });
        }

        const caption = document.createElement('div');
        caption.classList.add('caption');
        caption.textContent = item.caption || 'Untitled';

        masonryItem.appendChild(img);
        masonryItem.appendChild(caption);
        grid.appendChild(masonryItem);
        allItemsDOMElements.push(masonryItem); // Add to DOM elements array for filtering grid display
    });

    // Initialize filters and search controls
    if (portfolioItems.length > 0) {
        setupControls();
    }
});
