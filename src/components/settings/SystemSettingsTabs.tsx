import { useState } from 'react';
import { Settings, Bell, Power, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { NotificationSettings } from './NotificationSettings';
import { PowerSettings } from './PowerSettings';
import { MaintenanceSettings } from './MaintenanceSettings';
import type { RentedSystem } from '../../types/system';

type SettingsTab = 'notifications' | 'power' | 'maintenance';

interface SystemSettingsTabsProps {
  system: RentedSystem;
}

export function SystemSettingsTabs({ system }: SystemSettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('notifications');

  const tabs = [
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'power', label: 'Энергопотребление', icon: Power },
    { id: 'maintenance', label: 'Обслуживание', icon: Clock },
  ] as const;

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Настройки системы {system.name}</h2>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center space-x-2 py-2 px-3 border-b-2 text-sm font-medium
                ${activeTab === id 
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
        {activeTab === 'notifications' && <NotificationSettings systemId={system.id} />}
        {activeTab === 'power' && <PowerSettings systemId={system.id} />}
        {activeTab === 'maintenance' && <MaintenanceSettings systemId={system.id} />}
      </div>
    </Card>
  );
}