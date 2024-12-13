// src/api/services/plant.service.ts
import { api } from '../api';
import type { Plant } from '../../types/system';

export const PlantService = {
    getPlants: (systemId: string) =>
        api.get<Plant[]>(`/systems/${systemId}/plants`),

    addPlant: (systemId: string, plantData: Partial<Plant>) =>
        api.post<Plant>(`/systems/${systemId}/plants`, plantData),

    updatePlant: (plantId: string, data: Partial<Plant>) =>
        api.put<Plant>(`/plants/${plantId}`, data),

    deletePlant: (plantId: string) =>
        api.delete(`/plants/${plantId}`),

    addGrowthData: (plantId: string, data: any) =>
        api.post(`/plants/${plantId}/growth`, data),

    addMaintenanceRecord: (plantId: string, data: any) =>
        api.post(`/plants/${plantId}/maintenance`, data)
};
