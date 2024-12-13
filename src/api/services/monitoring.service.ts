import { api } from '../api';
import { SystemMetrics } from '../../types/system';

export const MonitoringService = {
    async getSystemMetrics(systemId: string): Promise<SystemMetrics> {
        const { data } = await api.get<SystemMetrics>(`/systems/${systemId}/metrics`);
        return data;
    },

    async getHistoricalData(systemId: string, timeRange: string): Promise<any> {
        const { data } = await api.get(`/systems/${systemId}/metrics/history`, {
            params: { timeRange }
        });
        return data;
    },

    async getAlerts(systemId: string): Promise<any[]> {
        const { data } = await api.get(`/systems/${systemId}/alerts`);
        return data;
    }
};
