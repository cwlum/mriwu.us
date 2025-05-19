document.addEventListener('DOMContentLoaded', () => {
    if (typeof anime === 'undefined') {
        console.warn('anime.js not loaded, page animations will not run.');
        return;
    }

    // Ensure elements exist before trying to animate them
    const siteHeader = document.querySelector('.site-header');
    const profileImageContainer = document.querySelector('.profile-image-container');
    const siteHeading = document.querySelector('.site-heading');
    const siteSubheading = document.querySelector('.site-subheading');
    const socialLinks = document.querySelector('.social-links');
    const vgenButtonContainer = document.querySelector('.vgen-button-container'); // Specific VGen button
    const actionButtons = document.querySelector('.action-buttons');
    const siteFooter = document.querySelector('.site-footer-bottom');
    const currentPage = window.location.pathname.split('/').pop();

    // Initial states (set via JS to avoid FOUC if CSS isn't perfectly synced)
    // Or, preferably, set these initial states in CSS (e.g., opacity: 0, transform: translateY(-20px))
    // For simplicity here, we'll just run animations. If FOUC is an issue, CSS initial states are better.

    const mainTimeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    });

    // Common animations for header and footer on all pages
    if (siteHeader) {
        siteHeader.style.visibility = 'visible';
        mainTimeline.add({
            targets: siteHeader,
            translateY: [-50, 0],
            opacity: [0, 1],
            duration: 800
        });
    }

    // Homepage specific animations
    if (currentPage === 'index.html' || currentPage === '') {
        if (profileImageContainer) {
            profileImageContainer.style.visibility = 'visible';
            mainTimeline.add({
                targets: profileImageContainer,
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 800
            }, '-=600');
        }

        if (siteHeading) {
            siteHeading.style.visibility = 'visible';
            mainTimeline.add({
                targets: siteHeading,
                translateX: [-50, 0],
                opacity: [0, 1],
                duration: 700
            }, '-=600');
        }

        if (siteSubheading) {
            siteSubheading.style.visibility = 'visible';
            mainTimeline.add({
                targets: siteSubheading,
                translateX: [50, 0],
                opacity: [0, 1],
                duration: 700
            }, '-=600');
        }

        if (socialLinks) {
            document.querySelectorAll('.social-links li').forEach(li => li.style.visibility = 'visible');
            mainTimeline.add({
                targets: '.social-links li',
                translateY: [30, 0],
                opacity: [0, 1],
                delay: anime.stagger(100),
                duration: 500
            }, '-=500');
        }
        
        const bottomButtons = [];
        if (vgenButtonContainer) {
            vgenButtonContainer.style.visibility = 'visible';
            bottomButtons.push(vgenButtonContainer);
        }
        if (actionButtons) {
            actionButtons.style.visibility = 'visible';
            bottomButtons.push(actionButtons);
        }

        if (bottomButtons.length > 0) {
            mainTimeline.add({
                targets: bottomButtons,
                translateY: [50, 0],
                opacity: [0, 1],
                delay: anime.stagger(150, {start: 300}),
                duration: 700
            }, '-=400');
        }
    }

    // Page-specific content animations
    // These will be added to the mainTimeline, potentially after a slight delay or overlapping
    // to ensure header animation feels like it starts first.
    const contentAnimationOffset = '-=600'; // Start content animations slightly after header

    if (currentPage === 'contact.html') {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.style.visibility = 'hidden'; // Hide initially
            // Animate site heading and subheading first if they exist on this page
            const pageHeading = document.querySelector('.site-main .site-heading');
            const pageSubheading = document.querySelector('.site-main .site-subheading');

            if(pageHeading) {
                pageHeading.style.visibility = 'visible';
                mainTimeline.add({
                    targets: pageHeading,
                    translateX: [-30, 0],
                    opacity: [0, 1],
                    duration: 600
                }, contentAnimationOffset);
            }
            if(pageSubheading) {
                pageSubheading.style.visibility = 'visible';
                mainTimeline.add({
                    targets: pageSubheading,
                    translateX: [30, 0],
                    opacity: [0, 1],
                    duration: 600
                }, '-=400'); // Overlap with heading
            }
            
            mainTimeline.add({
                targets: contactForm,
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 800,
                begin: () => { contactForm.style.visibility = 'visible'; }
            }, pageHeading || pageSubheading ? '-=300' : contentAnimationOffset); // Adjust offset based on heading/subheading presence
        }
    } else if (currentPage === 'academic.html') {
        const academicContent = document.getElementById('academic-content');
        // Also animate heading and subheading for academic page
        const pageHeading = document.querySelector('#page-content .site-main .site-heading'); // More specific selector
        const pageSubheading = document.querySelector('#page-content .site-main .site-subheading');

        if(pageHeading) {
            pageHeading.style.visibility = 'visible';
            mainTimeline.add({
                targets: pageHeading,
                translateX: [-30, 0],
                opacity: [0, 1],
                duration: 600
            }, contentAnimationOffset);
        }
        if(pageSubheading) {
            pageSubheading.style.visibility = 'visible';
            mainTimeline.add({
                targets: pageSubheading,
                translateX: [30, 0],
                opacity: [0, 1],
                duration: 600
            }, '-=400');
        }

        if (academicContent) {
            const academicSections = academicContent.querySelectorAll('details.academic-section');
            academicSections.forEach(section => section.style.visibility = 'hidden');
            mainTimeline.add({
                targets: academicSections,
                translateY: [30, 0],
                opacity: [0, 1],
                delay: anime.stagger(150),
                duration: 600,
                begin: () => { academicSections.forEach(section => section.style.visibility = 'visible'); }
            }, pageHeading || pageSubheading ? '-=300' : contentAnimationOffset);
        }
    } else if (currentPage === 'privacy.html') {
        const privacySections = document.querySelectorAll('main.site-main details.content-section');
         // Also animate heading and subheading for privacy page
        const pageHeading = document.querySelector('.site-main .site-heading');
        const pageSubheading = document.querySelector('.site-main .site-subheading');

        if(pageHeading) {
            pageHeading.style.visibility = 'visible';
            mainTimeline.add({
                targets: pageHeading,
                translateX: [-30, 0],
                opacity: [0, 1],
                duration: 600
            }, contentAnimationOffset);
        }
        if(pageSubheading) {
            pageSubheading.style.visibility = 'visible';
            mainTimeline.add({
                targets: pageSubheading,
                translateX: [30, 0],
                opacity: [0, 1],
                duration: 600
            }, '-=400');
        }

        if (privacySections.length > 0) {
            privacySections.forEach(section => section.style.visibility = 'hidden');
            mainTimeline.add({
                targets: privacySections,
                translateX: [-20, 0], // Slide in from left
                opacity: [0, 1],
                delay: anime.stagger(100, {start: 200}), // Stagger with a slight start delay
                duration: 500,
                begin: () => { privacySections.forEach(section => section.style.visibility = 'visible'); }
            }, pageHeading || pageSubheading ? '-=300' : contentAnimationOffset);
        }
    } else if (currentPage === 'portfolio.html') {
        const portfolioControls = document.querySelector('#page-content .portfolio-controls');
        const masonryGrid = document.querySelector('#page-content .masonry-grid');
        // Also animate heading and subheading for portfolio page
        const pageHeading = document.querySelector('#page-content .site-main .site-heading');
        const pageSubheading = document.querySelector('#page-content .site-main .site-subheading');

        if(pageHeading) {
            pageHeading.style.visibility = 'visible';
            mainTimeline.add({
                targets: pageHeading,
                translateX: [-30, 0],
                opacity: [0, 1],
                duration: 600
            }, contentAnimationOffset);
        }
        if(pageSubheading) {
            pageSubheading.style.visibility = 'visible';
            mainTimeline.add({
                targets: pageSubheading,
                translateX: [30, 0],
                opacity: [0, 1],
                duration: 600
            }, '-=400');
        }

        if (portfolioControls) {
            portfolioControls.style.visibility = 'hidden';
            mainTimeline.add({
                targets: portfolioControls,
                translateY: [-30, 0], // Slide down from top
                opacity: [0, 1],
                duration: 700,
                begin: () => { portfolioControls.style.visibility = 'visible'; }
            }, pageHeading || pageSubheading ? '-=300' : contentAnimationOffset);
        }
        if (masonryGrid) {
            // The grid items are loaded dynamically. We should animate the container,
            // and individual items can have their own animation when added by portfolio/page.js
            // or we can try to animate them if they are present at DOMContentLoaded.
            // For now, let's animate the container.
            masonryGrid.style.visibility = 'hidden';
            mainTimeline.add({
                targets: masonryGrid,
                opacity: [0, 1],
                duration: 900,
                begin: () => { masonryGrid.style.visibility = 'visible'; }
            }, portfolioControls ? '-=400' : (pageHeading || pageSubheading ? '-=300' : contentAnimationOffset)); // Adjust offset
        }
    }


    // Common animation for footer on all pages, should run after page-specific content
    if (siteFooter) {
        siteFooter.style.visibility = 'visible';
        mainTimeline.add({
            targets: siteFooter,
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 800
        }, '+=200'); // Add a slight delay after other animations might have finished
    }

    // Enhanced button animations for .action-buttons (if they exist on the current page)
    const actionButtonsLinks = document.querySelectorAll('.action-buttons a.button');
    if (actionButtonsLinks.length > 0 && typeof anime !== 'undefined') {
        actionButtonsLinks.forEach(button => {
            // Hover animation
            button.addEventListener('mouseenter', () => {
                anime.remove(button); // Remove any ongoing animations on this element
                anime({
                    targets: button,
                    scale: 1.05,
                    boxShadow: '0px 8px 15px rgba(0,0,0,0.2)',
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });

            button.addEventListener('mouseleave', () => {
                anime.remove(button);
                anime({
                    targets: button,
                    scale: 1.0,
                    boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', // Assuming a default box-shadow, adjust if needed
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });

            // Click animation
            button.addEventListener('mousedown', () => {
                anime.remove(button);
                anime({
                    targets: button,
                    scale: 0.95,
                    duration: 100,
                    easing: 'easeOutQuad'
                });
            });

            button.addEventListener('mouseup', () => {
                anime.remove(button);
                anime({ // Animate back to hover state or base state
                    targets: button,
                    scale: 1.05, // Or 1.0 if not returning to hover state
                    duration: 100,
                    easing: 'easeOutQuad'
                });
            });
        });
    }
});
