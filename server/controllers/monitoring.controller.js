// server/controllers/monitoring.controller.js
import { systemMonitoringService } from '../services/monitoring/system.service.js';
import { Plant } from '../models/Plant.js';
import { ApiError } from '../utils/ApiError.js';

export const monitoringController = {
  async getSystemMetrics(req, res, next) {
    try {
      const { systemId } = req.params;
      const metrics = await systemMonitoringService.getSystemMetrics(systemId);
      const alerts = await systemMonitoringService.analyzeMetrics(metrics);

      res.json({ metrics, alerts });
    } catch (error) {
      next(error);
    }
  },

  async addGrowthData(req, res, next) {
    try {
      const { plantId } = req.params;
      const { height, leafCount, healthScore, notes } = req.body;

      const plant = await Plant.findById(plantId);
      if (!plant) {
        throw new ApiError(404, 'Plant not found');
      }

      plant.growthData.push({
        date: new Date(),
        height,
        leafCount,
        healthScore,
        notes
      });

      await plant.save();
      res.json(plant);
    } catch (error) {
      next(error);
    }
  },

  async getPlantGrowthHistory(req, res, next) {
    try {
      const { plantId } = req.params;
      const plant = await Plant.findById(plantId);

      if (!plant) {
        throw new ApiError(404, 'Plant not found');
      }

      res.json(plant.growthData);
    } catch (error) {
      next(error);
    }
  }
};
