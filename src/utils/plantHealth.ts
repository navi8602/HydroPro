// src/utils/plantHealth.ts
import type { PlantGrowthData } from '../types/monitoring';

export function calculateHealthScore(data: PlantGrowthData): number {
    const { height, leafCount, healthScore } = data;
    // Implement health score calculation logic
    return (height * 0.4 + leafCount * 0.3 + healthScore * 0.3);
}

export function getHealthStatus(score: number): 'healthy' | 'warning' | 'critical' {
    if (score >= 80) return 'healthy';
    if (score >= 60) return 'warning';
    return 'critical';
}
