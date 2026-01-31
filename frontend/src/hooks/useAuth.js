import { useState, useEffect } from 'react';

// Simple admin password for local development
const ADMIN_PASSWORD = '786';

export const useAuth = () => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        username: null,
        token: null,
    });

    useEffect(() => {
        // Check for existing auth on mount
        const isAuth = localStorage.getItem('admin_authenticated');
        const username = localStorage.getItem('admin_username');

        if (isAuth === 'true') {
            setAuthState({
                isAuthenticated: true,
                username: username || 'admin',
                token: 'local-auth',
            });
        }
    }, []);

    const login = async (password) => {
        try {
            // Simple password check for local development
            if (password === ADMIN_PASSWORD) {
                localStorage.setItem('admin_authenticated', 'true');
                localStorage.setItem('admin_username', 'admin');

                setAuthState({
                    isAuthenticated: true,
                    username: 'admin',
                    token: 'local-auth',
                });

                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (username, password, email) => {
        // Not used in simple auth mode
        return { success: false, error: 'Registration not available' };
    };

    const logout = () => {
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_username');
        localStorage.removeItem('admin_token');
        setAuthState({
            isAuthenticated: false,
            username: null,
            token: null,
        });
    };

    const getToken = () => {
        return authState.token || localStorage.getItem('admin_token');
    };

    return {
        ...authState,
        login,
        register,
        logout,
        getToken,
    };
};
