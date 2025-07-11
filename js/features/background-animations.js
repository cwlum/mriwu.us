document.addEventListener('DOMContentLoaded', () => {
    const animationContainer = document.getElementById('background-animation');
    if (!animationContainer) return;

    const numberOfShapes = 20; // Adjust number of shapes
    const shapeTypes = ['circle', 'square', 'triangle'];

    for (let i = 0; i < numberOfShapes; i++) {
        const shape = document.createElement('div');
        const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        shape.classList.add('shape', type);

        const size = Math.random() * 80 + 20; // Size between 20px and 100px
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;

        // For triangles, the size is controlled by borders, so we adjust that
        if (type === 'triangle') {
            const borderSize = size / 2;
            shape.style.width = '0';
            shape.style.height = '0';
            shape.style.borderLeftWidth = `${borderSize}px`;
            shape.style.borderRightWidth = `${borderSize}px`;
            shape.style.borderBottomWidth = `${size}px`;
        }

        shape.style.left = `${Math.random() * 100}vw`; // Random horizontal position

        const animationDuration = Math.random() * 15 + 10; // Duration between 10s and 25s
        const animationDelay = Math.random() * 10; // Delay up to 10s

        shape.style.animationDuration = `${animationDuration}s`;
        shape.style.animationDelay = `-${animationDelay}s`; // Negative delay starts animation partway through

        animationContainer.appendChild(shape);
    }
});
