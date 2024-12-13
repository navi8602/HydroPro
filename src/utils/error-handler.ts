// src/utils/error-handler.ts
export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export function handleApiError(error: any) {
    if (error.response) {
        throw new ApiError(
            error.response.status,
            error.response.data.message || 'Произошла ошибка',
            error.response.data
        );
    }
    throw new ApiError(500, 'Сервер недоступен');
}
