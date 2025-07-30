document.addEventListener('DOMContentLoaded', () => {
    // Create the modal HTML structure
    const modalHTML = `
        <div id="orientationModal" class="orientation-modal">
            <div class="orientation-modal-content">
                <p>For the best experience, please rotate your device to portrait mode.</p>
                <button id="closeOrientationModal" class="button">Continue in Landscape</button>
            </div>
        </div>
    `;

    // Append the modal to the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Get references to the modal and close button
    const orientationModal = document.getElementById('orientationModal');
    const closeButton = document.getElementById('closeOrientationModal');

    // Add event listener to the close button
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (orientationModal) {
                orientationModal.style.display = 'none';
            }
        });
    }
});
