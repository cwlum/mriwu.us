document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.masonry-grid');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const searchInput = document.getElementById('portfolio-search');

    if (!grid || !categoryFiltersContainer || !searchInput) {
        console.error('One or more essential portfolio components are missing.');
        return;
    }

    if (typeof portfolioItems === 'undefined' || !Array.isArray(portfolioItems)) {
        grid.innerHTML = '<p class="portfolio-error">Could not load portfolio items.</p>';
        return;
    }

    let allItemsDOMElements = [];
    let currentCategoryFilter = 'all';
    let currentSearchTerm = '';

    /**
     * Creates a single portfolio item element.
     * @param {object} item - The portfolio item data.
     * @param {number} index - The index of the item.
     * @returns {HTMLElement} The created portfolio item element.
     */
    function createPortfolioItem(item, index) {
        const masonryItem = document.createElement('div');
        masonryItem.classList.add('masonry-item');
        if (item.category) {
            masonryItem.dataset.category = item.category.toLowerCase().replace(/\s+/g, '-');
        }
        masonryItem.dataset.originalIndex = index;

        const img = document.createElement('img');
        img.src = item.imgSrc;
        img.alt = item.altText || 'Portfolio image';
        img.loading = 'lazy';

        const caption = document.createElement('div');
        caption.classList.add('caption');
        caption.textContent = item.caption || 'Untitled';

        masonryItem.appendChild(img);
        masonryItem.appendChild(caption);
        return masonryItem;
    }

    /**
     * Renders all portfolio items efficiently using a DocumentFragment.
     */
    function renderPortfolioItems() {
        const fragment = document.createDocumentFragment();
        portfolioItems.forEach((item, index) => {
            const itemElement = createPortfolioItem(item, index);
            allItemsDOMElements.push(itemElement);
            fragment.appendChild(itemElement);
        });
        grid.appendChild(fragment);
    }

    /**
     * Sets up event listeners for category filters and search input.
     */
    function setupControls() {
        const categories = ['All', ...new Set(portfolioItems.map(item => item.category).filter(Boolean))];
        const fragment = document.createDocumentFragment();
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
            button.dataset.categoryFilter = categorySlug;
            if (category === 'All') button.classList.add('active');
            fragment.appendChild(button);
        });
        categoryFiltersContainer.appendChild(fragment);

        categoryFiltersContainer.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                currentCategoryFilter = e.target.dataset.categoryFilter;
                applyFilters();
                updateActiveCategoryButton(e.target);
            }
        });

        searchInput.addEventListener('input', function() {
            currentSearchTerm = this.value.toLowerCase();
            applyFilters();
        });

        const initialSearchTerm = new URLSearchParams(window.location.search).get('search');
        if (initialSearchTerm) {
            searchInput.value = initialSearchTerm;
            currentSearchTerm = initialSearchTerm.toLowerCase();
        }
    }

    /**
     * Applies filters and animates the grid.
     */
    function applyFilters() {
        const itemsToShow = [];
        const itemsToHide = [];

        allItemsDOMElements.forEach(itemElement => {
            const itemCategory = itemElement.dataset.category || '';
            const itemCaptionText = itemElement.querySelector('.caption')?.textContent.toLowerCase() || '';
            const itemAltText = itemElement.querySelector('img')?.alt.toLowerCase() || '';
            const categoryMatch = currentCategoryFilter === 'all' || itemCategory === currentCategoryFilter;
            const searchTermMatch = !currentSearchTerm || itemCaptionText.includes(currentSearchTerm) || itemAltText.includes(currentSearchTerm);

            if (categoryMatch && searchTermMatch) {
                itemsToShow.push(itemElement);
            } else {
                itemsToHide.push(itemElement);
            }
        });

        if (typeof anime === 'undefined') {
            itemsToHide.forEach(item => item.style.display = 'none');
            itemsToShow.forEach(item => item.style.display = '');
            return;
        }

        const timeline = anime.timeline({ duration: 350, easing: 'easeOutCubic' });
        if (itemsToHide.length > 0) {
            timeline.add({
                targets: itemsToHide,
                opacity: 0,
                scale: 0.9,
                translateY: -15,
                delay: anime.stagger(40),
                complete: (anim) => anim.animatables.forEach(a => a.target.style.display = 'none')
            });
        }

        if (itemsToShow.length > 0) {
            itemsToShow.forEach(item => {
                item.style.display = '';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9) translateY(15px)';
            });
            timeline.add({
                targets: itemsToShow,
                opacity: 1,
                scale: 1,
                translateY: 0,
                delay: anime.stagger(40)
            }, itemsToHide.length > 0 ? '-=100' : '+=0');
        }
    }

    /**
     * Updates the active state of category filter buttons.
     * @param {HTMLElement} activeButton - The button to mark as active.
     */
    function updateActiveCategoryButton(activeButton) {
        categoryFiltersContainer.querySelectorAll('button').forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');
    }

    /**
     * Sets up all event listeners using event delegation for performance.
     */
    function setupEventListeners() {
        grid.addEventListener('click', function(e) {
            const item = e.target.closest('.masonry-item');
            if (item && typeof window.showPortfolioItemInModal === 'function') {
                const index = parseInt(item.dataset.originalIndex, 10);
                window.showPortfolioItemInModal(index);
            }
        });

        if (typeof anime !== 'undefined') {
            grid.addEventListener('mouseenter', (e) => {
                const item = e.target.closest('.masonry-item');
                if (!item) return;
                const img = item.querySelector('img');
                const caption = item.querySelector('.caption');
                anime.remove([item, img, caption]);
                anime({ targets: item, translateY: -8, boxShadow: '0 12px 24px rgba(0,0,0,0.35)', duration: 300, easing: 'easeOutCubic' });
                if (img) anime({ targets: img, scale: 1.08, duration: 400, easing: 'easeOutCubic' });
                if (caption) anime({ targets: caption, translateY: '0%', opacity: 1, duration: 300, easing: 'easeOutCubic' });
            }, true);

            grid.addEventListener('mouseleave', (e) => {
                const item = e.target.closest('.masonry-item');
                if (!item) return;
                const img = item.querySelector('img');
                const caption = item.querySelector('.caption');
                anime.remove([item, img, caption]);
                anime({ targets: item, translateY: 0, boxShadow: '0 4px 8px rgba(0,0,0,0.2)', duration: 400, easing: 'easeOutCubic' });
                if (img) anime({ targets: img, scale: 1.0, duration: 400, easing: 'easeOutCubic' });
                if (caption) anime({ targets: caption, translateY: '100%', opacity: 0, duration: 400, easing: 'easeOutCubic' });
            }, true);
        }
    }

    /**
     * Runs the initial entrance animation for the portfolio items.
     */
    function runEntranceAnimation() {
        if (typeof anime !== 'undefined' && allItemsDOMElements.length > 0) {
            allItemsDOMElements.forEach(el => el.style.visibility = 'visible');
            anime({
                targets: allItemsDOMElements,
                opacity: [0, 1],
                scale: [0.9, 1],
                translateY: [30, 0],
                delay: anime.stagger(80),
                duration: 450,
                easing: 'easeOutCubic',
            });
        } else {
            allItemsDOMElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'scale(1)';
                el.style.visibility = 'visible';
            });
        }
    }

    /**
     * Main initialization function.
     */
    function init() {
        grid.innerHTML = '';
        categoryFiltersContainer.innerHTML = '';

        if (portfolioItems.length === 0) {
            grid.innerHTML = '<p>No portfolio items to display currently.</p>';
            return;
        }

        // Sort portfolio items by date (newest first)
        portfolioItems.sort((a, b) => {
            const dateA = new Date(a.caption.match(/\d{4}-\d{2}-\d{2}/) || 0);
            const dateB = new Date(b.caption.match(/\d{4}-\d{2}-\d{2}/) || 0);
            return dateB - dateA;
        });

        renderPortfolioItems();
        setupControls();
        setupEventListeners();
        runEntranceAnimation();

        if (currentSearchTerm) {
            applyFilters();
        }
    }

    init();
});
