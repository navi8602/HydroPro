// src/hooks/useSystem.ts
import { useState, useEffect } from 'react';
import { SystemService } from '../api/services/system.service';
import type { RentedSystem, SystemMetrics } from '../types/system';

export function useSystem(systemId: string) {
    const [system, setSystem] = useState<RentedSystem | null>(null);
    const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSystem = async () => {
        try {
            setLoading(true);
            const [systemData, metricsData] = await Promise.all([
                SystemService.getSystem(systemId),
                SystemService.getSystemMetrics(systemId)
            ]);

            setSystem(systemData.data);
            setMetrics(metricsData.data);
        } catch (err) {
            setError('Failed to load system data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSystem();
    }, [systemId]);

    const updateMetrics = async (data: Partial<SystemMetrics>) => {
        try {
            const { data: updatedMetrics } = await SystemService.updateSystemMetrics(systemId, data);
            setMetrics(updatedMetrics);
            return updatedMetrics;
        } catch (err) {
            throw new Error('Failed to update metrics');
        }
    };

    return {
        system,
        metrics,
        loading,
        error,
        updateMetrics,
        refresh: fetchSystem
    };
}
