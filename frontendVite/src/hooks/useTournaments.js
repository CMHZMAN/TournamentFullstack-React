import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

export function useTournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadTournaments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiClient.getTournaments();
            
            // Load game count for each tournament
            const tournamentsWithGameCount = await Promise.all(
                (data || []).map(async (tournament) => {
                    try {
                        const games = await apiClient.getGames(tournament.id);
                        return {
                            ...tournament,
                            gameCount: games ? games.length : 0
                        };
                    } catch (err) {
                        console.warn(`Could not load games for tournament ${tournament.id}:`, err);
                        return {
                            ...tournament,
                            gameCount: 0
                        };
                    }
                })
            );
            
            setTournaments(tournamentsWithGameCount);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createTournament = useCallback(async (data) => {
        setError(null);
        try {
            const newTournament = await apiClient.createTournament(data);
            setTournaments(prev => [...prev, { ...newTournament, gameCount: 0 }]);
            return newTournament;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const updateTournament = useCallback(async (id, data) => {
        setError(null);
        try {
            const updated = await apiClient.updateTournament(id, data);
            setTournaments(prev =>
                prev.map(t => t.id === id ? { ...updated, gameCount: t.gameCount } : t)
            );
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const deleteTournament = useCallback(async (id) => {
        setError(null);
        try {
            await apiClient.deleteTournament(id);
            setTournaments(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        tournaments,
        isLoading,
        error,
        loadTournaments,
        createTournament,
        updateTournament,
        deleteTournament
    };
}
