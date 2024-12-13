import { api } from '../api';
import { User } from '../../types/user';

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export const AuthService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>('/auth/login', {
            email,
            password
        });
        return data;
    },

    async register(userData: RegisterData): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>('/auth/register', userData);
        return data;
    },

    async verifySms(phone: string, code: string): Promise<boolean> {
        const { data } = await api.post<{ success: boolean }>('/auth/verify-sms', {
            phone,
            code
        });
        return data.success;
    },

    async refreshToken(): Promise<string> {
        const { data } = await api.post<{ token: string }>('/auth/refresh');
        return data.token;
    },

    async getCurrentUser(): Promise<User> {
        const { data } = await api.get<User>('/users/me');
        return data;
    }
};
