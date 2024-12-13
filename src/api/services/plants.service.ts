import { api } from '../api';
import { Plant } from '../../types/system';

export const PlantService = {
    async addPlant(systemId: string, plantData: Partial<Plant>): Promise<Plant> {
        const { data } = await api.post<Plant>(`/systems/${systemId}/plants`, plantData);
        return data;
    },

    async updatePlantStatus(plantId: string, status: Plant['status']): Promise<Plant> {
        const { data } = await api.put<Plant>(`/plants/${plantId}/status`, { status });
        return data;
    },

    async addGrowthData(plantId: string, growthData: any): Promise<void> {
        await api.post(`/plants/${plantId}/growth`, growthData);
    },

    async addMaintenanceRecord(plantId: string, record: any): Promise<void> {
        await api.post(`/plants/${plantId}/maintenance`, record);
    },

    async removePlant(plantId: string): Promise<void> {
        await api.delete(`/plants/${plantId}`);
    }
};
