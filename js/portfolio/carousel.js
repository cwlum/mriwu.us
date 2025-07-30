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

    function populateCarousel() {
        filteredData = currentFilter === 'All' 
            ? [...portfolioData] 
            : portfolioData.filter(item => item.category === currentFilter);

        carouselWrapper.innerHTML = ''; // Clear existing items

        if (filteredData.length === 0) {
            carouselWrapper.innerHTML = '<p>No items in this category.</p>';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            return;
        }
        
        prevButton.style.display = 'flex';
        nextButton.style.display = 'flex';

        filteredData.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('carousel-item');
            itemElement.setAttribute('role', 'group');
            itemElement.setAttribute('aria-label', `${index + 1} of ${filteredData.length}`);
            // Use original index for modal functionality
            itemElement.dataset.originalIndex = portfolioData.indexOf(item);
            itemElement.dataset.filteredIndex = index;

            const image = document.createElement('img');
            image.src = item.src;
            image.alt = item.title;
            image.loading = index === 0 ? 'eager' : 'lazy'; // First image loads eagerly

            const caption = document.createElement('div');
            caption.classList.add('caption');
            caption.textContent = item.title;

            itemElement.appendChild(image);
            itemElement.appendChild(caption);
            carouselWrapper.appendChild(itemElement);
        });

        currentIndex = 0; // Reset to the first item of the new set
        updateCarousel();
        setupIntersectionObserver();
    }

    function updateCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        if (currentIndex >= items.length) currentIndex = items.length - 1;
        if (currentIndex < 0) currentIndex = 0;

        const activeItem = items[currentIndex];

        activeItem.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
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
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    function showPrev() {
        const items = document.querySelectorAll('.carousel-item');
        if (items.length === 0) return;
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
        requestAnimationFrame(updateCarousel);
    });
});
