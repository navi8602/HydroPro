// src/components/monitoring/SystemMonitoring.tsx
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
import { Icon } from '../icons';
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

  const handleActivateSystem = async () => {
    try {
      const response = await fetch(`/api/systems/${system.id}/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Не удалось активировать систему');
      }

      setIsActive(true);
      addNotification({
        title: 'Система активирована',
        message: 'Система успешно активирована и готова к работе',
        type: 'success',
        systemId: system.id
      });
    } catch (error) {
      addNotification({
        title: 'Ошибка активации',
        message: 'Не удалось активировать систему',
        type: 'error',
        systemId: system.id
      });
    }
  };

  if (!isActive || system.plants.length === 0) {
    return <EmptySystemState onActivate={handleActivateSystem} />;
  }

  const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
  const environmentData = generateEnvironmentData(hours);
  const alerts = generateAlerts(system.id);
  const maintenanceTasks = generateMaintenanceTasks(system.id);
  const analyticsData = generateAnalyticsData();
  const growthPhases = system.plants[0]
      ? generateGrowthPhases(system.plants[0])
      : [];

  return (
      <div className="space-y-6">
        <Tabs defaultValue="environment">
          <TabsList>
            <TabsTrigger value="environment">
              <Icon name="Leaf" size="sm" className="mr-2" />
              Окружающая среда
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <Icon name="AlertTriangle" size="sm" className="mr-2" />
              Уведомления
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <Icon name="Settings" size="sm" className="mr-2" />
              Обслуживание
            </TabsTrigger>
            <TabsTrigger value="growth">
              <Icon name="Sprout" size="sm" className="mr-2" />
              Рост
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Icon name="Activity" size="sm" className="mr-2" />
              Аналитика
            </TabsTrigger>
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
                  onResolveAlert={async (alertId) => {
                    try {
                      const response = await fetch(`/api/alerts/${alertId}/resolve`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                      });

                      if (!response.ok) {
                        throw new Error('Не удалось разрешить уведомление');
                      }

                      addNotification({
                        title: 'Уведомление разрешено',
                        message: 'Уведомление успешно отмечено как разрешенное',
                        type: 'success',
                        systemId: system.id
                      });
                    } catch (error) {
                      addNotification({
                        title: 'Ошибка',
                        message: 'Не удалось разрешить уведомление',
                        type: 'error',
                        systemId: system.id
                      });
                    }
                  }}
              />
            </TabsContent>

            <TabsContent value="maintenance">
              <MaintenanceSchedule
                  tasks={maintenanceTasks}
                  onCompleteTask={async (taskId) => {
                    try {
                      const response = await fetch(`/api/tasks/${taskId}/complete`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                      });

                      if (!response.ok) {
                        throw new Error('Не удалось завершить задачу');
                      }

                      addNotification({
                        title: 'Задача завершена',
                        message: 'Задача обслуживания успешно завершена',
                        type: 'success',
                        systemId: system.id
                      });
                    } catch (error) {
                      addNotification({
                        title: 'Ошибка',
                        message: 'Не удалось завершить задачу',
                        type: 'error',
                        systemId: system.id
                      });
                    }
                  }}
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
                    <Icon name="Plant" size="lg" className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">
                      Добавьте растения для отслеживания роста
                    </p>
                  </div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <SystemAnalytics
                  metrics={system.metrics}
                  historicalData={analyticsData}
                  predictions={{
                    nextHarvest: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    expectedYield: 2.5,
                    potentialIssues: [
                      'Возможное падение влажности в ближайшие дни',
                      'Уровень pH требует внимания'
                    ]
                  }}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
  );
}
