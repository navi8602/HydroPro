import { useEffect, useState } from 'react';
import { PlantService } from '../../api/services/plant.service';
import { PlantCard } from './PlantCard';
import { EmptyPlantState } from './EmptyPlantState';
import type { Plant } from '../../types/plant';

interface PlantListProps {
    systemId: string;
    onAddPlant?: () => void;
}

export function PlantList({ systemId, onAddPlant }: PlantListProps) {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const response = await PlantService.getSystemPlants(systemId);
                setPlants(response.data);
            } catch (error) {
                console.error('Failed to fetch plants:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlants();
    }, [systemId]);

    if (loading) return <PlantListLoader />;
    if (plants.length === 0) {
        return <EmptyPlantState onAddPlant={onAddPlant} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plants.map(plant => (
                <PlantCard
                    key={plant.id}
                    plantId={plant.id}
                    onStatusChange={(status) => {
                        // Обновляем статус растения локально
                        setPlants(prev =>
                            prev.map(p =>
                                p.id === plant.id ? { ...p, status } : p
                            )
                        );
                    }}
                />
            ))}
        </div>
    );
}

function PlantListLoader() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-lg" />
                    <div className="bg-white p-4 rounded-b-lg border border-gray-200">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                        <div className="space-y-3">
                            <div className="h-2 bg-gray-200 rounded" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-4 bg-gray-200 rounded" />
                                <div className="h-4 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
