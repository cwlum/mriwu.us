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
            // Use original index for modal functionality
            itemElement.dataset.originalIndex = portfolioData.indexOf(item);
            itemElement.dataset.filteredIndex = index;

            const image = document.createElement('img');
            image.src = item.src;
            image.alt = item.title;
            image.loading = 'lazy';

            const caption = document.createElement('div');
            caption.classList.add('caption');
            caption.textContent = item.title;

            itemElement.appendChild(image);
            itemElement.appendChild(caption);
            carouselWrapper.appendChild(itemElement);
        });

        currentIndex = 0; // Reset to the first item of the new set
        updateCarousel();
    }

    function updateCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        const carouselContainer = document.querySelector('.carousel-container');
        if (items.length === 0) {
            anime({
                targets: carouselContainer,
                height: '100px',
                duration: 600,
                easing: 'easeInOutQuad'
            });
            return;
        }

        if (currentIndex >= items.length) currentIndex = items.length - 1;
        if (currentIndex < 0) currentIndex = 0;

        const activeItem = items[currentIndex];
        const activeImg = activeItem.querySelector('img');

        const performAnimation = () => {
            const captionHeight = activeItem.querySelector('.caption')?.offsetHeight || 0;
            const imageHeight = activeImg.offsetHeight;
            const targetHeight = imageHeight > 0 ? `${imageHeight + captionHeight + 20}px` : '300px';

            const containerWidth = carouselContainer.offsetWidth;
            const offset = (containerWidth / 2) - (activeItem.offsetWidth / 2) - activeItem.offsetLeft;

            // Use anime.js for a synchronized, smooth animation
            anime.timeline({
                duration: 800,
                easing: 'easeInOutQuint' // A very smooth easing function
            }).add({
                targets: carouselContainer,
                height: targetHeight,
            }).add({
                targets: carouselWrapper,
                translateX: offset,
            }, '-=800'); // Start at the same time as the height animation

            // Update active classes for all items
            items.forEach((item, index) => {
                item.classList.toggle('active', index === currentIndex);
            });
        };

        if (activeImg.complete && activeImg.naturalHeight > 0) {
            performAnimation();
        } else {
            activeImg.onload = performAnimation;
            activeImg.onerror = () => {
                console.error(`Image failed to load: ${activeImg.src}`);
                performAnimation(); // Try to animate even if image fails
            };
        }
    }

    window.updateCarouselFromModal = function(newOriginalIndex) {
        const newFilteredIndex = filteredData.findIndex(item => portfolioData.indexOf(item) === newOriginalIndex);
        if (newFilteredIndex !== -1) {
            currentIndex = newFilteredIndex;
            updateCarousel();
        }
    };

    function showNext() {
        const itemsCount = filteredData.length;
        if (itemsCount > 0) {
            currentIndex = (currentIndex + 1) % itemsCount;
            updateCarousel();
        }
    }

    function showPrev() {
        const itemsCount = filteredData.length;
        if (itemsCount > 0) {
            currentIndex = (currentIndex - 1 + itemsCount) % itemsCount;
            updateCarousel();
        }
    }

    nextButton.addEventListener('click', showNext);
    prevButton.addEventListener('click', showPrev);

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
    
    window.addEventListener('resize', () => {
        // Debounce resize events for better performance
        requestAnimationFrame(updateCarousel);
    });
});
