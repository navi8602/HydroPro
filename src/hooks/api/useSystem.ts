// src/hooks/api/useSystem.ts
import { useState, useEffect } from 'react';
import { SystemsService } from '../../api/services/systems.service';
import { MonitoringService } from '../../api/services/monitoring.service';
import type { RentedSystem } from '../../types/system';

export function useSystem(systemId: string) {
    const [system, setSystem] = useState<RentedSystem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSystem = async () => {
            try {
                const { data: systems } = await SystemsService.getRentedSystems();
                const currentSystem = systems.find(s => s.id === systemId);
                if (currentSystem) {
                    setSystem(currentSystem);
                }
            } catch (error) {
                console.error('Error fetching system:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSystem();

        // Подписываемся на обновления системы
        const unsubscribe = MonitoringService.subscribeToUpdates(
            systemId,
            (updatedSystem) => {
                setSystem(prev => ({ ...prev, ...updatedSystem }));
            }
        );

        return () => {
            unsubscribe();
        };
    }, [systemId]);

    return {
        system,
        loading
    };
}
