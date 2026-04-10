import { useState, useEffect } from 'react';
import { GameForm } from '../Games/GameForm';
import { GamesList } from '../Games/GamesList';
import { TournamentEditForm } from './TournamentEditForm';
import { useGames } from '../../hooks/useGames';

export function TournamentDetails({ 
    tournament, 
    onUpdate, 
    onDelete,
    onGameCreated,
    onGameUpdated,
    onGameDeleted,
    isGuest
}) {
    const [showGameForm, setShowGameForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const { games, isLoading: gamesLoading, loadGames, createGame, updateGame, deleteGame, error: gamesError } = useGames(tournament?.id);

    useEffect(() => {
        if (tournament?.id) {
            loadGames();
        }
    }, [tournament?.id, loadGames]);

    const handleGameCreate = async (data) => {
        try {
            await createGame(data);
            setShowGameForm(false);
            onGameCreated?.();
        } catch (err) {
            console.error('Error creating game:', err);
        }
    };

    const handleGameUpdate = async (gameId, data) => {
        try {
            await updateGame(gameId, data);
            onGameUpdated?.();
        } catch (err) {
            console.error('Error updating game:', err);
        }
    };

    const handleGameDelete = async (gameId) => {
        if (window.confirm('Är du säker på att du vill ta bort detta spel?')) {
            try {
                await deleteGame(gameId);
                onGameDeleted?.();
            } catch (err) {
                console.error('Error deleting game:', err);
            }
        }
    };

    const handleTournamentUpdate = async (data) => {
        try {
            await onUpdate(tournament.id, data);
            setShowEditForm(false);
        } catch (err) {
            console.error('Error updating tournament:', err);
        }
    };

    const handleTournamentDelete = async () => {
        if (window.confirm('Är du säker på att du vill ta bort denna turnering?')) {
            try {
                await onDelete(tournament.id);
            } catch (err) {
                console.error('Error deleting tournament:', err);
            }
        }
    };

    if (!tournament) return null;

    const tournamentDate = new Date(tournament.date).toLocaleString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <main className="tournament-details">
            {showEditForm ? (
                <TournamentEditForm
                    tournament={tournament}
                    onSubmit={handleTournamentUpdate}
                    onCancel={() => setShowEditForm(false)}
                />
            ) : (
                <>
                    <div className="tournament-header">
                        <div className="tournament-info">
                            <h2>{tournament.title}</h2>
                            <p>{tournament.description}</p>
                        </div>
                        {!isGuest && (
                            <div className="tournament-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowEditForm(true)}
                                >
                                    Redigera
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleTournamentDelete}
                                >
                                    Ta bort
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="tournament-meta">
                        <div className="meta-item">
                            <span className="meta-label">Max spelare:</span>
                            <span>{tournament.maxPlayers}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Datum:</span>
                            <span>{tournamentDate}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Antal spel:</span>
                            <span>{games.length}</span>
                        </div>
                    </div>

                    <section className="games-section">
                        <div className="games-header">
                            <h3>Spel i turneringen</h3>
                            {!isGuest && (
                                <button
                                    className="btn btn-primary btn-small"
                                    onClick={() => setShowGameForm(!showGameForm)}
                                >
                                    + Lägg till spel
                                </button>
                            )}
                        </div>

                        {showGameForm && (
                            <GameForm
                                onSubmit={handleGameCreate}
                                onCancel={() => setShowGameForm(false)}
                                error={gamesError}
                                tournamentId={tournament.id}
                            />
                        )}

                        <GamesList
                            games={games}
                            isLoading={gamesLoading}
                            onEdit={handleGameUpdate}
                            onDelete={handleGameDelete}
                            isGuest={isGuest}
                        />
                    </section>
                </>
            )}
        </main>
    );
}
