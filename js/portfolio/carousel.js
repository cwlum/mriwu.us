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
    let portfolioData = [];

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
            carouselWrapper.style.height = '100px';
            return;
        }
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

        carouselWrapper.innerHTML = '';

        if (filteredData.length === 0) {
            carouselWrapper.innerHTML = '<p>No items in this category.</p>';
            updateNavButtons();
            calculateAndSetHeight();
            return;
        }
        
        const imageLoadPromises = [];

        filteredData.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('carousel-item');
            itemElement.dataset.originalIndex = portfolioData.indexOf(item);
            itemElement.dataset.filteredIndex = index;

            const image = document.createElement('img');
            image.src = item.src;
            image.alt = item.title;
            image.loading = index === 0 ? 'eager' : 'lazy';

            const imageLoadPromise = new Promise((resolve) => {
                image.onload = resolve;
                image.onerror = resolve;
            });
            imageLoadPromises.push(imageLoadPromise);

            const caption = document.createElement('div');
            caption.classList.add('caption');
            caption.textContent = item.title;

            itemElement.appendChild(image);
            itemElement.appendChild(caption);
            carouselWrapper.appendChild(itemElement);
        });

        Promise.all(imageLoadPromises).then(() => {
            calculateAndSetHeight();
            currentIndex = 0;
            updateCarousel(false);
            updateNavButtons();
        });
    }

    function updateCarousel(smooth = true) {
        const items = carouselWrapper.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

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
    
    function updateNavButtons() {
        if (filteredData.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === filteredData.length - 1;
        }
    }

    window.updateCarouselFromModal = function(newOriginalIndex) {
        const newFilteredIndex = filteredData.findIndex(item => portfolioData.indexOf(item) === newOriginalIndex);
        if (newFilteredIndex !== -1) {
            currentIndex = newFilteredIndex;
            updateCarousel();
            updateNavButtons();
        }
    };

    function showNext() {
        if (currentIndex < filteredData.length - 1) {
            currentIndex++;
            updateCarousel();
            updateNavButtons();
        }
    }

    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
            updateNavButtons();
        }
    }

    nextButton.addEventListener('click', showNext);
    prevButton.addEventListener('click', showPrev);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showPrev();
        else if (e.key === 'ArrowRight') showNext();
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
                updateNavButtons();
            }
        }
    });

    async function initializeCarousel() {
        try {
            const response = await fetch('/api/portfolio');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            portfolioData = await response.json();
            window.portfolioData = portfolioData;
            
            if (portfolioData && portfolioData.length > 0) {
                setupCategoryFilters();
                populateCarousel();
            } else {
                categoryFiltersContainer.innerHTML = '<p>No data to generate filters.</p>';
                carouselWrapper.innerHTML = '<p>No portfolio items to display.</p>';
            }
        } catch (error) {
            console.error("Failed to load portfolio data:", error);
            carouselWrapper.innerHTML = '<p>Error loading portfolio items.</p>';
        }
    }

    initializeCarousel();
    
    window.addEventListener('resize', () => {
        calculateAndSetHeight();
        requestAnimationFrame(() => updateCarousel(false));
    });
});
