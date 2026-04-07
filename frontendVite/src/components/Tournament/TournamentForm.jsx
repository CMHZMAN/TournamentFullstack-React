import { useState } from 'react';

export function TournamentForm({ onSubmit, onCancel, error }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        maxPlayers: 2,
        date: ''
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
            setFormData({
                title: '',
                description: '',
                maxPlayers: 2,
                date: ''
            });
        } catch (err) {
            console.error('Form error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="tournament-form-sidebar" onSubmit={handleSubmit}>
            <h3>Lägg till ny turnering</h3>
            <div className="form-group">
                <label htmlFor="tournament-title">Namn:</label>
                <input
                    type="text"
                    id="tournament-title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="tournament-description">Beskrivning:</label>
                <input
                    type="text"
                    id="tournament-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="tournament-maxplayers">Max spelare:</label>
                <input
                    type="number"
                    id="tournament-maxplayers"
                    name="maxPlayers"
                    min="2"
                    value={formData.maxPlayers}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="tournament-date">Datum:</label>
                <input
                    type="datetime-local"
                    id="tournament-date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Sparar...' : 'Spara'}
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
