/**
 * Main Application Module
 * Handles overall app initialization and tab navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Check authentication state on load
    checkAuthentication();

    // Setup game form listener
    const gameForm = document.getElementById('game-form');
    if (gameForm) {
        gameForm.addEventListener('submit', handleGameFormSubmit);
    }

    // Populera timväljare
    populateHourSelect();
    populateMinuteSelect();
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Show error banner with message
 */
function showErrorBanner(message) {
    const banner = document.getElementById('error-banner');
    const messageElement = document.getElementById('error-banner-message');

    if (banner && messageElement) {
        messageElement.textContent = message;
        banner.classList.remove('hidden');

        // Auto-hide after 8 seconds
        setTimeout(() => {
            closeErrorBanner();
        }, 8000);
    }
}

/**
 * Close error banner
 */
function closeErrorBanner() {
    const banner = document.getElementById('error-banner');
    if (banner) {
        banner.classList.add('hidden');
    }
}

// Initialize app on page load
window.addEventListener('load', () => {
    // Additional setup if needed
});

/**
 * Populera timväljare (00-23)
 */
function populateHourSelect() {
    const hourSelect = document.getElementById('game-form-hour');
    if (!hourSelect) {
        console.error('game-form-hour element not found');
        return;
    }

    // Rensa alla options utom första
    while (hourSelect.options.length > 1) {
        hourSelect.remove(1);
    }

    // Lägg till timmar
    for (let i = 0; i < 24; i++) {
        const hour = String(i).padStart(2, '0');
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = hour;
        hourSelect.appendChild(option);
    }
}

/**
 * Populera minutväljare (00, 15, 30, 45)
 */
function populateMinuteSelect() {
    const minuteSelect = document.getElementById('game-form-minute');
    if (!minuteSelect) return;

    // Rensa alla options utom första
    while (minuteSelect.options.length > 1) {
        minuteSelect.remove(1);
    }

    // Lägg till minuter
    const minutes = ['00', '15', '30', '45'];
    minutes.forEach(minute => {
        const option = document.createElement('option');
        option.value = minute;
        option.textContent = minute;
        minuteSelect.appendChild(option);
    });
}
