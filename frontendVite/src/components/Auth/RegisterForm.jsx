import { useState } from 'react';

export function RegisterForm({ onSubmit, error, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Validate
        if (!formData.username || !formData.email || !formData.password) {
            setFormError('Alla fält är obligatoriska');
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            setFormError('Lösenorden matchar inte');
            return;
        }

        if (formData.password.length < 6) {
            setFormError('Lösenord måste vara minst 6 tecken');
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="register-username">Användarnamn:</label>
                <input
                    type="text"
                    id="register-username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    minLength="3"
                />
            </div>
            <div className="form-group">
                <label htmlFor="register-email">E-post:</label>
                <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="register-password">Lösenord:</label>
                <input
                    type="password"
                    id="register-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    minLength="6"
                />
            </div>
            <div className="form-group">
                <label htmlFor="register-password-confirm">Bekräfta lösenord:</label>
                <input
                    type="password"
                    id="register-password-confirm"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    minLength="6"
                />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Registrerar...' : 'Registrera'}
            </button>
            {error && <p className="error-message">{error}</p>}
            {formError && <p className="error-message">{formError}</p>}
            <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
                Har du redan ett konto?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--secondary-color)',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '14px',
                        padding: 0
                    }}
                >
                    Logga in här
                </button>
            </p>
        </form>
    );
}
