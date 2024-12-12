import { RentedSystem } from '../../types/system';
import { Card } from '../ui/Card';
import { QuickActions } from './QuickActions';
import { SystemMetricsCard } from './SystemMetricsCard';
import { PlantList } from './PlantList';
import { EmptyOverviewState } from './EmptyOverviewState';
import { useNotifications } from '../../contexts/NotificationContext';

interface SystemOverviewProps {
  system: RentedSystem;
  onAddPlant: () => void;
  onRemovePlant: (plantId: string) => void;
}

export function SystemOverview({ 
  system, 
  onAddPlant,
  onRemovePlant 
}: SystemOverviewProps) {
  const { addNotification } = useNotifications();

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      light: 'Режим освещения изменен',
      watering: 'Настройки полива обновлены',
      ventilation: 'Вентиляция настроена',
      temperature: 'Температурный режим изменен'
    };

    addNotification({
      title: 'Настройки системы',
      message: actionMessages[action as keyof typeof actionMessages],
      type: 'success',
      systemId: system.id
    });
  };

  if (system.plants.length === 0) {
    return (
      <Card>
        <EmptyOverviewState onAddPlant={onAddPlant} />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Быстрые действия */}
      <Card>
        <h3 className="text-lg font-medium mb-4">Быстрые действия</h3>
        <QuickActions onAction={handleQuickAction} />
      </Card>

      {/* Основной контент */}
      <div className="space-y-6">
        {/* Метрики системы */}
        <Card>
          <SystemMetricsCard metrics={system.metrics} />
        </Card>

        {/* Список растений */}
        <Card>
          <PlantList
            plants={system.plants}
            capacity={system.capacity}
            onAddPlant={onAddPlant}
            onRemovePlant={onRemovePlant}
          />
        </Card>
      </div>
    </div>
  );
}