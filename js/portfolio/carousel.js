document.addEventListener('DOMContentLoaded', () => {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const categoryFiltersContainer = document.getElementById('category-filters');

    if (!carouselWrapper || !prevButton || !nextButton || !categoryFiltersContainer) {
        console.error('Required elements not found!');
        return;
    }

    let currentIndex = 0;
    let currentFilter = 'All';
    let filteredData = [];

    function setupCategoryFilters() {
        const categories = ['All', ...new Set(portfolioData.map(item => item.category))];
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.classList.add('filter-btn');
            if (category === 'All') {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentFilter = category;
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                populateCarousel();
            });
            categoryFiltersContainer.appendChild(button);
        });
    }

    function calculateAndSetHeight() {
        const items = carouselWrapper.querySelectorAll('.carousel-item');
        if (items.length === 0) {
            carouselWrapper.style.height = '100px'; // A small default height
            return;
        }

        // Temporarily reset wrapper height to measure children accurately
        carouselWrapper.style.height = 'auto';

        let maxHeight = 0;
        items.forEach(item => {
            if (item.offsetHeight > maxHeight) {
                maxHeight = item.offsetHeight;
            }
        });

        if (maxHeight > 0) {
            carouselWrapper.style.height = `${maxHeight}px`;
        }
    }

    function populateCarousel() {
        filteredData = currentFilter === 'All' 
            ? [...portfolioData] 
            : portfolioData.filter(item => item.category === currentFilter);

        carouselWrapper.innerHTML = ''; // Clear existing items

        if (filteredData.length === 0) {
            carouselWrapper.innerHTML = '<p>No items in this category.</p>';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            calculateAndSetHeight(); // Set height even for empty state
            return;
        }
        
        prevButton.style.display = 'flex';
        nextButton.style.display = 'flex';

        const imageLoadPromises = [];

        filteredData.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('carousel-item');
            itemElement.setAttribute('role', 'group');
            itemElement.setAttribute('aria-label', `${index + 1} of ${filteredData.length}`);
            itemElement.dataset.originalIndex = portfolioData.indexOf(item);
            itemElement.dataset.filteredIndex = index;

            const image = document.createElement('img');
            image.src = item.src;
            image.alt = item.title;
            image.loading = index === 0 ? 'eager' : 'lazy';

            const imageLoadPromise = new Promise((resolve) => {
                image.onload = resolve;
                image.onerror = resolve; // Resolve even on error to not block the process
            });
            imageLoadPromises.push(imageLoadPromise);

            const caption = document.createElement('div');
            caption.classList.add('caption');
            caption.textContent = item.title;

            itemElement.appendChild(image);
            itemElement.appendChild(caption);
            carouselWrapper.appendChild(itemElement);
        });

        // Wait for all images to load before calculating height
        Promise.all(imageLoadPromises).then(() => {
            calculateAndSetHeight();
            currentIndex = 0; // Reset to the first item
            updateCarousel(false); // Update without smooth scroll initially
            setupIntersectionObserver();
        });
    }

    function updateCarousel(smooth = true) {
        const items = document.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        if (currentIndex >= items.length) currentIndex = items.length - 1;
        if (currentIndex < 0) currentIndex = 0;

        const itemWidth = items[0].offsetWidth;
        const scrollPosition = currentIndex * itemWidth;

        carouselWrapper.scrollTo({
            left: scrollPosition,
            behavior: smooth ? 'smooth' : 'auto'
        });

        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });
    }

    window.updateCarouselFromModal = function(newOriginalIndex) {
        const newFilteredIndex = filteredData.findIndex(item => portfolioData.indexOf(item) === newOriginalIndex);
        if (newFilteredIndex !== -1) {
            currentIndex = newFilteredIndex;
            updateCarousel();
        }
    };

    function showNext() {
        const items = document.querySelectorAll('.carousel-item');
        if (items.length === 0) return;
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }

    function showPrev() {
        const items = document.querySelectorAll('.carousel-item');
        if (items.length === 0) return;
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    }

    nextButton.addEventListener('click', showNext);
    prevButton.addEventListener('click', showPrev);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showPrev();
        } else if (e.key === 'ArrowRight') {
            showNext();
        }
    });

    carouselWrapper.addEventListener('click', (e) => {
        const targetItem = e.target.closest('.carousel-item');
        if (targetItem) {
            const filteredIndex = parseInt(targetItem.dataset.filteredIndex, 10);
            if (filteredIndex === currentIndex) {
                if (window.openModal) {
                    const originalIndex = parseInt(targetItem.dataset.originalIndex, 10);
                    window.openModal(originalIndex);
                }
            } else {
                currentIndex = filteredIndex;
                updateCarousel();
            }
        }
    });

    // Initial setup
    if (typeof portfolioData !== 'undefined' && portfolioData.length > 0) {
        setupCategoryFilters();
        populateCarousel();
    } else {
        categoryFiltersContainer.innerHTML = '<p>No data to generate filters.</p>';
        carouselWrapper.innerHTML = '<p>No portfolio items to display.</p>';
    }
    
    function setupIntersectionObserver() {
        const items = document.querySelectorAll('.carousel-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.filteredIndex, 10);
                    if (!isNaN(index)) {
                        currentIndex = index;
                        items.forEach((item, i) => {
                            item.classList.toggle('active', i === currentIndex);
                        });
                    }
                }
            });
        }, {
            root: document.querySelector('.carousel-container'),
            threshold: 0.5
        });

        items.forEach(item => {
            observer.observe(item);
        });
    }

    window.addEventListener('resize', () => {
        // On resize, recalculate height and then update the carousel position
        calculateAndSetHeight();
        requestAnimationFrame(() => updateCarousel(false));
    });
});
