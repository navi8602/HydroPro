import { PlantType } from '../../types/plants';
import { PLANTS } from '../../data/plants';
import { PLANT_CATEGORIES } from '../../data/plants';
import { 
  Thermometer, Droplets, Clock, 
  AlertTriangle, CheckCircle2, Info 
} from 'lucide-react';

interface PlantCatalogProps {
  plants: PlantType[];
  onSelectPlant: (plant: PlantType) => void;
}

export function PlantCatalog({ plants, onSelectPlant }: PlantCatalogProps) {
  if (plants.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Растения не найдены
        </h3>
        <p className="text-gray-500">
          Попробуйте изменить параметры поиска или фильтры
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {plants.map(plant => (
        <div
          key={plant.id}
          className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 
                   transition-all cursor-pointer"
          onClick={() => onSelectPlant(plant)}
        >
          <div className="relative">
            <img
              src={plant.imageUrl}
              alt={plant.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <span className={`
              absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium
              ${plant.difficulty === 'easy' 
                ? 'bg-green-100 text-green-800' 
                : plant.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'}
            `}>
              {plant.difficulty === 'easy' ? 'Легко' :
               plant.difficulty === 'medium' ? 'Средне' : 'Сложно'}
            </span>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-lg">{plant.name}</h3>
                <p className="text-sm text-gray-500">
                  {PLANT_CATEGORIES[plant.category as keyof typeof PLANT_CATEGORIES]}
                </p>
              </div>
              <span className="text-sm font-medium text-indigo-600">
                {plant.spacing} {plant.spacing === 1 ? 'позиция' : 'позиции'}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {plant.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {plant.growthDays} дней
              </div>
              <div className="flex items-center text-gray-600">
                <Thermometer className="h-4 w-4 mr-2" />
                {plant.optimalTemp.min}-{plant.optimalTemp.max}°C
              </div>
              <div className="flex items-center text-gray-600">
                <Droplets className="h-4 w-4 mr-2" />
                {plant.optimalHumidity.min}-{plant.optimalHumidity.max}%
              </div>
              <div className="flex items-center text-gray-600">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {plant.maxQuantity} макс.
              </div>
            </div>

            {plant.companionPlants.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">
                  Совместимые растения:
                </p>
                <div className="flex flex-wrap gap-1">
                  {plant.companionPlants.map(id => {
                    const companion = PLANTS.find(p => p.id === id);
                    return companion ? (
                      <span
                        key={id}
                        className="px-2 py-0.5 bg-green-100 text-green-800 
                                 rounded-full text-xs"
                      >
                        {companion.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}