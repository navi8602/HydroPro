// src/hooks/usePlantGrowth.ts
import { useState, useEffect } from 'react';
import { PlantService } from '../api/services/plant.service';
import type { PlantGrowthData } from '../types/monitoring';

export function usePlantGrowth(plantId: string) {
    const [growthData, setGrowthData] = useState<PlantGrowthData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrowthData = async () => {
            try {
                const { data } = await PlantService.getGrowthData(plantId);
                setGrowthData(data);
            } catch (error) {
                console.error('Failed to load growth data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGrowthData();
    }, [plantId]);

    const addGrowthRecord = async (record: Omit<PlantGrowthData, 'timestamp'>) => {
        try {
            const { data } = await PlantService.addGrowthRecord(plantId, record);
            setGrowthData(prev => [...prev, data]);
            return data;
        } catch (error) {
            throw new Error('Failed to add growth record');
        }
    };

    return { growthData, loading, addGrowthRecord };
}
