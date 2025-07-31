import { initializeRippleEffects } from '../modules/ripple-effect.js';
import { initializeNavToggle } from '../modules/nav-toggle.js';
import { initializeSidebarToggle } from '../modules/sidebar-toggle.js';
import { initializePageAnimations } from '../modules/page-animations.js';
import { initializeBackgroundAnimations } from '../modules/background-animations.js';
import { OrientationChecker } from '../orientation-check.js';

document.addEventListener('DOMContentLoaded', async () => {
    initializeRippleEffects();
    initializeNavToggle();
    initializeSidebarToggle();
    initializePageAnimations();
    initializeBackgroundAnimations();
    OrientationChecker.init();
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
