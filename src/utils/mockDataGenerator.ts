import { EnvironmentData, Alert, MaintenanceTask, GrowthPhase } from '../types/monitoring';
import { Notification } from '../contexts/NotificationContext';
import { Plant } from '../types/system';
import { SYSTEM_THRESHOLDS } from './constants';

export function generateEnvironmentData(hours: number): EnvironmentData[] {
  const data: EnvironmentData[] = [];
  const now = new Date();

  for (let i = 0; i < hours; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - (hours - i));
    
    data.push({
      timestamp: timestamp.toISOString(),
      temperature: 22 + Math.sin(i / 12) * 3 + Math.random() * 2,
      humidity: 65 + Math.sin(i / 8) * 10 + Math.random() * 5,
      lightLevel: (i % 24 < 14) ? 800 + Math.random() * 200 : 0,
      phLevel: 6.0 + Math.random() * 0.5,
      nutrientLevel: Math.max(0, Math.min(100, 80 + Math.sin(i / 24) * 20))
    });
  }

  return data;
}

export function generateAlerts(systemId: string): Alert[] {
  return [
    {
      id: '1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'warning',
      message: 'Уровень pH выше нормы',
      systemId,
      resolved: false
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: 'critical',
      message: 'Низкий уровень питательного раствора',
      systemId,
      resolved: false
    }
  ];
}

export function generateMaintenanceTasks(systemId: string): MaintenanceTask[] {
  const now = new Date();
  return [
    {
      id: '1',
      systemId,
      type: 'watering',
      dueDate: new Date(now.getTime() + 86400000).toISOString(),
      completed: false,
      notes: 'Проверить уровень воды'
    },
    {
      id: '2',
      systemId,
      type: 'nutrientChange',
      dueDate: new Date(now.getTime() + 172800000).toISOString(),
      completed: false,
      notes: 'Заменить питательный раствор'
    }
  ];
}

export function generateSystemNotifications(systemId: string): Notification[] {
  if (Math.random() > 0.8) {
    return [{
      title: 'Плановое обслуживание',
      message: 'Рекомендуется провести проверку системы',
      type: 'info',
      systemId
    }];
  }
  return [];
}

export function generatePlantNotifications(
  systemId: string,
  plantId: string
): Notification[] {
  if (Math.random() > 0.9) {
    return [{
      title: 'Состояние растения',
      message: 'Обнаружены признаки недостатка питательных веществ',
      type: 'warning',
      systemId,
      plantId
    }];
  }
  return [];
}

export function generateAnalyticsData() {
  const labels = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toLocaleDateString();
  });

  return {
    labels,
    datasets: [
      {
        label: 'Рост растений (см)',
        data: labels.map((_, i) => 10 + i * 0.5 + Math.random() * 2),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      },
      {
        label: 'Потребление воды (л)',
        data: labels.map(() => 2 + Math.random()),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }
    ]
  };
}

export function generateGrowthPhases(plant: Plant): GrowthPhase[] {
  const startDate = new Date(plant.plantedDate);
  const phases: GrowthPhase[] = [
    {
      name: 'Проращивание',
      startDate: startDate.toISOString(),
      endDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      expectedDuration: 7,
      requirements: {
        temperature: { min: 20, max: 25 },
        humidity: { min: 70, max: 85 },
        phLevel: { min: 6.0, max: 6.5 },
        nutrients: ['Азот']
      }
    },
    {
      name: 'Вегетативный рост',
      startDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      expectedDuration: 14,
      requirements: {
        temperature: { min: 22, max: 26 },
        humidity: { min: 60, max: 75 },
        phLevel: { min: 5.8, max: 6.2 },
        nutrients: ['Азот', 'Фосфор', 'Калий']
      }
    },
    {
      name: 'Созревание',
      startDate: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(plant.expectedHarvestDate).toISOString(),
      expectedDuration: 9,
      requirements: {
        temperature: { min: 20, max: 24 },
        humidity: { min: 55, max: 70 },
        phLevel: { min: 6.0, max: 6.5 },
        nutrients: ['Фосфор', 'Калий']
      }
    }
  ];

  return phases;
}