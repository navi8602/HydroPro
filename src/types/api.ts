// src/types/api.ts
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: Record<string, string[]>;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface SystemMetricsRequest {
    temperature?: number;
    humidity?: number;
    nutrientLevel?: number;
    phLevel?: number;
}

export interface AddPlantRequest {
    name: string;
    position: number;
    plantedDate: string;
    expectedHarvestDate: string;
}
