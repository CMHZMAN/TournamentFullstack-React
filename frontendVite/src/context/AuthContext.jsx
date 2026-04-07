import { createContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load auth state on mount
    useEffect(() => {
        const loadAuthState = () => {
            const user = localStorage.getItem('current_user');
            if (user && apiClient.isAuthenticated()) {
                setCurrentUser(JSON.parse(user));
            } else {
                setCurrentUser(null);
                apiClient.removeToken();
            }
            setIsLoading(false);
        };

        loadAuthState();
    }, []);

    const login = useCallback(async (username, password) => {
        setError(null);
        try {
            if (!username || !password) {
                throw new Error('Användarnamn och lösenord är obligatoriska');
            }

            const response = await apiClient.login(username, password);

            const user = {
                username: response.username,
                loginTime: new Date().toISOString()
            };

            setCurrentUser(user);
            localStorage.setItem('current_user', JSON.stringify(user));

            return user;
        } catch (err) {
            const errorMsg = err.message || 'Inloggning misslyckades';
            setError(errorMsg);
            throw err;
        }
    }, []);

    const logout = useCallback(() => {
        apiClient.removeToken();
        localStorage.removeItem('current_user');
        setCurrentUser(null);
    }, []);

    const value = {
        currentUser,
        isLoading,
        error,
        login,
        logout,
        isLoggedIn: !!currentUser && apiClient.isAuthenticated()
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
