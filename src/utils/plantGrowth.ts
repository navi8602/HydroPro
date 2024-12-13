// src/utils/plantGrowth.ts
import type { PlantGrowthData } from '../types/monitoring';

export function calculateGrowthRate(data: PlantGrowthData[]): number {
    if (data.length < 2) return 0;

    const firstRecord = data[0];
    const lastRecord = data[data.length - 1];
    const daysDiff = (new Date(lastRecord.timestamp).getTime() -
        new Date(firstRecord.timestamp).getTime()) /
        (1000 * 60 * 60 * 24);

    return (lastRecord.height - firstRecord.height) / daysDiff;
}

export function predictHarvestDate(
    plantedDate: string,
    growthData: PlantGrowthData[],
    targetHeight: number
): Date {
    const growthRate = calculateGrowthRate(growthData);
    if (growthRate <= 0) return new Date();

    const lastRecord = growthData[growthData.length - 1];
    const remainingGrowth = targetHeight - lastRecord.height;
    const daysToHarvest = remainingGrowth / growthRate;

    const harvestDate = new Date(lastRecord.timestamp);
    harvestDate.setDate(harvestDate.getDate() + Math.ceil(daysToHarvest));

    return harvestDate;
}
