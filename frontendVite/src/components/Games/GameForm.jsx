import { useState, useMemo } from 'react';

export function GameForm({ onSubmit, onCancel, error }) {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        hour: '',
        minute: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const hours = useMemo(() => {
        return Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    }, []);

    const minutes = ['00', '15', '30', '45'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const dateTime = new Date(`${formData.date}T${formData.hour}:${formData.minute}:00`);
            await onSubmit({
                title: formData.title,
                time: dateTime.toISOString()
            });
            setFormData({
                title: '',
                date: '',
                hour: '',
                minute: ''
            });
        } catch (err) {
            console.error('Form error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="game-form-inline" onSubmit={handleSubmit}>
            <h4>Lägg till nytt spel</h4>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="game-form-title">Spel namn:</label>
                    <input
                        type="text"
                        id="game-form-title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="game-form-date">Datum:</label>
                    <input
                        type="date"
                        id="game-form-date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="game-form-hour">Timme:</label>
                    <select
                        id="game-form-hour"
                        name="hour"
                        value={formData.hour}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    >
                        <option value="">-- Välj timme --</option>
                        {hours.map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="game-form-minute">Minut:</label>
                    <select
                        id="game-form-minute"
                        name="minute"
                        value={formData.minute}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    >
                        <option value="">-- Välj minut --</option>
                        {minutes.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
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
            {error && <div className="error-message">{error}</div>}
        </form>
    );
}
