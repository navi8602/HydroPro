// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { AuthService } from '../api/services/auth.service';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await AuthService.login(email, password);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        loading,
        login,
        logout
    };
}
