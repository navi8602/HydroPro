import { api } from '../api';
import { RentedSystem } from '../../types/system';

export const SystemsService = {
    async getRentedSystems(): Promise<RentedSystem[]> {
        const { data } = await api.get<RentedSystem[]>('/systems/user');
        return data;
    },

    async rentSystem(systemId: string, months: number): Promise<RentedSystem> {
        const { data } = await api.post<RentedSystem>('/systems/rent', {
            systemId,
            months
        });
        return data;
    },

    async updateSystemMetrics(systemId: string, metrics: any): Promise<void> {
        await api.put(`/systems/${systemId}/metrics`, metrics);
    }
};
