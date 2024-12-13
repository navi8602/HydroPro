// src/hooks/useMutation.ts
import { useState } from 'react';
import { Cache } from '../utils/cache';

export function useMutation<T, R>(
    mutationFn: (data: T) => Promise<R>,
    options: {
        onSuccess?: (data: R) => void;
        onError?: (error: Error) => void;
        optimisticUpdate?: (data: T) => void;
    } = {}
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = async (data: T) => {
        try {
            setLoading(true);
            setError(null);

            if (options.optimisticUpdate) {
                options.optimisticUpdate(data);
            }

            const result = await mutationFn(data);

            if (options.onSuccess) {
                options.onSuccess(result);
            }

            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unknown error');
            setError(error);

            if (options.onError) {
                options.onError(error);
            }

            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        mutate,
        loading,
        error
    };
}
