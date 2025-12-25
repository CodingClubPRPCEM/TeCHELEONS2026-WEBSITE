/* =================================================================
   CORE.JS - Critical functionality (Navbar, Mobile Menu, Scroll Spy)
   Loads immediately for essential UX
   ================================================================= */

// Mobile Menu Toggle Logic
export function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    mobileMenuButton.addEventListener('click', () => {
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenuButton.classList.toggle('open');
        mobileMenu.classList.toggle('show');
    });
    
    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenuButton.classList.remove('open');
            mobileMenu.classList.remove('show');
        });
    });
}

// Scroll Spy Logic
export function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// Professional Preloader
export function initPreloader() {
    const loader = document.getElementById('techelons-loader');
    const body = document.body;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        body.classList.remove('loading');
        if (loader) loader.style.display = 'none';
        return;
    }

    const criticalAssets = [];
    
    if (document.fonts) {
        criticalAssets.push(
            document.fonts.load('700 1em Orbitron'),
            document.fonts.load('400 1em Rajdhani')
        );
    }

    const minDisplayTime = 1200;
    const maxWaitTime = 3000;
    const startTime = Date.now();

    function hideLoader() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        setTimeout(() => {
            if (loader) {
                loader.classList.add('loaded');
                loader.setAttribute('aria-busy', 'false');
            }
            body.classList.remove('loading');

            setTimeout(() => {
                if (loader && loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 600);
        }, remainingTime);
    }

    Promise.all(criticalAssets)
        .then(hideLoader)
        .catch(hideLoader);

    setTimeout(hideLoader, maxWaitTime);
}

// Render website data
export function renderWebsite() {
    try {
        const eventDataScript = document.getElementById('event-data-json');
        if (!eventDataScript) {
            console.error('Event data not found');
            return false;
        }

        const eventData = JSON.parse(eventDataScript.textContent);
        
        // Populate event name and details
        const eventNameElements = document.querySelectorAll('#event-name-hero, #nav-event-name');
        eventNameElements.forEach(el => {
            if (el) el.textContent = eventData.event_details?.name || 'TECHELONS\'26';
        });

        const eventTypeEl = document.getElementById('event-type');
        if (eventTypeEl) eventTypeEl.textContent = eventData.event_details?.event_type || 'National Level Event';

        const eventDateEl = document.getElementById('event-date-hero');
        if (eventDateEl) eventDateEl.textContent = eventData.event_details?.date || '19-20 JAN 2026';

        const eventTaglineEl = document.getElementById('event-tagline-hero');
        if (eventTaglineEl) eventTaglineEl.textContent = eventData.event_details?.tagline || 'Step to Pioneer';

        return true;
    } catch (error) {
        console.error('Failed to render website:', error);
        return false;
    }
}
