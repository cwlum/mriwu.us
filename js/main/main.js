import { initializeRippleEffects } from '../modules/ripple-effect.js';
import { initializeNavToggle } from '../modules/nav-toggle.js';
import { initializeSidebarToggle } from '../modules/sidebar-toggle.js';
import { initializePageAnimations } from '../modules/page-animations.js';
import { initializeBackgroundAnimations } from '../modules/background-animations.js';
import { OrientationChecker } from '../orientation-check.js';
import { loadTemplates } from './template-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadTemplates();
    initializeRippleEffects();
    initializeNavToggle();
    initializeSidebarToggle();
    initializePageAnimations();
    initializeBackgroundAnimations();
    OrientationChecker.init();
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
});