/**
 * Games Module
 * Handles all game-related functionality
 */

let gamesData = [];
let editingGameId = null;

/**
 * Load games for a selected tournament
 */
async function loadGamesForTournament(tournamentId) {
    const gamesList = document.getElementById('games-list');
    editingGameId = null;
    hideGameForm();

    try {
        gamesList.innerHTML = '<p class="loading">Laddar spel...</p>';

        gamesData = await apiClient.getGames(tournamentId);

        if (!gamesData || gamesData.length === 0) {
            gamesList.innerHTML = '<p class="loading">Inga spel hittades för denna turnering</p>';
        } else {
            renderGames(gamesData);
        }

        // Update the game count in the details view
        const gameCountElement = document.getElementById('details-tournament-gamecount');
        if (gameCountElement) {
            gameCountElement.textContent = gamesData ? gamesData.length : 0;
        }

        // Update the game count in the sidebar
        const tournament = tournamentsData.find(t => t.id === tournamentId);
        if (tournament) {
            tournament.gameCount = gamesData ? gamesData.length : 0;
        }
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

    gamesList.innerHTML = games.map(game => {
        const gameTime = new Date(game.time);
        const timeStr = gameTime.toLocaleString('sv-SE', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        return `
            <div class="game-card" id="game-${game.id}">
                <div id="view-${game.id}" class="game-view">
                    <h3>${escapeHtml(game.title)}</h3>
                    <div class="card-info">
                        <div><span>Tid:</span> ${timeStr}</div>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="editGame(${game.id})">Redigera</button>
                        <button class="btn btn-danger" onclick="deleteGame(${game.id})">Ta bort</button>
                    </div>
                </div>
                <div id="edit-${game.id}" class="game-edit" style="display: none;">
                    <div class="form-group">
                        <label>Titel:</label>
                        <input type="text" id="edit-title-${game.id}" value="${escapeHtml(game.title)}" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Datum:</label>
                        <input type="date" id="edit-date-${game.id}" value="${gameTime.toISOString().split('T')[0]}" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Timme:</label>
                        <select id="edit-hour-${game.id}" class="form-input">
                            ${Array.from({length: 24}, (_, i) => `<option value="${String(i).padStart(2, '0')}" ${gameTime.getHours() === i ? 'selected' : ''}>${String(i).padStart(2, '0')}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Minut:</label>
                        <select id="edit-minute-${game.id}" class="form-input">
                            <option value="00" ${gameTime.getMinutes() === 0 ? 'selected' : ''}>00</option>
                            <option value="15" ${gameTime.getMinutes() === 15 ? 'selected' : ''}>15</option>
                            <option value="30" ${gameTime.getMinutes() === 30 ? 'selected' : ''}>30</option>
                            <option value="45" ${gameTime.getMinutes() === 45 ? 'selected' : ''}>45</option>
                        </select>
                    </div>
                    <div id="edit-error-${game.id}" class="error-message"></div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="saveGameEdit(${game.id})">Spara</button>
                        <button class="btn btn-secondary" onclick="cancelEditGame(${game.id})">Avbryt</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Show new game form
 */
function showNewGameForm() {
    document.getElementById('game-form').classList.remove('hidden');
    document.getElementById('game-form').reset();
    editingGameId = null;
    const submitBtn = document.querySelector('#game-form button[type="submit"]');
    submitBtn.textContent = 'Lägg till spel';
}

/**
 * Hide game form
 */
function hideGameForm() {
    document.getElementById('game-form').classList.add('hidden');
    document.getElementById('game-form').reset();
    editingGameId = null;
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

        const dateValue = formData.get('game-form-date');
        const hour = formData.get('game-form-hour');
        const minute = formData.get('game-form-minute');

        // Skapa tid UTAN timezone-konvertering (bare ISO-string utan Z)
        const localDateTime = `${dateValue}T${hour}:${minute}:00`;
        const gameTime = new Date(localDateTime);
        const now = new Date();

        if (gameTime <= now) {
            errorElement.textContent = 'Datum och tid måste vara i framtiden';
            return;
        }

        // Skicka tiden utan timezone-konvertering
        const gameData = {
            title,
            time: localDateTime
        };

        // Only add tournamentId for new games (not for updates)
        if (!editingGameId) {
            gameData.tournamentId = selectedTournamentId;
        }

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
        hideGameForm();
        await loadGamesForTournament(selectedTournamentId);

        // Update tournament game count
        const tournament = tournamentsData.find(t => t.id === selectedTournamentId);
        if (tournament) {
            // Reload tournaments to update counts
            await loadTournaments();
        }

        console.log('Game saved successfully');
    } catch (error) {
        console.error('Error saving game:', error);
        errorElement.textContent = `Fel: ${error.message}`;
    }
}

/**
 * Edit game - Show inline edit form
 */
function editGame(gameId) {
    const viewDiv = document.getElementById(`view-${gameId}`);
    const editDiv = document.getElementById(`edit-${gameId}`);

    if (viewDiv) viewDiv.style.display = 'none';
    if (editDiv) editDiv.style.display = 'block';

    // Focus on title field
    setTimeout(() => document.getElementById(`edit-title-${gameId}`).focus(), 100);
}

/**
 * Cancel edit game
 */
function cancelEditGame(gameId) {
    const viewDiv = document.getElementById(`view-${gameId}`);
    const editDiv = document.getElementById(`edit-${gameId}`);

    if (editDiv) editDiv.style.display = 'none';
    if (viewDiv) viewDiv.style.display = 'block';
}

/**
 * Save game edit - UTAN TIMEZONE-KONVERTERING
 */
async function saveGameEdit(gameId) {
    try {
        const title = document.getElementById(`edit-title-${gameId}`).value;
        const dateValue = document.getElementById(`edit-date-${gameId}`).value;
        const hour = document.getElementById(`edit-hour-${gameId}`).value;
        const minute = document.getElementById(`edit-minute-${gameId}`).value;
        const errorElement = document.getElementById(`edit-error-${gameId}`);

        errorElement.textContent = '';

        if (!title.trim()) {
            errorElement.textContent = 'Titel är obligatorisk';
            return;
        }

        // Skapa datum UTAN timezone-konvertering
        // Format: YYYY-MM-DDTHH:mm:ss (utan Z för UTC)
        const localDateTime = `${dateValue}T${hour}:${minute}:00`;
        const gameTime = new Date(localDateTime);
        const now = new Date();

        if (gameTime <= now) {
            errorElement.textContent = 'Datum och tid måste vara i framtiden';
            return;
        }

        // Skicka tiden utan timezone-konvertering
        const gameData = {
            title: title.trim(),
            time: localDateTime
        };

        await apiClient.updateGame(selectedTournamentId, gameId, gameData);

        // Reload games
        await loadGamesForTournament(selectedTournamentId);

        // Reload tournaments to update counts
        const tournament = tournamentsData.find(t => t.id === selectedTournamentId);
        if (tournament) {
            await loadTournaments();
        }

        console.log('Game saved successfully');
    } catch (error) {
        console.error('Error saving game:', error);
        const errorElement = document.getElementById(`edit-error-${gameId}`);
        if (errorElement) {
            errorElement.textContent = `Fel: ${error.message}`;
        }
    }
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
