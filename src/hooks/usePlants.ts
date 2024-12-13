import { useState, useEffect } from 'react';
import { PlantService } from '../api/services/plant.service';
import type { Plant } from '../types/system';

export function usePlants(systemId: string) {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                setLoading(true);
                const response = await PlantService.getPlants(systemId);
                setPlants(response.data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch plants'));
            } finally {
                setLoading(false);
            }
        };

        fetchPlants();
    }, [systemId]);

    const addPlant = async (plantData: Partial<Plant>) => {
        const response = await PlantService.addPlant(systemId, plantData);
        setPlants(prev => [...prev, response.data]);
        return response.data;
    };

    const updatePlant = async (plantId: string, data: Partial<Plant>) => {
        const response = await PlantService.updatePlant(plantId, data);
        setPlants(prev => prev.map(p => p.id === plantId ? response.data : p));
        return response.data;
    };

    const deletePlant = async (plantId: string) => {
        await PlantService.deletePlant(plantId);
        setPlants(prev => prev.filter(p => p.id !== plantId));
    };

    return {
        plants,
        loading,
        error,
        addPlant,
        updatePlant,
        deletePlant
    };
}
