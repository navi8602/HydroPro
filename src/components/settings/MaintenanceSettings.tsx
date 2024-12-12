import { useState } from 'react';
import { Switch } from '../ui/Switch';
import { Wrench, Calendar, Bell, RefreshCw } from 'lucide-react';

interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  interval: string;
  lastPerformed: string;
  nextDue: string;
}

const MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    id: 'filter',
    name: 'Замена фильтров',
    description: 'Очистка и замена водяных фильтров',
    interval: '3 месяца',
    lastPerformed: '2024-01-15',
    nextDue: '2024-04-15'
  },
  {
    id: 'cleaning',
    name: 'Общая очистка',
    description: 'Очистка системы и проверка компонентов',
    interval: '1 месяц',
    lastPerformed: '2024-03-01',
    nextDue: '2024-04-01'
  },
  {
    id: 'calibration',
    name: 'Калибровка датчиков',
    description: 'Проверка и калибровка всех датчиков',
    interval: '6 месяцев',
    lastPerformed: '2024-01-01',
    nextDue: '2024-07-01'
  }
];

export function MaintenanceSettings() {
  const [settings, setSettings] = useState({
    autoSchedule: true,
    notifications: true,
    preventiveMaintenance: false
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">График обслуживания</h3>
        <div className="space-y-4">
          {MAINTENANCE_TASKS.map(task => (
            <div
              key={task.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{task.name}</h4>
                  <p className="text-sm text-gray-500">{task.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      {task.interval}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      След. обслуживание: {new Date(task.nextDue).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded">
                  Запланировать
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Настройки обслуживания
        </h3>
        <div className="space-y-4">
          <Switch
            label="Автоматическое планирование"
            description="Автоматически планировать регулярное обслуживание"
            checked={settings.autoSchedule}
            onChange={() => handleSettingChange('autoSchedule')}
          />
          <Switch
            label="Уведомления об обслуживании"
            description="Получать напоминания о предстоящем обслуживании"
            checked={settings.notifications}
            onChange={() => handleSettingChange('notifications')}
          />
          <Switch
            label="Превентивное обслуживание"
            description="Анализировать данные для предотвращения проблем"
            checked={settings.preventiveMaintenance}
            onChange={() => handleSettingChange('preventiveMaintenance')}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Wrench className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            След. плановое обслуживание: <strong>15 апреля 2024</strong>
          </span>
        </div>
      </div>
    </div>
  );
}