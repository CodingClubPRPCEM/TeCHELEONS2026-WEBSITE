// ============================================================================
// TECHELONS'26 - Event Detail Page
// ============================================================================

const API_BASE_URL = 'https://techelons-api.coding-club.workers.dev';

// Get event ID from URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

// DOM Elements
const eventTitle = document.getElementById('event-title');
const eventMeta = document.getElementById('event-meta');
const eventPoster = document.getElementById('event-poster');
const eventDescription = document.getElementById('event-description');
const registerBtn = document.getElementById('register-btn');

const agendaSection = document.getElementById('agenda-section');
const agendaList = document.getElementById('agenda-list');

const rulesSection = document.getElementById('rules-section');
const rulesList = document.getElementById('rules-list');

const eligibilitySection = document.getElementById('eligibility-section');
const eligibilityList = document.getElementById('eligibility-list');

const feesSection = document.getElementById('fees-section');
const feesText = document.getElementById('fees-text');

const coordinatorsSection = document.getElementById('coordinators-section');
const coordinatorsList = document.getElementById('coordinators-list');

const gallerySection = document.getElementById('gallery-section');
const galleryGrid = document.getElementById('gallery-grid');

// ============================================================================
// Main Initialization
// ============================================================================

if (!eventId) {
    showEventNotFound();
} else {
    loadEventDetails();
}

// ============================================================================
// Fetch & Render Event Details
// ============================================================================

async function loadEventDetails() {
    try {
        // Fetch all data in parallel
        const [
            eventData,
            agendaData,
            rulesData,
            eligibilityData,
            feesData,
            coordinatorsData,
            mediaData
        ] = await Promise.all([
            fetchAPI(`/events/${eventId}`),
            fetchAPI(`/events/${eventId}/agenda`),
            fetchAPI(`/events/${eventId}/rules`),
            fetchAPI(`/events/${eventId}/eligibility`),
            fetchAPI(`/events/${eventId}/fees`),
            fetchAPI(`/events/${eventId}/coordinators`),
            fetchAPI(`/events/${eventId}/media`)
        ]);

        // Check if event exists
        if (!eventData || eventData.error) {
            showEventNotFound();
            return;
        }

        // Render all sections
        renderEventHeader(eventData);
        renderEventPoster(eventData);
        renderEventDescription(eventData);
        renderRegisterButton(eventData);
        
        renderAgenda(agendaData);
        renderRules(rulesData);
        renderEligibility(eligibilityData);
        renderFees(feesData);
        renderCoordinators(coordinatorsData);
        renderGallery(mediaData);

    } catch (error) {
        console.error('Error loading event details:', error);
        showEventNotFound();
    }
}

// ============================================================================
// API Helper
// ============================================================================

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        return null;
    }
}

// ============================================================================
// Render Functions
// ============================================================================

function renderEventHeader(event) {
    document.title = `${event.event_name} - TECHELONS'26`;
    
    eventTitle.className = 'text-3xl md:text-4xl lg:text-5xl font-black text-white tech-brand';
    eventTitle.innerHTML = `<span class="gradient-text">${event.event_name}</span>`;
    
    const metaItems = [
        event.stream ? `<i class="fas fa-layer-group mr-1"></i>${event.stream}` : '',
        event.mode ? `<i class="fas fa-signal mr-1"></i>${event.mode}` : '',
        event.duration_hrs ? `<i class="fas fa-clock mr-1"></i>${event.duration_hrs} hours` : ''
    ].filter(Boolean);
    
    eventMeta.className = 'flex flex-wrap gap-4 text-gray-400 text-sm';
    eventMeta.innerHTML = metaItems.map(item => 
        `<span class="flex items-center gap-1">${item}</span>`
    ).join('');
}

function renderEventPoster(event) {
    if (event && event.poster_url) {
        eventPoster.className = 'w-full h-auto rounded-lg overflow-hidden';
        eventPoster.innerHTML = `
            <img src="${event.poster_url}" 
                 alt="Event Poster" 
                 class="w-full h-auto object-contain"
                 onerror="this.parentElement.innerHTML='<div class=\\'flex items-center justify-center h-96 bg-gray-800 rounded-lg\\'><i class=\\'fas fa-image text-6xl text-gray-600\\'></i></div>'">
        `;
    } else {
        eventPoster.className = 'flex items-center justify-center h-96 bg-gray-800 rounded-lg';
        eventPoster.innerHTML = '<i class="fas fa-image text-6xl text-gray-600"></i>';
    }
}

function renderEventDescription(event) {
    if (event.full_desc) {
        eventDescription.className = 'prose text-gray-300';
        eventDescription.innerHTML = marked.parse(event.full_desc);
    } else if (event.short_desc) {
        eventDescription.className = 'text-gray-300';
        eventDescription.textContent = event.short_desc;
    } else {
        eventDescription.className = 'text-gray-500 italic';
        eventDescription.textContent = 'Description will be announced soon.';
    }
}

