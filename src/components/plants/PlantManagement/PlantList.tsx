// src/components/plants/PlantManager/PlantList.tsx
import { Plant } from '../../../types/system';
import { PlantCard } from './PlantCard';

interface PlantListProps {
    plants: Plant[];
    onUpdate: (id: string, data: Partial<Plant>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function PlantList({ plants, onUpdate, onDelete }: PlantListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plants.map(plant => (
                <PlantCard
                    key={plant.id}
                    plant={plant}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
