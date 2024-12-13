// src/components/plants/PlantManager/PlantCard.tsx
import { useState } from 'react';
import { Plant } from '../../../types/system';
import { formatDate } from '../../../utils/date';
import { PlantStatusBadge } from './PlantStatusBadge';
import { PlantActions } from './PlantActions';

interface PlantCardProps {
    plant: Plant;
    onUpdate: (id: string, data: Partial<Plant>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function PlantCard({ plant, onUpdate, onDelete }: PlantCardProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-medium">{plant.name}</h3>
                    <p className="text-sm text-gray-500">
                        Позиция: {plant.position}
                    </p>
                </div>
                <PlantStatusBadge status={plant.status} />
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Посажено:</span>
                    <span>{formatDate(plant.plantedDate)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Сбор урожая:</span>
                    <span>{formatDate(plant.expectedHarvestDate)}</span>
                </div>
            </div>

            <PlantActions
                plant={plant}
                onEdit={() => setIsEditing(true)}
                onDelete={() => onDelete(plant.id)}
            />
        </div>
    );
}
