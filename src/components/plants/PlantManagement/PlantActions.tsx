// src/components/plants/PlantManager/PlantActions.tsx
import { Plant } from '../../../types/system';
import { IconButton } from '../../ui/IconButton';

interface PlantActionsProps {
    plant: Plant;
    onEdit: () => void;
    onDelete: () => void;
}

export function PlantActions({ plant, onEdit, onDelete }: PlantActionsProps) {
    return (
        <div className="flex justify-end space-x-2 mt-4">
            <IconButton
                icon="edit"
                onClick={onEdit}
                variant="secondary"
                size="sm"
            />
            <IconButton
                icon="trash"
                onClick={onDelete}
                variant="danger"
                size="sm"
            />
        </div>
    );
}
