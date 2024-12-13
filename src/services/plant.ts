// src/services/plant.ts
import { fetchApi } from '../utils/api';
import type { Plant } from '../types/system';

export const plantService = {
    async getPlants(systemId: string): Promise<Plant[]> {
        return fetchApi(`/systems/${systemId}/plants`);
    },

    async addPlant(systemId: string, plantData: Omit<Plant, 'id'>): Promise<Plant> {
        return fetchApi(`/systems/${systemId}/plants`, {
            method: 'POST',
            body: JSON.stringify(plantData)
        });
    },

    async updatePlantStatus(
        plantId: string,
        status: Plant['status']
    ): Promise<Plant> {
        return fetchApi(`/plants/${plantId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    },

    async deletePlant(plantId: string): Promise<void> {
        await fetchApi(`/plants/${plantId}`, {
            method: 'DELETE'
        });
    }
};
