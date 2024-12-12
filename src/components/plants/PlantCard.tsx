import { PlantType } from '../../types/plants';
import { PLANT_CATEGORIES } from '../../data/plants';
import { 
  Sprout, Thermometer, Droplets, Clock, 
  AlertTriangle, CheckCircle, Info 
} from 'lucide-react';

interface PlantCardProps {
  plant: PlantType;
  isSelected: boolean;
  onSelect: () => void;
  isCompatible: boolean;
  currentQuantity: number;
  remainingSpace: number;
}

export function PlantCard({ 
  plant, 
  isSelected, 
  onSelect, 
  isCompatible,
  currentQuantity,
  remainingSpace 
}: PlantCardProps) {
  const getStatusMessage = (): { message: string; type: 'warning' | 'error' | 'info' } | null => {
    if (!isCompatible) {
      if (plant.maxQuantity && currentQuantity >= plant.maxQuantity) {
        return {
          message: `Достигнут лимит (${plant.maxQuantity} растений)`,
          type: 'error'
        };
      }
      if (remainingSpace < plant.spacing) {
        return {
          message: `Требуется ${plant.spacing} позиций, доступно ${remainingSpace}`,
          type: 'error'
        };
      }
      return {
        message: 'Несовместимо с текущими растениями',
        type: 'error'
      };
    }
    if (plant.maxQuantity && currentQuantity + 1 === plant.maxQuantity) {
      return {
        message: 'Осталось место для 1 растения',
        type: 'warning'
      };
    }
    return null;
  };

  const status = getStatusMessage();
  const statusIcon = status?.type === 'error' ? AlertTriangle :
                    status?.type === 'warning' ? Info :
                    CheckCircle;

  return (
    <div
      className={`
        p-4 rounded-lg border-2 transition-all
        ${!isCompatible ? 'opacity-50 cursor-not-allowed' :
          isSelected ? 'border-indigo-500 bg-indigo-50' : 
          'border-gray-200 hover:border-gray-300 cursor-pointer'}
      `}
      onClick={() => isCompatible && onSelect()}
    >
      <div className="flex gap-4">
        {plant.imageUrl && (
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-24 h-24 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-medium text-lg">{plant.name}</h4>
              <span className="text-sm text-gray-500">
                {PLANT_CATEGORIES[plant.category]}
              </span>
            </div>
            <span className={`
              text-sm font-medium px-3 py-1 rounded-full
              ${plant.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                plant.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'}
            `}>
              {plant.difficulty === 'easy' ? 'Легко' :
               plant.difficulty === 'medium' ? 'Средне' : 'Сложно'}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3">
            {plant.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {plant.growthDays} дней до урожая
            </div>
            <div className="flex items-center text-gray-600">
              <Sprout className="h-4 w-4 mr-2" />
              {plant.spacing} {plant.spacing === 1 ? 'позиция' : 'позиции'}
            </div>
            <div className="flex items-center text-gray-600">
              <Thermometer className="h-4 w-4 mr-2" />
              {plant.optimalTemp.min}-{plant.optimalTemp.max}°C
            </div>
            <div className="flex items-center text-gray-600">
              <Droplets className="h-4 w-4 mr-2" />
              {plant.optimalHumidity.min}-{plant.optimalHumidity.max}%
            </div>
          </div>

          {status && (
            <div className={`
              mt-3 flex items-center space-x-2 text-sm p-2 rounded
              ${status.type === 'error' ? 'bg-red-50 text-red-700' :
                status.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                'bg-blue-50 text-blue-700'}
            `}>
              {statusIcon && <statusIcon className="h-4 w-4" />}
              <span>{status.message}</span>
            </div>
          )}

          {plant.maxQuantity && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Количество растений</span>
                <span>{currentQuantity}/{plant.maxQuantity}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    currentQuantity >= plant.maxQuantity
                      ? 'bg-red-500'
                      : currentQuantity >= plant.maxQuantity * 0.8
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${(currentQuantity / plant.maxQuantity) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}