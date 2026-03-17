/**
 * Games Module
 * Handles all game-related functionality
 */

let gamesData = [];
let selectedTournamentId = null;
let editingGameId = null;

document.addEventListener('DOMContentLoaded', () => {
    initGames();
});

/**
 * Initialize games module
 */
function initGames() {
    const gameForm = document.getElementById('game-form');

    if (gameForm) {
        gameForm.addEventListener('submit', handleGameFormSubmit);
    }
}

/**
 * Load games for a selected tournament
 */
async function loadGamesForTournament(tournamentId) {
    const gamesList = document.getElementById('games-list');
    selectedTournamentId = tournamentId;
    editingGameId = null;
    resetGameForm();

    try {
        gamesList.innerHTML = '<p class="loading">Laddar spel...</p>';

        gamesData = await apiClient.getGames(tournamentId);

        if (!gamesData || gamesData.length === 0) {
            gamesList.innerHTML = '<p class="loading">Inga spel hittades för denna turnering</p>';
            return;
        }

        renderGames(gamesData);
    } catch (error) {
        console.error('Error loading games:', error);
        gamesList.innerHTML = `<p class="loading">Fel vid hämtning av spel: ${error.message}</p>`;
    }
}

/**
 * Render games list
 */
function renderGames(games) {
    const gamesList = document.getElementById('games-list');

    if (!games || games.length === 0) {
        gamesList.innerHTML = '<p class="loading">Inga spel hittades</p>';
        return;
    }

    gamesList.innerHTML = games.map(game => `
        <div class="game-card">
            <h3>${escapeHtml(game.title)}</h3>
            <div class="card-info">
                <div><span>Tid:</span> ${new Date(game.time).toLocaleString('sv-SE')}</div>
                <div><span>Turnering ID:</span> ${game.tournamentId}</div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="editGame(${game.id})">Redigera</button>
                <button class="btn btn-danger" onclick="deleteGame(${game.id})">Ta bort</button>
            </div>
        </div>
    `).join('');
}

/**
 * Handle game form submission (Create or Update)
 */
async function handleGameFormSubmit(e) {
    e.preventDefault();

    if (!selectedTournamentId) {
        alert('Välj en turnering först');
        return;
    }

    const formData = new FormData(e.target);
    const title = formData.get('title');
    const time = formData.get('time');

    const errorElement = document.getElementById('game-form-error');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
        errorElement.textContent = '';

        // Validate that time is in the future
        const gameTime = new Date(time);
        const now = new Date();

        if (gameTime <= now) {
            errorElement.textContent = 'Datum och tid måste vara i framtiden';
            return;
        }

        // Create game object
        const gameData = {
            title,
            time: gameTime.toISOString(),
            tournamentId: selectedTournamentId
        };

        // Check if we're updating or creating
        if (editingGameId) {
            // Update existing game
            await apiClient.updateGame(selectedTournamentId, editingGameId, gameData);
            editingGameId = null;
            submitBtn.textContent = 'Lägg till spel';
        } else {
            // Create new game
            await apiClient.createGame(selectedTournamentId, gameData);
        }

        // Reset form and reload
        e.target.reset();
        await loadGamesForTournament(selectedTournamentId);

        console.log('Game saved successfully');
    } catch (error) {
        console.error('Error saving game:', error);
        errorElement.textContent = `Fel: ${error.message}`;
    }
}

/**
 * Edit game - populate form with data
 */
async function editGame(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;

    // Fill form with game data
    document.getElementById('game-title').value = game.title;
    document.getElementById('game-time').value = new Date(game.time).toISOString().slice(0, 16);

    // Change button text and set editing state
    const submitBtn = document.querySelector('#game-form button[type="submit"]');
    const cancelBtn = document.getElementById('cancel-game-btn');
    submitBtn.textContent = 'Uppdatera spel';
    cancelBtn.style.display = 'inline-block';
    editingGameId = gameId;

    // Scroll to form
    document.getElementById('game-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Reset game form
 */
function resetGameForm() {
    document.getElementById('game-form').reset();
    const submitBtn = document.querySelector('#game-form button[type="submit"]');
    const cancelBtn = document.getElementById('cancel-game-btn');
    submitBtn.textContent = 'Lägg till spel';
    cancelBtn.style.display = 'none';
    editingGameId = null;
}

/**
 * Delete game
 */
async function deleteGame(gameId) {
    if (!confirm('Är du säker på att du vill ta bort detta spel?')) {
        return;
    }

    const errorElement = document.getElementById('game-form-error');

    try {
        errorElement.textContent = '';
        await apiClient.deleteGame(selectedTournamentId, gameId);
        await loadGamesForTournament(selectedTournamentId);
    } catch (error) {
        console.error('Error deleting game:', error);
        errorElement.textContent = `Fel vid borttagning: ${error.message}`;
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
