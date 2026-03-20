/**
 * Tournaments Module
 * Handles all tournament-related functionality
 */

let tournamentsData = [];
let selectedTournamentId = null;
let editingTournamentId = null;

document.addEventListener('DOMContentLoaded', () => {
    initTournaments();
});

/**
 * Initialize tournaments module
 */
function initTournaments() {
    const tournamentForm = document.getElementById('tournament-form');
    const tournamentEditForm = document.getElementById('tournament-edit-form');
    const gameForm = document.getElementById('game-form');

    if (tournamentForm) {
        tournamentForm.addEventListener('submit', handleTournamentFormSubmit);
    }

    if (tournamentEditForm) {
        tournamentEditForm.addEventListener('submit', handleTournamentEditFormSubmit);
    }

    if (gameForm) {
        gameForm.addEventListener('submit', handleGameFormSubmit);
    }

    // Load tournaments on app start
    loadTournaments();
}

/**
 * Load tournaments from API
 */
async function loadTournaments() {
    const tournamentsList = document.getElementById('tournaments-list');

    try {
        tournamentsList.innerHTML = '<p class="loading">Laddar turneringar...</p>';

        tournamentsData = await apiClient.getTournaments();

        if (!tournamentsData || tournamentsData.length === 0) {
            tournamentsList.innerHTML = '<p class="loading">Inga turneringar hittades</p>';
            return;
        }

        renderTournamentsSidebar(tournamentsData);
    } catch (error) {
        console.error('Error loading tournaments:', error);
        tournamentsList.innerHTML = `<p class="loading">Fel vid hämtning av turneringar: ${error.message}</p>`;
    }
}

/**
 * Render tournaments list in sidebar
 */
function renderTournamentsSidebar(tournaments) {
    const tournamentsList = document.getElementById('tournaments-list');

    if (!tournaments || tournaments.length === 0) {
        tournamentsList.innerHTML = '<p class="loading">Inga turneringar hittades</p>';
        return;
    }

    tournamentsList.innerHTML = tournaments.map(tournament => `
        <div class="tournament-card-sidebar ${selectedTournamentId === tournament.id ? 'active' : ''}" onclick="selectTournament(${tournament.id})">
            <h3>${escapeHtml(tournament.title)}</h3>
            <div class="tournament-card-sidebar-info">
                <div>${escapeHtml(tournament.description || 'Ingen beskrivning')}</div>
                <div>${new Date(tournament.date).toLocaleDateString('sv-SE')}</div>
                <div>${tournament.games?.length || 0} spel</div>
            </div>
        </div>
    `).join('');
}

/**
 * Select a tournament and show its details
 */
