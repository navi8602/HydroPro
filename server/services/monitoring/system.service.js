// server/services/monitoring/system.service.js
import { RentedSystem } from '../../models/RentedSystem.js';
import { analyzeMetrics } from '../../utils/monitoring.js';

export const systemMonitoringService = {
  async getSystemMetrics(systemId) {
    const system = await RentedSystem.findById(systemId)
      .populate('plants');

    return {
      temperature: await this.getTemperature(systemId),
      humidity: await this.getHumidity(systemId),
      nutrientLevel: await this.getNutrientLevel(systemId),
      phLevel: await this.getPhLevel(systemId),
      lastUpdated: new Date()
    };
  },

  async analyzeMetrics(metrics) {
    return analyzeMetrics(metrics);
  },

  // Приватные методы для получения данных с сенсоров
  async getTemperature(systemId) {
    // Интеграция с сенсорами
    return 22 + Math.random() * 2;
  },

  async getHumidity(systemId) {
    return 65 + Math.random() * 5;
  },

  async getNutrientLevel(systemId) {
    return 80 + Math.random() * 10;
  },

  async getPhLevel(systemId) {
    return 6.0 + Math.random() * 0.5;
  }
};
