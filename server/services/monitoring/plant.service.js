// server/services/monitoring/plant.service.js
import { Plant } from '../../models/Plant.js';
import { analyzePlantHealth } from '../../utils/monitoring.js';

export const plantMonitoringService = {
  async addGrowthRecord(plantId, data) {
    const plant = await Plant.findById(plantId);

    plant.growthData.push({
      ...data,
      date: new Date()
    });

    const healthAnalysis = await this.analyzeHealth(plant);
    if (healthAnalysis.needsAttention) {
      await this.createHealthAlert(plant, healthAnalysis);
    }

    return plant.save();
  },

  async analyzeHealth(plant) {
    return analyzePlantHealth(plant);
  },

  async getGrowthTrends(plantId, period = '7d') {
    const plant = await Plant.findById(plantId);
    return this.calculateGrowthTrends(plant, period);
  },

  calculateGrowthTrends(plant, period) {
    // Анализ трендов роста
    const trends = {
      heightGrowth: 0,
      leafCount: 0,
      healthScore: 0
    };

    // Расчет трендов на основе данных
    return trends;
  }
};
