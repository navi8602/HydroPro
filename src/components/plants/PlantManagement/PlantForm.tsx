// src/components/plants/PlantManager/PlantForm.tsx
import { useState } from 'react';
import { Plant } from '../../../types/system';
import { Dialog } from '../../ui/Dialog';

interface PlantFormProps {
    plant?: Plant;
    onSubmit: (data: Partial<Plant>) => Promise<void>;
    onClose: () => void;
}

export function PlantForm({ plant, onSubmit, onClose }: PlantFormProps) {
    const [formData, setFormData] = useState({
        name: plant?.name || '',
        position: plant?.position || 1,
        notes: plant?.notes || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        onClose();
    };

    return (
        <Dialog
            title={plant ? 'Редактировать растение' : 'Добавить растение'}
            isOpen={true}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Название
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({
                            ...prev,
                            name: e.target.value
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Позиция
                    </label>
                    <input
                        type="number"
                        value={formData.position}
                        onChange={e => setFormData(prev => ({
                            ...prev,
                            position: parseInt(e.target.value)
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300"
                        required
                        min={1}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Заметки
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={e => setFormData(prev => ({
                            ...prev,
                            notes: e.target.value
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300"
                        rows={3}
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        {plant ? 'Сохранить' : 'Добавить'}
                    </button>
                </div>
            </form>
        </Dialog>
    );
}