async function selectTournament(tournamentId) {
    selectedTournamentId = tournamentId;
    const tournament = tournamentsData.find(t => t.id === tournamentId);

    if (!tournament) return;

    // Hide forms
    hideTournamentForm();
    hideEditTournamentForm();
    hideGameForm();

    // Update sidebar highlighting
    document.querySelectorAll('.tournament-card-sidebar').forEach(card => {
        card.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Show tournament details
    showTournamentDetails(tournament);
}

/**
 * Show tournament details
 */
function showTournamentDetails(tournament) {
    const detailsView = document.getElementById('tournament-details-view');
    const noSelection = document.getElementById('no-tournament-selected');

    // Hide no selection message
    noSelection.classList.add('hidden');
    detailsView.classList.remove('hidden');

    // Update tournament info
    document.getElementById('details-tournament-title').textContent = tournament.title;
    document.getElementById('details-tournament-description').textContent = tournament.description || 'Ingen beskrivning';
    document.getElementById('details-tournament-maxplayers').textContent = tournament.maxPlayers;
    document.getElementById('details-tournament-date').textContent = new Date(tournament.date).toLocaleDateString('sv-SE');
    document.getElementById('details-tournament-gamecount').textContent = tournament.games?.length || 0;

    // Load games for this tournament
    loadGamesForTournament(tournament.id);
}

/**
 * Show new tournament form
 */
function showNewTournamentForm() {
    document.getElementById('tournament-form').classList.remove('hidden');
    document.getElementById('tournament-form').reset();
}

/**
 * Hide tournament form
 */
function hideTournamentForm() {
    document.getElementById('tournament-form').classList.add('hidden');
    document.getElementById('tournament-form').reset();
}

/**
 * Show edit tournament form
 */
function showEditTournamentForm() {
    if (!selectedTournamentId) return;

    const tournament = tournamentsData.find(t => t.id === selectedTournamentId);
    if (!tournament) return;

    // Fill edit form
    document.getElementById('tournament-title-edit').value = tournament.title;
    document.getElementById('tournament-description-edit').value = tournament.description || '';
    document.getElementById('tournament-maxplayers-edit').value = tournament.maxPlayers;
    document.getElementById('tournament-date-edit').value = new Date(tournament.date).toISOString().slice(0, 16);

    // Show form
    editingTournamentId = selectedTournamentId;
    document.getElementById('tournament-edit-form').classList.remove('hidden');
    document.getElementById('tournament-details-view').classList.add('hidden');
}

/**
 * Hide edit tournament form
 */
function hideEditTournamentForm() {
    document.getElementById('tournament-edit-form').classList.add('hidden');
    document.getElementById('tournament-edit-form').reset();
    editingTournamentId = null;

    if (selectedTournamentId) {
        const tournament = tournamentsData.find(t => t.id === selectedTournamentId);
        if (tournament) {
            showTournamentDetails(tournament);
        }
    }
}

/**
 * Handle new tournament form submission
 */
async function handleTournamentFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const maxPlayers = parseInt(formData.get('maxPlayers'));
    const date = formData.get('date');

    const errorElement = document.getElementById('tournament-form-error');

    try {
        errorElement.textContent = '';

        // Validate that date is in the future
        const tournamentDate = new Date(date);
        const now = new Date();

        if (tournamentDate <= now) {
            errorElement.textContent = 'Datum och tid måste vara i framtiden';
            return;
        }

        // Create tournament object
        const tournamentData = {
            title,
            description: description || null,
            maxPlayers,
            date: tournamentDate.toISOString()
        };

        // Call API
        await apiClient.createTournament(tournamentData);

        // Reset and reload
        e.target.reset();
        hideTournamentForm();
        await loadTournaments();
    } catch (error) {
        console.error('Error creating tournament:', error);
        errorElement.textContent = `Fel: ${error.message}`;
    }
}

/**
 * Handle edit tournament form submission
 */
async function handleTournamentEditFormSubmit(e) {
    e.preventDefault();

    if (!editingTournamentId) return;

    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const maxPlayers = parseInt(formData.get('maxPlayers'));
    const date = formData.get('date');

    const errorElement = document.getElementById('tournament-edit-form-error');

    try {
        errorElement.textContent = '';

        // Validate that date is in the future
        const tournamentDate = new Date(date);
        const now = new Date();

        if (tournamentDate <= now) {
            errorElement.textContent = 'Datum och tid måste vara i framtiden';
            return;
        }

        // Create tournament object
        const tournamentData = {
            title,
            description: description || null,
            maxPlayers,
            date: tournamentDate.toISOString()
        };

        // Call API
        await apiClient.updateTournament(editingTournamentId, tournamentData);

        // Save the ID before resetting
        const updatedId = editingTournamentId;

        // Reset and reload
        editingTournamentId = null;
        await loadTournaments();

        // Re-select the tournament to show updated details
        const updatedTournament = tournamentsData.find(t => t.id === updatedId);
        if (updatedTournament) {
            selectTournament(updatedId);
        } else {
            hideEditTournamentForm();
        }
    } catch (error) {
        console.error('Error updating tournament:', error);
        errorElement.textContent = `Fel: ${error.message}`;
    }
}

/**
 * Delete current tournament
 */
async function deleteCurrentTournament() {
    if (!selectedTournamentId) return;

    if (!confirm('Är du säker på att du vill ta bort denna turnering och alla dess spel?')) {
        return;
    }

    try {
        await apiClient.deleteTournament(selectedTournamentId);
        selectedTournamentId = null;
        await loadTournaments();

        // Hide details
        document.getElementById('tournament-details-view').classList.add('hidden');
        document.getElementById('no-tournament-selected').classList.remove('hidden');
    } catch (error) {
        console.error('Error deleting tournament:', error);
        showErrorBanner(`Fel vid borttagning: ${error.message}`);
    }
}

/**
 * Utility function to escape HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
