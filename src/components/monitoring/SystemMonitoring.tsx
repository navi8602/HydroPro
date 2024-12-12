import { useState } from 'react';
import { RentedSystem } from '../../types/system';
import { EmptySystemState } from './EmptySystemState';
import { useNotifications } from '../../contexts/NotificationContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { EnvironmentMonitor } from './EnvironmentMonitor';
import { AlertsList } from './AlertsList';
import { MaintenanceSchedule } from './MaintenanceSchedule';
import { GrowthPhaseTimeline } from './GrowthPhaseTimeline';
import { SystemAnalytics } from '../dashboard/SystemAnalytics';
import { 
  generateEnvironmentData, 
  generateAlerts,
  generateMaintenanceTasks,
  generateGrowthPhases,
  generateAnalyticsData
} from '../../utils/mockDataGenerator';

interface SystemMonitoringProps {
  system: RentedSystem;
}

export function SystemMonitoring({ system }: SystemMonitoringProps) {
  const [isActive, setIsActive] = useState(system.plants.length > 0);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const { addNotification } = useNotifications();

  const handleActivateSystem = () => {
    if (system.plants.length === 0) {
      addNotification({
        title: 'Невозможно активировать систему',
        message: 'Добавьте хотя бы одно растение для активации системы',
        type: 'warning',
        systemId: system.id
      });
      return;
    }

    setIsActive(true);
    addNotification({
      title: 'Система активирована',
      message: 'Система успешно активирована и готова к работе',
      type: 'success',
      systemId: system.id
    });
  };

  if (!isActive || system.plants.length === 0) {
    return <EmptySystemState onActivate={handleActivateSystem} />;
  }

  // Генерируем данные для мониторинга
  const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
  const environmentData = generateEnvironmentData(hours);
  const alerts = generateAlerts(system.id);
  const maintenanceTasks = generateMaintenanceTasks(system.id);
  const analyticsData = generateAnalyticsData();
  
  // Получаем фазы роста для первого растения (для демонстрации)
  const growthPhases = system.plants[0] 
    ? generateGrowthPhases(system.plants[0])
    : [];

  const handleResolveAlert = (alertId: string) => {
    addNotification({
      title: 'Уведомление обработано',
      message: 'Проблема успешно устранена',
      type: 'success',
      systemId: system.id
    });
  };

  const handleCompleteTask = (taskId: string) => {
    addNotification({
      title: 'Задача выполнена',
      message: 'Задача обслуживания отмечена как выполненная',
      type: 'success',
      systemId: system.id
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="environment">
        <TabsList>
          <TabsTrigger value="environment">Показатели среды</TabsTrigger>
          <TabsTrigger value="alerts">Уведомления</TabsTrigger>
          <TabsTrigger value="maintenance">Обслуживание</TabsTrigger>
          <TabsTrigger value="growth">Рост растений</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="environment">
            <EnvironmentMonitor
              data={environmentData}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsList
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
            />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceSchedule
              tasks={maintenanceTasks}
              onCompleteTask={handleCompleteTask}
            />
          </TabsContent>

          <TabsContent value="growth">
            {system.plants[0] ? (
              <GrowthPhaseTimeline
                plant={system.plants[0]}
                phases={growthPhases}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Добавьте растения для отслеживания их роста
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <SystemAnalytics
              data={analyticsData}
              predictions={{
                nextHarvest: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                expectedYield: 2.5,
                potentialIssues: [
                  'Возможно снижение влажности в ближайшие дни',
                  'Рекомендуется проверить уровень pH'
                ]
              }}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}