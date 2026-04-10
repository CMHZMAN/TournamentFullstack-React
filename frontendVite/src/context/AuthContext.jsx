import { createContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const [isGuest, setIsGuest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load auth state on mount
    useEffect(() => {
        const loadAuthState = () => {
            const user = localStorage.getItem('current_user');
            const roles = localStorage.getItem('user_roles');
            const guestMode = localStorage.getItem('guest_mode');

            if (guestMode === 'true') {
                setIsGuest(true);
                setCurrentUser(null);
                setUserRoles([]);
            } else if (user && apiClient.isAuthenticated()) {
                setCurrentUser(JSON.parse(user));
                setUserRoles(roles ? JSON.parse(roles) : []);
                setIsGuest(false);
            } else {
                setCurrentUser(null);
                setUserRoles([]);
                setIsGuest(false);
                apiClient.removeToken();
            }
            setIsLoading(false);
        };

        loadAuthState();
    }, []);

    const register = useCallback(async (username, email, password) => {
        setError(null);
        try {
            if (!username || !email || !password) {
                throw new Error('Alla fält är obligatoriska');
            }

            const response = await apiClient.register(username, email, password);

            const user = {
                username: response.username,
                email: email,
                userId: response.userId,
                loginTime: new Date().toISOString()
            };

            setCurrentUser(user);
            setUserRoles(response.roles || ['User']);
            setIsGuest(false);
            localStorage.setItem('current_user', JSON.stringify(user));
            localStorage.setItem('user_roles', JSON.stringify(response.roles || ['User']));
            localStorage.removeItem('guest_mode');

            return user;
        } catch (err) {
            const errorMsg = err.message || 'Registrering misslyckades';
            setError(errorMsg);
            throw err;
        }
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
                userId: response.userId,
                loginTime: new Date().toISOString()
            };

            setCurrentUser(user);
            setUserRoles(response.roles || ['User']);
            setIsGuest(false);
            localStorage.setItem('current_user', JSON.stringify(user));
            localStorage.setItem('user_roles', JSON.stringify(response.roles || ['User']));
            localStorage.removeItem('guest_mode');

            return user;
        } catch (err) {
            const errorMsg = err.message || 'Inloggning misslyckades';
            setError(errorMsg);
            throw err;
        }
    }, []);

    const loginAsGuest = useCallback(() => {
        setCurrentUser(null);
        setUserRoles([]);
        setIsGuest(true);
        setIsLoading(false);
        setError(null);
        apiClient.removeToken();
        localStorage.removeItem('current_user');
        localStorage.removeItem('user_roles');
        localStorage.setItem('guest_mode', 'true');
    }, []);

    const logout = useCallback(() => {
        apiClient.removeToken();
        localStorage.removeItem('current_user');
        localStorage.removeItem('user_roles');
        localStorage.removeItem('guest_mode');
        setCurrentUser(null);
        setUserRoles([]);
        setIsGuest(false);
    }, []);

    const hasRole = useCallback((role) => {
        return userRoles.includes(role);
    }, [userRoles]);

    const value = {
        currentUser,
        userRoles,
        isLoading,
        error,
        isGuest,
        register,
        login,
        loginAsGuest,
        logout,
        hasRole,
        isLoggedIn: !!currentUser && apiClient.isAuthenticated(),
        isAdmin: userRoles.includes('Admin'),
        canEdit: !isGuest && (!!currentUser || userRoles.length > 0)
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
