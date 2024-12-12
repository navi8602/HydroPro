import { PowerIcon, Sprout, Settings } from 'lucide-react';

interface EmptySystemStateProps {
  onActivate: () => void;
}

export function EmptySystemState({ onActivate }: EmptySystemStateProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-red-100 animate-pulse" />
          <div className="relative p-4 bg-white rounded-full">
            <PowerIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Система не активирована
      </h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Для начала работы необходимо добавить хотя бы одно растение. 
        После этого система будет активирована автоматически.
      </p>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg text-left">
            <Sprout className="h-5 w-5 text-gray-400 mb-2" />
            <h4 className="font-medium text-gray-900">Добавьте растения</h4>
            <p className="text-sm text-gray-500">
              Выберите растения для выращивания из каталога
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-left">
            <Settings className="h-5 w-5 text-gray-400 mb-2" />
            <h4 className="font-medium text-gray-900">Настройте систему</h4>
            <p className="text-sm text-gray-500">
              Установите параметры работы под ваши растения
            </p>
          </div>
        </div>

        <button
          onClick={onActivate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg 
                   hover:bg-indigo-700 transition-colors"
        >
          Активировать систему
        </button>
      </div>
    </div>
  );
}