function renderRegisterButton(event) {
    if (event.reg_link && event.reg_link.trim() !== '') {
        registerBtn.disabled = false;
        registerBtn.innerHTML = `
            <i class="fas fa-user-plus mr-2"></i>
            Register Now
        `;
        registerBtn.onclick = () => window.open(event.reg_link, '_blank');
    } else {
        registerBtn.disabled = true;
        registerBtn.innerHTML = `
            <i class="fas fa-lock mr-2"></i>
            Registration Not Open
        `;
    }
}

function renderAgenda(agendaData) {
    if (agendaData && agendaData.length > 0) {
        agendaSection.classList.remove('hidden');
        agendaList.innerHTML = agendaData
            .sort((a, b) => a.order - b.order)
            .map(item => `
                <div class="timeline-item pb-6">
                    <div class="flex items-baseline gap-4 mb-2">
                        <span class="text-cyan-400 font-bold text-sm">
                            ${item.start_time}${item.end_time ? ` - ${item.end_time}` : ''}
                        </span>
                        <h3 class="text-xl font-bold text-white">${item.title}</h3>
                    </div>
                    ${item.description ? `<p class="text-gray-400 text-sm">${item.description}</p>` : ''}
                </div>
            `).join('');
    } else {
        agendaSection.classList.remove('hidden');
        agendaList.innerHTML = '<p class="text-gray-500 italic text-center py-4">Agenda will be announced soon.</p>';
    }
}

function renderRules(rulesData) {
    if (rulesData && rulesData.length > 0) {
        rulesSection.classList.remove('hidden');
        rulesList.innerHTML = rulesData.map(rule => `
            <li class="flex items-start gap-3">
                <i class="fas fa-check-circle text-cyan-400 mt-1"></i>
                <span>${rule.rule}</span>
            </li>
        `).join('');
    } else {
        rulesSection.classList.remove('hidden');
        rulesList.innerHTML = '<li class="text-gray-500 italic text-center py-4">Rules will be announced soon.</li>';
    }
}

function renderEligibility(eligibilityData) {
    if (eligibilityData && eligibilityData.length > 0) {
        eligibilitySection.classList.remove('hidden');
        eligibilityList.innerHTML = eligibilityData.map(item => `
            <li class="flex items-start gap-3">
                <i class="fas fa-user-check text-cyan-400 mt-1"></i>
                <span>${item.eligible_for}</span>
            </li>
        `).join('');
    } else {
        eligibilitySection.classList.remove('hidden');
        eligibilityList.innerHTML = '<li class="text-gray-500 italic text-center py-4">Eligibility criteria will be announced soon.</li>';
    }
}

function renderFees(feesData) {
    if (feesData && feesData.length > 0) {
        feesSection.classList.remove('hidden');
        const fee = feesData[0].registration_fee;
        feesText.textContent = fee === '0' || fee.toLowerCase() === 'free' ? 'FREE' : `₹${fee}`;
    } else {
        feesSection.classList.remove('hidden');
        feesText.innerHTML = '<span class="text-gray-500 italic text-2xl">Will be announced soon</span>';
    }
}

function renderCoordinators(coordinatorsData) {
    if (coordinatorsData && coordinatorsData.length > 0) {
        coordinatorsSection.classList.remove('hidden');
        coordinatorsList.innerHTML = coordinatorsData.map(coord => `
            <div class="neon-card p-5">
                <div class="text-xs uppercase tracking-wider text-cyan-400 font-bold mb-2">
                    ${coord.role}
                </div>
                <h4 class="text-lg font-bold text-white mb-1">${coord.name}</h4>
                <p class="text-gray-400 text-sm mb-2">${coord.department}</p>
                <a href="tel:${coord.contact}" class="text-cyan-400 text-sm flex items-center gap-2 hover:text-cyan-300 transition-colors">
                    <i class="fas fa-phone"></i>
                    ${coord.contact}
                </a>
            </div>
        `).join('');
    } else {
        coordinatorsSection.classList.remove('hidden');
        coordinatorsList.innerHTML = '<p class="text-gray-500 italic text-center py-4 col-span-2">Coordinators will be announced soon.</p>';
    }
}

function renderGallery(mediaData) {
    if (mediaData && mediaData.gallery_urls) {
        const galleryUrls = mediaData.gallery_urls
            .split(',')
            .map(url => url.trim())
            .filter(url => url.length > 0);
        
        if (galleryUrls.length > 0) {
            gallerySection.classList.remove('hidden');
            galleryGrid.innerHTML = galleryUrls.map(url => `
                <div class="neon-card overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300">
                    <img src="${url}" 
                         alt="Event Gallery" 
                         class="w-full h-48 object-cover"
                         loading="lazy"
                         onerror="this.parentElement.remove()">
                </div>
            `).join('');
        }
    }
}

// ============================================================================
// Error Handling
// ============================================================================

function showEventNotFound() {
    document.querySelector('main').innerHTML = `
        <div class="max-w-2xl mx-auto px-4 py-20 text-center">
            <div class="neon-card p-12">
                <i class="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-6"></i>
                <h1 class="text-4xl font-bold text-white mb-4 tech-brand">Event Not Found</h1>
                <p class="text-gray-400 mb-8">The event you're looking for doesn't exist or has been removed.</p>
                <a href="index.html" class="gradient-button inline-block">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Back to Home
                </a>
            </div>
        </div>
    `;
}
