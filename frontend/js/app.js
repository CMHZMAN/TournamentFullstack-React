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
