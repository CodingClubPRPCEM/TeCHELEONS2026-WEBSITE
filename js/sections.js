/* =================================================================
   SECTIONS.JS - Section-specific functionality (Events, Gallery, etc.)
   Lazy loaded when sections are in viewport
   ================================================================= */

// Events Management
let eventData = null;
let allEvents = [];
let activeStream = "engineering";
const eventsContainer = document.getElementById("events-container");
const filterButtons = document.querySelectorAll(".filter-button");

// Fetch events from API
export async function fetchEvents() {
    try {
        const response = await fetch("https://techelons-api.coding-club.workers.dev/events", {
            cache: "no-store"
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        allEvents = Array.isArray(data)
            ? data.map(e => ({
                ...e,
                stream: e.stream?.toLowerCase()
            }))
            : [];
        
        console.log('Events loaded successfully:', allEvents.length);
        applyFilter();
        
    } catch (error) {
        console.error('Failed to fetch events:', error);
        showEventError('Unable to load events. Please refresh the page.');
    }
}

// Apply filter to events
function applyFilter() {
    const filteredEvents = allEvents.filter(event => 
        event.stream === activeStream
    );
    renderEvents(filteredEvents);
}

// Render events
function renderEvents(events) {
    eventsContainer.innerHTML = "";
    
    if (events.length === 0) {
        eventsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-400 text-lg">No events found for this category.</p>
            </div>
        `;
        return;
    }
    
    events.forEach(event => {
        const card = createEventCard(event);
        eventsContainer.appendChild(card);
    });
    
    setTimeout(() => {
        document.querySelectorAll('#events-container > div').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }, 10);
}

// Create event card
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'neon-card rounded-xl group transition-all duration-400 cursor-pointer overflow-hidden';
    
    card.innerHTML = `
        ${event.poster_url ? `
        <div class="relative w-full overflow-hidden" style="max-height: 380px;">
            <img src="${event.poster_url}" 
                 alt="${event.event_name}" 
                 class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                 style="width: 100%; height: auto; display: block;"
                 loading="lazy">
            
            <div class="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
                <div class="category-badge inline-block text-xs px-3 py-1 rounded-full mb-2">${event.stream || 'General'}</div>
                <h3 class="text-xl font-bold text-white mb-2 leading-tight">${event.event_name}</h3>
            </div>
        </div>
        ` : `
        <div class="p-6">
            <div class="category-badge inline-block text-xs px-3 py-1 rounded-full mb-3">${event.stream || 'General'}</div>
            <h3 class="text-2xl font-bold text-white mb-3">${event.event_name}</h3>
            <p class="text-gray-400 text-sm mb-4 line-clamp-3">${event.description || 'Exciting competition awaits!'}</p>
        </div>
        `}
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `event-detail.html?id=${event.id}`;
    });
    
    return card;
}

// Show error message
function showEventError(message) {
    eventsContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
            <i class="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <p class="text-gray-400 text-lg">${message}</p>
        </div>
    `;
}

// Setup filter buttons
export function setupEventFilters() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            activeStream = btn.dataset.stream;
            
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            applyFilter();
        });
    });
}

// Guest Gallery Management
let currentGuestIndex = 0;
let guestsAutoScrollInterval;
let isGuestsAutoScrollPaused = false;
const GUESTS_SCROLL_INTERVAL = 3000;

function getVisibleCards() {
    const width = window.innerWidth;
    if (width < 480) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return 4;
}

export function scrollGuestsGallery(direction) {
    const track = document.getElementById('guestsGalleryTrack');
    if (!track) return;
    
    const totalCards = track.children.length;
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, totalCards - visibleCards);
    
    if (direction === 'left') {
        currentGuestIndex = Math.max(0, currentGuestIndex - 1);
    } else {
        currentGuestIndex = Math.min(maxIndex, currentGuestIndex + 1);
    }
    
    updateGalleryPosition();
}

function updateGalleryPosition() {
    const track = document.getElementById('guestsGalleryTrack');
    if (!track || track.children.length === 0) return;
    
    const firstCard = track.children[0];
    const cardWidth = firstCard.offsetWidth;
    const gap = 24;
    const offset = -(currentGuestIndex * (cardWidth + gap));
    
    track.style.transform = `translateX(${offset}px)`;
}

export function startGuestsAutoScroll() {
    const track = document.getElementById('guestsGalleryTrack');
    if (!track) return;
    
    stopGuestsAutoScroll();
    
    guestsAutoScrollInterval = setInterval(() => {
        if (isGuestsAutoScrollPaused) return;
        
        const totalCards = track.children.length;
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, totalCards - visibleCards);
        
        currentGuestIndex++;
        
        if (currentGuestIndex > maxIndex) {
            currentGuestIndex = 0;
        }
        
        updateGalleryPosition();
    }, GUESTS_SCROLL_INTERVAL);
}

function pauseGuestsAutoScroll() {
    isGuestsAutoScrollPaused = true;
}

function resumeGuestsAutoScroll() {
    isGuestsAutoScrollPaused = false;
}

function stopGuestsAutoScroll() {
    if (guestsAutoScrollInterval) {
        clearInterval(guestsAutoScrollInterval);
        guestsAutoScrollInterval = null;
    }
}

export function initGalleryHoverEvents() {
    const container = document.querySelector('.guests-gallery-container');
    if (!container) return;
    
    container.addEventListener('mouseenter', pauseGuestsAutoScroll);
    container.addEventListener('mouseleave', resumeGuestsAutoScroll);
    
    const leftBtn = container.querySelector('.gallery-nav-btn.left');
    const rightBtn = container.querySelector('.gallery-nav-btn.right');
    
    if (leftBtn) leftBtn.addEventListener('click', () => scrollGuestsGallery('left'));
    if (rightBtn) rightBtn.addEventListener('click', () => scrollGuestsGallery('right'));
}

// Drag Scroll (Legacy compatibility)
export function setupDragScroll() {
    // Placeholder for legacy compatibility
}

// Window resize handler
window.addEventListener('resize', () => {
    updateGalleryPosition();
});
