// src/components/plants/AddPlantForm/index.tsx
import { useState } from 'react';
import { PlantTypeSelect } from './PlantTypeSelect';
import { PositionSelect } from './PositionSelect';
import { PlantDetails } from './PlantDetails';
import type { Plant, PlantType } from '../../../types/plant';

interface AddPlantFormProps {
    systemId: string;
    onAdd: (plant: Partial<Plant>) => Promise<void>;
    onCancel: () => void;
    availablePositions: number[];
}

export function AddPlantForm({
                                 systemId,
                                 onAdd,
                                 onCancel,
                                 availablePositions
                             }: AddPlantFormProps) {
    const [selectedType, setSelectedType] = useState<PlantType | null>(null);
    const [position, setPosition] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedType || !position) return;

        try {
            setLoading(true);
            await onAdd({
                systemId,
                typeId: selectedType.id,
                position,
                plantedDate: new Date().toISOString()
            });
            onCancel();
        } catch (err) {
            console.error('Failed to add plant:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PlantTypeSelect
                value={selectedType}
                onChange={setSelectedType}
            />

            {selectedType && (
                <>
                    <PlantDetails plant={selectedType} />

                    <PositionSelect
                        value={position}
                        onChange={setPosition}
                        availablePositions={availablePositions}
                    />
                </>
            )}

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white
                   border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    disabled={!selectedType || !position || loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600
                   border border-transparent rounded-md hover:bg-indigo-700
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {loading ? 'Добавление...' : 'Добавить растение'}
                </button>
            </div>
        </form>
    );
}
