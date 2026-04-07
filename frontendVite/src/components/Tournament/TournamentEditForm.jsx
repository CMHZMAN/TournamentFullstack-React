import { useState } from 'react';

export function TournamentEditForm({ tournament, onSubmit, onCancel, error }) {
    const [formData, setFormData] = useState({
        title: tournament?.title || '',
        description: tournament?.description || '',
        maxPlayers: tournament?.maxPlayers || 2,
        date: tournament?.date || ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'maxPlayers' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit(formData);
        } catch (err) {
            console.error('Form error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="tournament-form-inline" onSubmit={handleSubmit}>
            <h3>Redigera turnering</h3>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="tournament-title-edit">Namn:</label>
                    <input
                        type="text"
                        id="tournament-title-edit"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="tournament-description-edit">Beskrivning:</label>
                    <input
                        type="text"
                        id="tournament-description-edit"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="tournament-maxplayers-edit">Max spelare:</label>
                    <input
                        type="number"
                        id="tournament-maxplayers-edit"
                        name="maxPlayers"
                        min="2"
                        value={formData.maxPlayers}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="tournament-date-edit">Datum:</label>
                    <input
                        type="datetime-local"
                        id="tournament-date-edit"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Uppdaterar...' : 'Uppdatera'}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Avbryt
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}
