// src/utils/http.ts
import { API_CONFIG } from '../config/api.config';

class HttpClient {
    private static instance: HttpClient;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    static getInstance(): HttpClient {
        if (!HttpClient.instance) {
            HttpClient.instance = new HttpClient();
        }
        return HttpClient.instance;
    }

    private getHeaders(): HeadersInit {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders()
        });

        if (!response.ok) {
            throw await this.handleError(response);
        }

        return response.json();
    }

    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined
        });

        if (!response.ok) {
            throw await this.handleError(response);
        }

        return response.json();
    }

    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined
        });

        if (!response.ok) {
            throw await this.handleError(response);
        }

        return response.json();
    }

    async delete(endpoint: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });

        if (!response.ok) {
            throw await this.handleError(response);
        }
    }

    private async handleError(response: Response): Promise<Error> {
        const error = await response.json();
        return new Error(error.message || 'API Error');
    }
}

export const httpClient = HttpClient.getInstance();
