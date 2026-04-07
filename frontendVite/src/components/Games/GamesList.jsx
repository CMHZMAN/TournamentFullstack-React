import { useState } from 'react';

export function GamesList({ games, isLoading, onEdit, onDelete }) {
    const [editingGameId, setEditingGameId] = useState(null);
    const [editData, setEditData] = useState({});

    const handleEditClick = (game) => {
        setEditingGameId(game.id);
        const gameTime = new Date(game.time);
        setEditData({
            title: game.title,
            date: gameTime.toISOString().split('T')[0],
            hour: String(gameTime.getHours()).padStart(2, '0'),
            minute: String(gameTime.getMinutes()).padStart(2, '0')
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = async (gameId) => {
        try {
            const dateTime = new Date(`${editData.date}T${editData.hour}:${editData.minute}:00`);
            await onEdit(gameId, {
                title: editData.title,
                time: dateTime.toISOString()
            });
            setEditingGameId(null);
        } catch (err) {
            console.error('Edit error:', err);
        }
    };

    const handleCancel = () => {
        setEditingGameId(null);
    };

    return (
        <div className="games-list-details">
            {isLoading ? (
                <p className="loading">Laddar spel...</p>
            ) : games.length === 0 ? (
                <p className="loading">Inga spel hittades för denna turnering</p>
            ) : (
                games.map(game => {
                    const gameTime = new Date(game.time);
                    const timeStr = gameTime.toLocaleString('sv-SE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <div key={game.id} className="game-card" id={`game-${game.id}`}>
                            {editingGameId === game.id ? (
                                <div className="game-edit">
                                    <div className="form-group">
                                        <label>Titel:</label>
                                        <input
                                            type="text"
                                            value={editData.title || ''}
                                            onChange={(e) => handleEditChange({ target: { name: 'title', value: e.target.value } })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Datum:</label>
                                        <input
                                            type="date"
                                            value={editData.date || ''}
                                            onChange={(e) => handleEditChange({ target: { name: 'date', value: e.target.value } })}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Timme:</label>
                                        <select
                                            value={editData.hour || ''}
                                            onChange={(e) => handleEditChange({ target: { name: 'hour', value: e.target.value } })}
                                            className="form-input"
                                        >
                                            {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(h => (
                                                <option key={h} value={h}>{h}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Minut:</label>
                                        <select
                                            value={editData.minute || ''}
                                            onChange={(e) => handleEditChange({ target: { name: 'minute', value: e.target.value } })}
                                            className="form-input"
                                        >
                                            <option value="00">00</option>
                                            <option value="15">15</option>
                                            <option value="30">30</option>
                                            <option value="45">45</option>
                                        </select>
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleEditSubmit(game.id)}
                                        >
                                            Spara
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={handleCancel}
                                        >
                                            Avbryt
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div id={`view-${game.id}`} className="game-view">
                                    <h3>{game.title}</h3>
                                    <div className="card-info">
                                        <div><span>Tid:</span> {timeStr}</div>
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleEditClick(game)}
                                        >
                                            Redigera
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => onDelete(game.id)}
                                        >
                                            Ta bort
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
