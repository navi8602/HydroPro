import { HydroponicSystem } from '../../types/system';
import { 
  Zap, Droplets, Lightbulb, Ruler, ChevronRight,
  Box, Leaf, Cpu, Gauge, Sprout 
} from 'lucide-react';

interface SystemCardProps {
  system: HydroponicSystem;
  onSelect?: () => void;
}

export function SystemCard({ system, onSelect }: SystemCardProps) {
  return (
    <div 
      className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg 
                 transition-shadow cursor-pointer border border-gray-200"
      onClick={onSelect}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{system.name}</h3>
            <p className="text-sm text-gray-500">{system.model}</p>
          </div>
          <span className="text-lg font-bold text-indigo-600">
            {system.monthlyPrice} ₽/мес
          </span>
        </div>

        <p className="text-gray-600 mb-6">{system.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Box className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {system.capacity} позиций
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Ruler className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {system.dimensions.width}×{system.dimensions.depth} см
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {system.specifications.powerConsumption}W
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {system.specifications.waterCapacity}L
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Уровень автоматизации:</span>
            <span className="font-medium">
              {system.specifications.automationLevel === 'basic' ? 'Базовый' :
               system.specifications.automationLevel === 'advanced' ? 'Продвинутый' :
               'Профессиональный'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Тип освещения:</span>
            <span className="font-medium">{system.specifications.lightingType}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {system.features.map((feature, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
            >
              {feature}
            </span>
          ))}
        </div>

        <button
          onClick={onSelect}
          className="mt-6 w-full flex items-center justify-center px-4 py-2 
                   bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                   transition-colors"
        >
          Арендовать систему
          <ChevronRight className="h-5 w-5 ml-2" />
        </button>
      </div>

      <div className="absolute -right-4 -bottom-4">
        <Sprout className="h-8 w-8 text-green-500" />
      </div>
    </div>
  );
}