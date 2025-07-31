// js/features/background-animations.js
function initializeBackgroundAnimations() {
    const animationContainer = document.getElementById('background-animation');
    if (!animationContainer) return;
    const numberOfShapes = 20;
    const shapeTypes = ['circle', 'square', 'triangle'];
    for (let i = 0; i < numberOfShapes; i++) {
        const shape = document.createElement('div');
        const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        shape.classList.add('shape', type);
        const size = Math.random() * 80 + 20;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        if (type === 'triangle') {
            const borderSize = size / 2;
            shape.style.width = '0';
            shape.style.height = '0';
            shape.style.borderLeftWidth = `${borderSize}px`;
            shape.style.borderRightWidth = `${borderSize}px`;
            shape.style.borderBottomWidth = `${size}px`;
        }
        shape.style.left = `${Math.random() * 100}vw`;
        const animationDuration = Math.random() * 15 + 10;
        const animationDelay = Math.random() * 10;
        shape.style.animationDuration = `${animationDuration}s`;
        shape.style.animationDelay = `-${animationDelay}s`;
        animationContainer.appendChild(shape);
    }
}

export { initializeBackgroundAnimations };