// src/services/system.ts
import { fetchApi } from '../utils/api';
import type { RentedSystem, SystemMetrics } from '../types/system';

export const systemService = {
    async getSystems(): Promise<RentedSystem[]> {
        return fetchApi('/systems');
    },

    async getSystemMetrics(systemId: string): Promise<SystemMetrics> {
        return fetchApi(`/systems/${systemId}/metrics`);
    },

    async updateSystemMetrics(
        systemId: string,
        metrics: Partial<SystemMetrics>
    ): Promise<SystemMetrics> {
        return fetchApi(`/systems/${systemId}/metrics`, {
            method: 'PUT',
            body: JSON.stringify(metrics)
        });
    },

    async deleteSystem(systemId: string): Promise<void> {
        await fetchApi(`/systems/${systemId}`, {
            method: 'DELETE'
        });
    }
};
