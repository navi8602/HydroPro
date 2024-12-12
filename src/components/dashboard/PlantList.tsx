import { Plant } from '../../types/system';
import { PlantListItem } from './PlantListItem';
import { Plus } from 'lucide-react';
import { getEmptySlots } from '../../utils/plants';
import { PlantStats } from './PlantStats';

interface PlantListProps {
  plants: Plant[];
  capacity: number;
  onAddPlant?: () => void;
  onRemovePlant?: (plantId: string) => void;
}

export function PlantList({ 
  plants, 
  capacity, 
  onAddPlant,
  onRemovePlant 
}: PlantListProps) {
  const emptySlots = getEmptySlots(plants, capacity);
  const healthyPlantsCount = plants.filter(p => p.status === 'healthy').length;
  const warningPlantsCount = plants.filter(p => p.status === 'warning').length;
  const criticalPlantsCount = plants.filter(p => p.status === 'critical').length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Растения в системе</h3>
          <p className="text-sm text-gray-500">
            Занято позиций: {capacity - emptySlots} из {capacity}
          </p>
        </div>
        {emptySlots > 0 && onAddPlant && (
          <button
            onClick={onAddPlant}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-white 
                     bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Добавить
          </button>
        )}
      </div>

      <PlantStats
        total={plants.length}
        healthy={healthyPlantsCount}
        warning={warningPlantsCount}
        critical={criticalPlantsCount}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {plants.map((plant) => (
          <PlantListItem
            key={plant.id}
            plant={plant}
            onRemove={onRemovePlant}
          />
        ))}
      </div>
    </div>
  );
}