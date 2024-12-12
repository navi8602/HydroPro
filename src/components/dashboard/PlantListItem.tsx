import { useState } from 'react';
import { Plant } from '../../types/system';
import { PLANTS } from '../../data/plants';
import { getPlantStatus, calculateGrowthProgress } from '../../utils/plants';
import { formatDate } from '../../utils/date';
import { 
  Leaf, Calendar, AlertTriangle, Trash2, 
  Droplets, Thermometer, Info 
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { PlantProgressBar } from './PlantProgressBar';
import { DeletePlantDialog } from '../plants/DeletePlantDialog';

interface PlantListItemProps {
  plant: Plant;
  onRemove?: (plantId: string) => void;
}

export function PlantListItem({ plant, onRemove }: PlantListItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const plantType = PLANTS.find(p => p.name === plant.name);
  if (!plantType) return null;

  const status = getPlantStatus(plant.plantedDate, plant.expectedHarvestDate);
  const progress = calculateGrowthProgress(plant.plantedDate, plant.expectedHarvestDate);

  const getStatusInfo = () => {
    switch (status) {
      case 'healthy':
        return { label: 'Здоровое', variant: 'success' as const };
      case 'warning':
        return { label: 'Требует внимания', variant: 'warning' as const };
      case 'critical':
        return { label: 'Критическое', variant: 'error' as const };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
        {/* Существующий код карточки растения */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            {plantType.imageUrl ? (
              <img 
                src={plantType.imageUrl} 
                alt={plant.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Leaf className="h-5 w-5 text-indigo-600" />
              </div>
            )}
            <div>
              <h4 className="font-medium">{plant.name}</h4>
              <p className="text-sm text-gray-500">Позиция {plant.position}</p>
            </div>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        <PlantProgressBar progress={progress} status={status} />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Посажено: {formatDate(plant.plantedDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Сбор: {formatDate(plant.expectedHarvestDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Thermometer className="h-4 w-4 mr-2" />
            <span>{plantType.optimalTemp.min}-{plantType.optimalTemp.max}°C</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Droplets className="h-4 w-4 mr-2" />
            <span>{plantType.optimalHumidity.min}-{plantType.optimalHumidity.max}%</span>
          </div>
        </div>

        {status !== 'healthy' && (
          <div className="mt-3 flex items-start space-x-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <div>
              <p className="font-medium">
                {status === 'warning' 
                  ? 'Приближается время сбора урожая'
                  : 'Срочно требуется сбор урожая!'}
              </p>
              <p className="text-sm mt-1">
                {status === 'warning'
                  ? 'Рекомендуется подготовиться к сбору урожая в ближайшие дни.'
                  : 'Превышение оптимального времени сбора может привести к ухудшению качества.'}
              </p>
            </div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Info className="h-4 w-4 mr-1" />
            <span>
              {plantType.difficulty === 'easy' ? 'Простое выращивание' :
               plantType.difficulty === 'medium' ? 'Средняя сложность' :
               'Требует опыта'}
            </span>
          </div>
          {onRemove && (
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center text-sm text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Удалить
            </button>
          )}
        </div>
      </div>

      {showDeleteDialog && (
        <DeletePlantDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => onRemove?.(plant.id)}
          plant={plant}
        />
      )}
    </>
  );
}