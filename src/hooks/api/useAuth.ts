// src/hooks/api/useAuth.ts
import { useState } from 'react';
import { AuthService } from '../../api/services/auth.service';
import { useNotifications } from '../../contexts/NotificationContext';

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotifications();

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const { data } = await AuthService.login(email, password);
            localStorage.setItem('token', data.token);
            return data.user;
        } catch (error) {
            addNotification({
                title: 'Ошибка входа',
                message: 'Неверный email или пароль',
                type: 'error'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        loading
    };
}
