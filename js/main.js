/* =================================================================
   MAIN.JS - Application initialization with lazy loading
   ================================================================= */

import { initPreloader, setupMobileMenu, setupScrollSpy, renderWebsite } from './core.js';
import { fetchEvents, setupEventFilters, initGalleryHoverEvents, startGuestsAutoScroll, setupDragScroll } from './sections.js';
import { initThreeHero, initTimelineParallax, initAllParticleSystems } from './effects.js';

// Initialize preloader immediately
initPreloader();

// Intersection Observer for lazy loading sections
const lazyLoadSections = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            
            // Load section-specific functionality
            switch(sectionId) {
                case 'events':
                    fetchEvents();
                    setupEventFilters();
                    break;
                    
                case 'history':
                    setTimeout(() => {
                        initGalleryHoverEvents();
                        startGuestsAutoScroll();
                    }, 500);
                    break;
            }
            
            // Unobserve after loading
            lazyLoadSections.unobserve(entry.target);
        }
    });
}, {
    rootMargin: '100px' // Start loading 100px before section is visible
});

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
    // Critical functionality - loads immediately
    setupMobileMenu();
    
    if (renderWebsite()) {
        setupScrollSpy();
        setupDragScroll();
    }
    
    // Lazy load sections
    const eventsSection = document.getElementById('events');
    const historySection = document.getElementById('history');
    
    if (eventsSection) lazyLoadSections.observe(eventsSection);
    if (historySection) lazyLoadSections.observe(historySection);
    
    // Load visual effects after a delay (non-critical)
    setTimeout(() => {
        // Check if Three.js is loaded
        if (typeof THREE !== 'undefined') {
            initThreeHero();
        } else {
            // Wait for Three.js to load
            const checkThree = setInterval(() => {
                if (typeof THREE !== 'undefined') {
                    initThreeHero();
                    clearInterval(checkThree);
                }
            }, 100);
        }
        
        // Initialize particle systems
        initAllParticleSystems();
        
        // Initialize timeline parallax
        initTimelineParallax();
    }, 1000);
});

// Make scroll functions globally accessible for inline event handlers
window.scrollGuestsGallery = async (direction) => {
    const { scrollGuestsGallery } = await import('./sections.js');
    scrollGuestsGallery(direction);
};
