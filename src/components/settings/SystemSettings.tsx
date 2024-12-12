import { useSettings } from '../../hooks/useSettings';
import { Card } from '../ui/Card';
import { Settings, Bell, Power, Clock } from 'lucide-react';
import { NotificationSettings } from './NotificationSettings';
import { PowerSettings } from './PowerSettings';
import { MaintenanceSettings } from './MaintenanceSettings';
import type { SettingsKey } from '../../types/settings';

type SettingsTab = 'notifications' | 'power' | 'maintenance';

export function SystemSettings() {
  const { settings, updateSetting } = useSettings();

  const tabs = [
    { id: 'notifications' as SettingsKey, label: 'Уведомления', icon: Bell },
    { id: 'power' as SettingsKey, label: 'Энергопотребление', icon: Power },
    { id: 'maintenance' as SettingsKey, label: 'Обслуживание', icon: Clock },
  ] as const;

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Настройки системы</h2>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`
                flex items-center space-x-2 py-2 px-3 border-b-2 text-sm font-medium
                ${settings[id] 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <NotificationSettings
          settings={settings.notifications}
          onUpdate={(value) => updateSetting('notifications', value)}
        />
        <PowerSettings
          settings={settings.power}
          onUpdate={(value) => updateSetting('power', value)}
        />
        <MaintenanceSettings
          settings={settings.maintenance}
          onUpdate={(value) => updateSetting('maintenance', value)}
        />
      </div>
    </Card>
  );
}