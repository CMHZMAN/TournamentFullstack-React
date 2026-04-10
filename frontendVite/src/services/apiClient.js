/**
 * API Client Service
 * Handles all API requests with JWT authentication
 */

const API_CONFIG = {
    BASE_URL: 'http://localhost:5050/api',
    TOKEN_KEY: 'tournament_jwt_token'
};

export class ApiClient {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.tokenKey = API_CONFIG.TOKEN_KEY;
    }

    /**
     * Get the JWT token from local storage
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Set the JWT token in local storage
     */
    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Remove the JWT token from local storage
     */
    removeToken() {
        localStorage.removeItem(this.tokenKey);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Make an API request with JWT authentication
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized (expired or invalid token)
            if (response.status === 401) {
                console.warn('🔴 Token expired or invalid - clearing session');
                this.removeToken();
                localStorage.removeItem('current_user');
                localStorage.removeItem('user_roles');
                localStorage.removeItem('guest_mode');
                // Redirect to login page
                window.location.href = '/';
                throw new Error('Sessionen gick ut. Vänligen logga in igen.');
            }

            if (response.status === 429) {
                throw new Error('För många förfrågningar. Försök igen senare.');
            }

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || `HTTP Error: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);

            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                throw new Error('⚠️ API-servern är inte tillgänglig. Kontrollera att den körs på http://localhost:5050');
            }

            throw error;
        }
    }

    /**
     * Register user
     */
    async register(username, email, password) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        this.setToken(response.token);
        return response;
    }

    /**
     * Login user
     */
    async login(username, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        this.setToken(response.token);
        return response;
    }

    /**
     * Get all tournaments
     */
    async getTournaments() {
        return this.request('/tournaments', {
            method: 'GET'
        });
    }

    /**
     * Get tournament by ID
     */
    async getTournament(id) {
        return this.request(`/tournaments/${id}`, {
            method: 'GET'
        });
    }

    /**
     * Create new tournament
     */
    async createTournament(data) {
        return this.request('/tournaments', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Update tournament
     */
    async updateTournament(id, data) {
        return this.request(`/tournaments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Delete tournament
     */
    async deleteTournament(id) {
        return this.request(`/tournaments/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Get games for tournament
     */
    async getGames(tournamentId) {
        return this.request(`/tournaments/${tournamentId}/games`, {
            method: 'GET'
        });
    }

    /**
     * Get game by ID
     */
    async getGame(tournamentId, gameId) {
        return this.request(`/tournaments/${tournamentId}/games/${gameId}`, {
            method: 'GET'
        });
    }

    /**
     * Create new game
     */
    async createGame(tournamentId, data) {
        return this.request(`/tournaments/${tournamentId}/games`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Update game
     */
    async updateGame(tournamentId, gameId, data) {
        return this.request(`/tournaments/${tournamentId}/games/${gameId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Delete game
     */
    async deleteGame(tournamentId, gameId) {
        return this.request(`/tournaments/${tournamentId}/games/${gameId}`, {
            method: 'DELETE'
        });
    }
}

export const apiClient = new ApiClient();
