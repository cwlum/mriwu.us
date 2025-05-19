document.addEventListener('DOMContentLoaded', () => {
    const masterPassword = 'cervanteswu';
    const puzzlePasswords = ["74391783517230175311"]; // All features combined
    
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
    pageContent.style.display = 'none';
    passwordContainer.style.display = 'flex'; // Or 'block', depending on desired layout

    const checkPassword = () => {
        const enteredPassword = passwordInput.value;
        if (enteredPassword === masterPassword || puzzlePasswords.includes(enteredPassword)) {
            passwordContainer.style.display = 'none';
            pageContent.style.display = 'block';
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
