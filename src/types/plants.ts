export interface PlantType {
  id: string;
  name: string;
  category: string;
  growthDays: number;
  optimalTemp: { min: number; max: number };
  optimalHumidity: { min: number; max: number };
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  spacing: number;
  nutrients: string[];
  companionPlants: string[];
  incompatiblePlants: string[];
  maxQuantity: number;
  minDistance: number;
  imageUrl: string;
  maintenanceSchedule?: {
    watering: number;
    fertilizing: number;
    pruning?: number;
  };
}

export interface PlantEvent {
  id: string;
  plantId: string;
  type: 'watering' | 'harvesting' | 'pruning' | 'fertilizing' | 'issue' | 'note';
  timestamp: string;
  description: string;
}

export interface PlantStats {
  totalHarvests: number;
  lastHarvestDate?: string;
  averageGrowthTime: number;
  successRate: number;
  issues: number;
}

export interface PlantEntry {
  plantId: string;
  quantity: number;
  costPerPlant: number;
  notes?: string;
  spaceRequired: number;
}