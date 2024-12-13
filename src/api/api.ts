import axios from 'axios';
import { authService } from '../services/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Обработка ошибок авторизации
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const newToken = await authService.refreshToken();
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return api.request(error.config);
            } catch (refreshError) {
                authService.logout();
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);
