// src/hooks/useSystems.ts
import { useState, useEffect } from 'react';
import { SystemService } from '../api/services/system.service';
import type { RentedSystem } from '../types/system';

export function useSystems() {
    const [systems, setSystems] = useState<RentedSystem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSystems = async () => {
        try {
            setLoading(true);
            const { data } = await SystemService.getRentedSystems();
            setSystems(data);
        } catch (err) {
            setError('Failed to load systems');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSystems();
    }, []);

    const rentSystem = async (systemId: string, months: number) => {
        try {
            const { data } = await SystemService.rentSystem(systemId, months);
            setSystems(prev => [...prev, data]);
            return data;
        } catch (err) {
            throw new Error('Failed to rent system');
        }
    };

    const updateSystemMetrics = async (systemId: string, metrics: SystemMetrics) => {
        try {
            const { data } = await SystemService.updateMetrics(systemId, metrics);
            setSystems(prev => prev.map(s =>
                s.id === systemId ? { ...s, metrics: data } : s
            ));
            return data;
        } catch (err) {
            throw new Error('Failed to update metrics');
        }
    };

    return {
        systems,
        loading,
        error,
        rentSystem,
        updateSystemMetrics,
        refreshSystems: fetchSystems
    };
}
