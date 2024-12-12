import { Dialog } from '../ui/Dialog';
import { Plant } from '../../types/system';
import { PLANTS } from '../../data/plants';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { calculateGrowthProgress } from '../../utils/plants';

interface DeletePlantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  plant: Plant;
}

export function DeletePlantDialog({
  isOpen,
  onClose,
  onConfirm,
  plant
}: DeletePlantDialogProps) {
  const plantType = PLANTS.find(p => p.name === plant.name);
  if (!plantType) return null;

  const progress = calculateGrowthProgress(plant.plantedDate, plant.expectedHarvestDate);
  const isNearHarvest = progress >= 75;

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title="Подтверждение удаления растения"
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">
              Вы уверены, что хотите удалить это растение?
            </p>
            <p className="mt-1 text-sm text-red-700">
              Это действие нельзя будет отменить. Вся информация о растении,
              включая историю ухода и статистику, будет удалена.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Информация о растении:</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-600">Название:</span>{' '}
              <span className="font-medium">{plant.name}</span>
            </p>
            <p>
              <span className="text-gray-600">Позиция:</span>{' '}
              <span className="font-medium">{plant.position}</span>
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                <span>Посажено: {formatDate(plant.plantedDate)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span>Прогресс: {Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>

        {isNearHarvest && (
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">
                Внимание: растение близко к сбору урожая
              </p>
              <p className="mt-1 text-sm text-yellow-700">
                Рекомендуется дождаться сбора урожая перед удалением растения.
                Ожидаемая дата сбора: {formatDate(plant.expectedHarvestDate)}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white 
                     border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 
                     border border-transparent rounded-md hover:bg-red-700"
          >
            Удалить растение
          </button>
        </div>
      </div>
    </Dialog>
  );
}