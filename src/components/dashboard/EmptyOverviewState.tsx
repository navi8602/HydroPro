import { Sprout, Settings, AlertTriangle } from 'lucide-react';

interface EmptyOverviewStateProps {
  onAddPlant: () => void;
}

export function EmptyOverviewState({ onAddPlant }: EmptyOverviewStateProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-yellow-100 animate-pulse" />
          <div className="relative p-4 bg-white rounded-full">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Система пуста
      </h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Добавьте первое растение, чтобы начать мониторинг системы и получать данные 
        о росте растений и состоянии окружающей среды.
      </p>

      <div className="max-w-lg mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg text-left">
            <Sprout className="h-5 w-5 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Добавьте растения</h4>
            <p className="text-sm text-gray-500 mb-3">
              Выберите растения для выращивания из нашего каталога
            </p>
            <button
              onClick={onAddPlant}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Добавить растение →
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg text-left">
            <Settings className="h-5 w-5 text-gray-500 mb-2" />
            <h4 className="font-medium text-gray-900">Настройте параметры</h4>
            <p className="text-sm text-gray-500">
              Установите оптимальные параметры для выращивания:
            </p>
            <ul className="mt-2 text-sm text-gray-500 space-y-1">
              <li>• Температура и влажность</li>
              <li>• Режим освещения</li>
              <li>• График полива</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Совет:</strong> Начните с неприхотливых растений, таких как салат или 
            базилик, чтобы освоиться с системой.
          </p>
        </div>
      </div>
    </div>
  );
}