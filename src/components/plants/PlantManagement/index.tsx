// src/components/plants/PlantManager/index.tsx
import { useState } from 'react';
import { usePlants } from '../../../hooks/usePlants';
import { PlantList } from './PlantList';
import { PlantForm } from './PlantForm';
import { LoadingState } from '../../common/LoadingState';
import { ErrorMessage } from '../../common/ErrorMessage';

interface PlantManagerProps {
    systemId: string;
}

export function PlantManager({ systemId }: PlantManagerProps) {
    const [isAddingPlant, setIsAddingPlant] = useState(false);
    const { plants, loading, error, addPlant, updatePlant, deletePlant } = usePlants(systemId);

    if (loading) return <LoadingState />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Управление растениями</h2>
                <button
                    onClick={() => setIsAddingPlant(true)}
                    className="btn-primary"
                >
                    Добавить растение
                </button>
            </div>

            <PlantList
                plants={plants}
                onUpdate={updatePlant}
                onDelete={deletePlant}
            />

            {isAddingPlant && (
                <PlantForm
                    onSubmit={addPlant}
                    onClose={() => setIsAddingPlant(false)}
                />
            )}
        </div>
    );
}
