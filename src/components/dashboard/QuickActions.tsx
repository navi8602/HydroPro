import { 
  Leaf, Droplets, Sun, Thermometer, 
  RefreshCw, AlertTriangle 
} from 'lucide-react';

interface QuickActionProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionProps) {
  const actions = [
    {
      id: 'light',
      name: 'Освещение',
      icon: Sun,
      value: 'Включено',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'watering',
      name: 'Полив',
      icon: Droplets,
      value: 'Авто',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'ventilation',
      name: 'Вентиляция',
      icon: RefreshCw,
      value: '50%',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'temperature',
      name: 'Температура',
      icon: Thermometer,
      value: '23°C',
      color: 'bg-red-100 text-red-800'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map(({ id, name, icon: Icon, value, color }) => (
        <button
          key={id}
          onClick={() => onAction(id)}
          className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 
                   bg-white transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-sm text-gray-500">{value}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}