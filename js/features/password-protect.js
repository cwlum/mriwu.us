document.addEventListener('DOMContentLoaded', () => {
    const masterPasswordHash = '8c27748d364214d7dfc86c14f21f13fc62c8fc1ad974ae28ff044e87fd854e2e';
    const puzzlePasswordHashes = ["729343a10539dd4c12b0b3e5903dbbb41ca5d463c735b60acf14157f525b84f9"]; 
    
    async function hashPassword(password) {
        if (!password) return null;
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.error('Error hashing password:', error);
            return null;
        }
    }

    const pageContent = document.getElementById('page-content');
    const passwordContainer = document.getElementById('password-container');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordMessage = document.getElementById('password-message');

    if (!pageContent || !passwordContainer || !passwordInput || !passwordSubmit) {
        // If essential elements are missing, it might not be a protected page or HTML is incorrect.
        // Hide password container if it exists, and show content if it was accidentally hidden by CSS.
        if (passwordContainer) passwordContainer.style.display = 'none';
        if (pageContent && pageContent.style.display === 'none') pageContent.style.display = 'block';
        return;
    }

    // Check if already unlocked (e.g., via session storage)
    const unlockedPages = JSON.parse(sessionStorage.getItem('unlockedPages') || '{}');
    const currentPage = window.location.pathname;

    if (unlockedPages[currentPage]) {
        passwordContainer.style.display = 'none';
        pageContent.style.display = 'block';
        return;
    }

    // Ensure content is hidden initially if not unlocked
    // pageContent.style.display = 'none'; // Content is now part of the main flow
    // passwordContainer.style.display = 'flex'; // Or 'block', depending on desired layout
    // The password container will be visible by default, and hidden if unlocked.
    // The page content (portfolio grid etc) is inside a div that is hidden by default.

    if (unlockedPages[currentPage]) {
        passwordContainer.style.display = 'none';
        if (pageContent) {
            pageContent.style.display = 'block'; // Show main content
            // Potentially trigger animations or ensure they can run
            // For now, just ensuring it's visible. Animations are handled by page-animations.js
        }
    } else {
        if (passwordContainer) passwordContainer.style.display = 'flex'; // Or 'block'
        if (pageContent) pageContent.style.display = 'none'; // Hide main content
    }

    const checkPassword = async () => { // Made async to use await for hashing
        const enteredPassword = passwordInput.value;
        const enteredPasswordHash = await hashPassword(enteredPassword);

        if (!enteredPasswordHash) {
            if (passwordMessage) {
                passwordMessage.textContent = 'Error processing password. Please try again.';
                passwordMessage.style.color = 'red';
            }
            return;
        }

        if (enteredPasswordHash === masterPasswordHash || puzzlePasswordHashes.includes(enteredPasswordHash)) {
            if (passwordContainer) passwordContainer.style.display = 'none';
            if (pageContent) {
                pageContent.style.display = 'block'; // Make content visible
                // The page-animations.js script should handle the actual animation sequences
                // Ensure any initial styles set by this script don't conflict with animation starting states.
                // For example, page-animations.js might set opacity to 0 and then animate to 1.
            }
            if (passwordMessage) passwordMessage.textContent = '';
            
            // Mark page as unlocked in session storage
            unlockedPages[currentPage] = true;
            sessionStorage.setItem('unlockedPages', JSON.stringify(unlockedPages));
        } else {
            if (passwordMessage) {
                passwordMessage.textContent = 'Incorrect password. Please try again.';
                passwordMessage.style.color = 'red';
            }
            passwordInput.value = '';
            passwordInput.focus();
        }
    };

    passwordSubmit.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if it's part of a form
            checkPassword();
        }
    });
});
