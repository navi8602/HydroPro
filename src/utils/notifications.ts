
import { Plant, SystemMetrics } from '../types/system';

export function checkPlantConditions(plant: Plant, metrics: SystemMetrics) {
  const alerts = [];
  
  // Проверка температуры
  if (metrics.temperature < plant.optimalTemp.min) {
    alerts.push({
      type: 'warning',
      message: `Низкая температура для ${plant.name}: ${metrics.temperature}°C`
    });
  } else if (metrics.temperature > plant.optimalTemp.max) {
    alerts.push({
      type: 'warning',
      message: `Высокая температура для ${plant.name}: ${metrics.temperature}°C`
    });
  }
  
  // Проверка влажности
  if (metrics.humidity < plant.optimalHumidity.min) {
    alerts.push({
      type: 'warning',
      message: `Низкая влажность для ${plant.name}: ${metrics.humidity}%`
    });
  } else if (metrics.humidity > plant.optimalHumidity.max) {
    alerts.push({
      type: 'warning',
      message: `Высокая влажность для ${plant.name}: ${metrics.humidity}%`
    });
  }
  
  // Проверка уровня питательных веществ
  if (metrics.nutrientLevel < 20) {
    alerts.push({
      type: 'error',
      message: 'Критически низкий уровень питательных веществ'
    });
  } else if (metrics.nutrientLevel < 40) {
    alerts.push({
      type: 'warning',
      message: 'Низкий уровень питательных веществ'
    });
  }
  
  return alerts;
}
