/**
 * DOM-Safe Event Data Handler
 * Prevents "Cannot set properties of null" errors by:
 * - Waiting for DOM to be fully loaded
 * - Checking element existence before manipulation
 * - Safely parsing JSON data
 * - Using defensive programming patterns
 */

// Wait for DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {
    
    // ====== STEP 1: Safely retrieve and parse JSON data ======
    
    /**
     * Get the JSON data script element
     * Returns null if element doesn't exist
     */
    const jsonScriptElement = document.getElementById('event-data-json');
    
    // Exit early if JSON script element is missing
    if (!jsonScriptElement) {
        console.warn('Event data script element (#event-data-json) not found');
        return;
    }
    
    // Parse JSON with error handling
    let eventData = null;
    try {
        const jsonText = jsonScriptElement.textContent || jsonScriptElement.innerText;
        eventData = JSON.parse(jsonText);
        console.log('Event data loaded successfully:', eventData);
    } catch (error) {
        console.error('Failed to parse event data JSON:', error);
        return; // Exit if JSON is invalid
    }
    
    // Exit if parsed data is empty or invalid
    if (!eventData || typeof eventData !== 'object') {
        console.warn('Event data is empty or invalid');
        return;
    }
    
    
    // ====== STEP 2: Define element mappings (ID -> data property) ======
    
    /**
     * Map of element IDs to their corresponding data properties
     * Format: { elementId: dataProperty }
     */
    const elementMappings = {
        'nav-event-name': 'eventName',
        'event-name-hero': 'eventName',
        'event-tagline-hero': 'tagline',
        'event-date-hero': 'eventDate',
        'venue-name': 'venue',
        'venue-address': 'address',
        'footer-event-name': 'eventName',
        'footer-group-details': 'organizerDetails'
        // Add more mappings as needed
    };
    
    
    // ====== STEP 3: Safely update DOM elements ======
    
    /**
     * Safely set text content for an element
     * @param {string} elementId - The ID of the element to update
     * @param {string} value - The text value to set
     */
    function safelySetTextContent(elementId, value) {
        // Find the element
        const element = document.getElementById(elementId);
        
        // Check if element exists
        if (!element) {
            console.debug(`Element #${elementId} not found - skipping`);
            return false;
        }
        
        // Check if value is valid
        if (value === null || value === undefined) {
            console.debug(`No value provided for #${elementId} - skipping`);
            return false;
        }
        
        // Safely set the text content
        try {
            element.textContent = String(value);
            console.debug(`✓ Updated #${elementId} with value:`, value);
            return true;
        } catch (error) {
            console.error(`Failed to update #${elementId}:`, error);
            return false;
        }
    }
    
    
    // ====== STEP 4: Update all mapped elements ======
    
    let successCount = 0;
    let skipCount = 0;
    
    // Loop through each mapping and update elements
    for (const [elementId, dataProperty] of Object.entries(elementMappings)) {
        const value = eventData[dataProperty];
        const updated = safelySetTextContent(elementId, value);
        
        if (updated) {
            successCount++;
        } else {
            skipCount++;
        }
    }
    
    // Log summary
    console.log(`DOM update complete: ${successCount} updated, ${skipCount} skipped`);
    
    
    // ====== STEP 5: Handle special cases (optional) ======
    
    /**
     * Example: Update elements with innerHTML (for formatted content)
     * Use only with trusted data to prevent XSS attacks
     */
    function safelySetInnerHTML(elementId, htmlContent) {
        const element = document.getElementById(elementId);
        
        if (!element) {
            console.debug(`Element #${elementId} not found - skipping HTML update`);
            return false;
        }
        
        if (!htmlContent) {
            console.debug(`No HTML content for #${elementId} - skipping`);
            return false;
        }
        
        try {
            // Sanitize if needed (consider using DOMPurify for production)
            element.innerHTML = htmlContent;
            console.debug(`✓ Updated #${elementId} with HTML content`);
            return true;
        } catch (error) {
            console.error(`Failed to update HTML for #${elementId}:`, error);
            return false;
        }
    }
    
    
    // ====== STEP 6: Handle dynamic attributes (optional) ======
    
    /**
     * Safely set element attributes
     * @param {string} elementId - The ID of the element
     * @param {string} attributeName - The attribute to set
     * @param {string} attributeValue - The value to set
     */
    function safelySetAttribute(elementId, attributeName, attributeValue) {
        const element = document.getElementById(elementId);
        
        if (!element) {
            console.debug(`Element #${elementId} not found - skipping attribute update`);
            return false;
        }
        
        if (!attributeValue) {
            console.debug(`No value for attribute ${attributeName} on #${elementId}`);
            return false;
        }
        
        try {
            element.setAttribute(attributeName, attributeValue);
            console.debug(`✓ Set ${attributeName}="${attributeValue}" on #${elementId}`);
            return true;
        } catch (error) {
            console.error(`Failed to set attribute on #${elementId}:`, error);
            return false;
        }
    }
    
    // Example: Update image alt text if data contains image info
    if (eventData.posterImage) {
        safelySetAttribute('event-poster-img', 'src', eventData.posterImage);
        safelySetAttribute('event-poster-img', 'alt', `${eventData.eventName} Poster`);
    }
    
    
    // ====== STEP 7: Query selector alternative (for classes) ======
    
    /**
     * Update all elements with a specific class
     * @param {string} className - The class name to query
     * @param {string} value - The text value to set
     */
    function safelyUpdateByClass(className, value) {
        if (!value) return 0;
        
        const elements = document.querySelectorAll(`.${className}`);
        let count = 0;
        
        elements.forEach((element, index) => {
            try {
                element.textContent = String(value);
                count++;
            } catch (error) {
                console.error(`Failed to update element ${index} with class .${className}:`, error);
            }
        });
        
        if (count > 0) {
            console.debug(`✓ Updated ${count} element(s) with class .${className}`);
        }
        
        return count;
    }
    
    // Example: Update all elements with class 'event-name'
    if (eventData.eventName) {
        safelyUpdateByClass('event-name', eventData.eventName);
    }
    
    
    // ====== STEP 8: Dispatch custom event (optional) ======
    
    /**
     * Notify other scripts that event data has been loaded
     * Other scripts can listen: document.addEventListener('eventDataLoaded', handler)
     */
    try {
        const customEvent = new CustomEvent('eventDataLoaded', {
            detail: { eventData: eventData },
            bubbles: true
        });
        document.dispatchEvent(customEvent);
        console.log('Dispatched eventDataLoaded event');
    } catch (error) {
        console.error('Failed to dispatch custom event:', error);
    }
    
});


/**
 * Additional helper: MutationObserver for dynamically added elements
 * Use this if elements are added to the DOM after initial load
 */
function observeAndUpdateElements(eventData) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // Check if this is one of our target elements
                    const id = node.id;
                    if (id && eventData[id]) {
                        node.textContent = eventData[id];
                        console.debug(`✓ Updated dynamically added #${id}`);
                    }
                }
            });
        });
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    return observer;
}


/**
 * Error boundary wrapper for critical operations
 * Prevents one error from breaking the entire script
 */
function safeExecute(fn, context = 'Operation') {
    try {
        return fn();
    } catch (error) {
        console.error(`${context} failed:`, error);
        return null;
    }
}


/**
 * USAGE EXAMPLE:
 * 
 * In your HTML:
 * <script type="application/json" id="event-data-json">
 * {
 *   "eventName": "TeCHELONS'26",
 *   "tagline": "Think Beyond Technology",
 *   "eventDate": "January 19-20, 2026",
 *   "venue": "Swami Vivekananda Auditorium"
 * }
 * </script>
 * 
 * Include this script:
 * <script src="fix-dom-error.js"></script>
 * 
 * Elements will be safely updated, no null errors!
 */
