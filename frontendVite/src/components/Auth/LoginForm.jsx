import { useState } from 'react';

export function LoginForm({ onSubmit, error, onSwitchToRegister, onGuestMode }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit({ username, password });
            setUsername('');
            setPassword('');
        } catch (err) {
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Användarnamn:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Lösenord:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%' }}>
                    {isLoading ? 'Loggar in...' : 'Logga in'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>

            <div style={{ margin: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                eller
            </div>

            <button 
                onClick={onGuestMode}
                className="btn btn-secondary" 
                style={{ width: '100%', marginBottom: '15px' }}
                disabled={isLoading}
            >
                Gäst-läge
            </button>

            <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
                Saknar du konto?{' '}
                <button
                    onClick={onSwitchToRegister}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-color)',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '14px',
                        padding: 0
                    }}
                >
                    Registrera dig här
                </button>
            </p>
        </>
    );
}
