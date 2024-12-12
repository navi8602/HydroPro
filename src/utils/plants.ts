import { Plant } from '../types/system';

export const getEmptySlots = (plants: Plant[], capacity: number): number => {
  return capacity - plants.length;
};

export const getPlantStatus = (
  plantedDate: string,
  expectedHarvestDate: string
): Plant['status'] => {
  const now = new Date();
  const harvest = new Date(expectedHarvestDate);
  const planted = new Date(plantedDate);
  
  const progress = calculateGrowthProgress(plantedDate, expectedHarvestDate);

  if (progress >= 90) return 'critical';
  if (progress >= 75) return 'warning';
  return 'healthy';
};

export const calculateGrowthProgress = (
  plantedDate: string,
  expectedHarvestDate: string
): number => {
  const now = new Date();
  const harvest = new Date(expectedHarvestDate);
  const planted = new Date(plantedDate);
  
  const totalGrowthTime = harvest.getTime() - planted.getTime();
  const currentGrowthTime = now.getTime() - planted.getTime();
  
  return Math.min(100, Math.max(0, (currentGrowthTime / totalGrowthTime) * 100));
};

export const getAvailablePositions = (
  occupiedPositions: number[],
  capacity: number
): number[] => {
  const positions: number[] = [];
  for (let i = 1; i <= capacity; i++) {
    if (!occupiedPositions.includes(i)) {
      positions.push(i);
    }
  }
  return positions;
};