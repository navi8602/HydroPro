import { useState } from 'react';
import { Switch } from '../ui/Switch';
import { Battery, Moon, Sun, Zap } from 'lucide-react';

interface PowerMode {
  id: string;
  name: string;
  description: string;
  icon: typeof Battery;
  savings: number;
}

const POWER_MODES: PowerMode[] = [
  {
    id: 'eco',
    name: 'Эко режим',
    description: 'Оптимизированный режим для экономии энергии',
    icon: Battery,
    savings: 30
  },
  {
    id: 'night',
    name: 'Ночной режим',
    description: 'Сниженное энергопотребление в ночное время',
    icon: Moon,
    savings: 20
  },
  {
    id: 'day',
    name: 'Дневной режим',
    description: 'Стандартный режим работы',
    icon: Sun,
    savings: 0
  }
];

export function PowerSettings() {
  const [selectedMode, setSelectedMode] = useState('day');
  const [settings, setSettings] = useState({
    autoAdjust: true,
    smartScheduling: true,
    peakAvoidance: false
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Режимы энергопотребления</h3>
        <div className="grid gap-4">
          {POWER_MODES.map(mode => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer
                  ${selectedMode === mode.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'}
                `}
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-indigo-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">{mode.name}</h4>
                    <p className="text-sm text-gray-500">{mode.description}</p>
                  </div>
                  {mode.savings > 0 && (
                    <span className="text-green-600 text-sm font-medium">
                      -{mode.savings}% энергии
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Дополнительные настройки
        </h3>
        <div className="space-y-4">
          <Switch
            label="Автоматическая оптимизация"
            description="Автоматически регулировать энергопотребление на основе условий"
            checked={settings.autoAdjust}
            onChange={() => handleSettingChange('autoAdjust')}
          />
          <Switch
            label="Умное расписание"
            description="Оптимизировать работу системы по расписанию"
            checked={settings.smartScheduling}
            onChange={() => handleSettingChange('smartScheduling')}
          />
          <Switch
            label="Избегание пиковых нагрузок"
            description="Снижать потребление в часы пиковой нагрузки"
            checked={settings.peakAvoidance}
            onChange={() => handleSettingChange('peakAvoidance')}
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-gray-600">
            Текущее потребление: <strong>2.4 кВт/ч</strong>
          </span>
        </div>
      </div>
    </div>
  );
}