// src/config/api.config.ts
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    wsURL: import.meta.env.VITE_WS_URL || 'ws://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
};
