import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

export function useGames(tournamentId) {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadGames = useCallback(async () => {
        if (!tournamentId) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiClient.getGames(tournamentId);
            setGames(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [tournamentId]);

    const createGame = useCallback(async (data) => {
        if (!tournamentId) throw new Error('Tournament ID is required');
        
        setError(null);
        try {
            const newGame = await apiClient.createGame(tournamentId, data);
            setGames(prev => [...prev, newGame]);
            return newGame;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [tournamentId]);

    const updateGame = useCallback(async (gameId, data) => {
        if (!tournamentId) throw new Error('Tournament ID is required');
        
        setError(null);
        try {
            const updated = await apiClient.updateGame(tournamentId, gameId, data);
            setGames(prev => prev.map(g => g.id === gameId ? updated : g));
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [tournamentId]);

    const deleteGame = useCallback(async (gameId) => {
        if (!tournamentId) throw new Error('Tournament ID is required');
        
        setError(null);
        try {
            await apiClient.deleteGame(tournamentId, gameId);
            setGames(prev => prev.filter(g => g.id !== gameId));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [tournamentId]);

    return {
        games,
        isLoading,
        error,
        loadGames,
        createGame,
        updateGame,
        deleteGame
    };
}
