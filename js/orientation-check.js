/**
 * An object to encapsulate the orientation check functionality.
 */
const OrientationChecker = {
    // Constants for configuration
    COOKIE_NAME: 'orientationModalDismissed',
    MODAL_ID: 'orientationModal',
    CLOSE_BUTTON_ID: 'closeOrientationModal',
    COOKIE_EXPIRATION_DAYS: 1,

    // DOM element references
    modal: null,
    closeButton: null,

    /**
     * Initializes the orientation checker.
     */
    init() {
        this.createModal();
        this.modal = document.getElementById(this.MODAL_ID);
        this.closeButton = document.getElementById(this.CLOSE_BUTTON_ID);

        if (!this.modal || !this.closeButton) {
            console.error('Orientation modal elements not found.');
            return;
        }

        this.bindEvents();
        this.checkOrientation();
    },

    /**
     * Creates and injects the modal HTML into the DOM if it doesn't exist.
     */
    createModal() {
        if (document.getElementById(this.MODAL_ID)) {
            return;
        }
        const modalHTML = `
            <div id="${this.MODAL_ID}" class="orientation-modal" style="display: none;">
                <div class="orientation-modal-content">
                    <p>For the best experience, please rotate your device to portrait mode.</p>
                    <button id="${this.CLOSE_BUTTON_ID}" class="button">Continue in Landscape</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    /**
     * Binds all necessary event listeners.
     */
    bindEvents() {
        // Use .bind(this) to maintain the correct 'this' context
        this.closeButton.addEventListener('click', this.handleCloseClick.bind(this));
        window.addEventListener('resize', this.checkOrientation.bind(this));
    },

    /**
     * Handles the click event on the close button.
     */
    handleCloseClick() {
        this.hideModal();
        this.setCookie(this.COOKIE_NAME, 'true', this.COOKIE_EXPIRATION_DAYS);
    },

    /**
     * Checks the device orientation and shows or hides the modal accordingly.
     */
    checkOrientation() {
        if (this.getCookie(this.COOKIE_NAME)) {
            this.hideModal();
            return;
        }

        if (window.innerHeight < window.innerWidth) {
            this.showModal();
        } else {
            this.hideModal();
        }
    },

    /**
     * Shows the orientation modal.
     */
    showModal() {
        if (this.modal) {
            this.modal.style.display = 'flex';
        }
    },

    /**
     * Hides the orientation modal.
     */
    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    },

    /**
     * Sets a cookie with a specified name, value, and expiration in days.
     * @param {string} name The name of the cookie.
     * @param {string} value The value of the cookie.
     * @param {number} days The number of days until the cookie expires.
     */
    setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = `${name}=${value || ''}${expires}; path=/`;
    },

    /**
     * Retrieves a cookie by its name.
     * @param {string} name The name of the cookie to retrieve.
     * @returns {string|null} The cookie value or null if not found.
     */
    getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }
};

export { OrientationChecker };