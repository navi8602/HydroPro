import { useState, useEffect } from 'react';
import { MonitoringService } from '../api/services/monitoring.service';

export function useMonitoringData(systemId: string) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MonitoringService.getEnvironmentData(systemId, '24h');
                setData(response.data);
            } catch (err) {
                setError('Failed to load monitoring data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Subscribe to real-time updates
        const unsubscribe = MonitoringService.subscribeToUpdates(
            systemId,
            (newData) => setData(prev => ({ ...prev, ...newData }))
        );

        return () => unsubscribe();
    }, [systemId]);

    return { data, loading, error };
}
