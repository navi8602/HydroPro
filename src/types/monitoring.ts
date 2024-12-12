export interface PlantGrowthData {
  timestamp: string;
  height: number;
  leafCount: number;
  healthScore: number;
  notes?: string;
}

export interface EnvironmentData {
  timestamp: string;
  temperature: number;
  humidity: number;
  lightLevel: number;
  phLevel: number;
  nutrientLevel: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: 'warning' | 'critical';
  message: string;
  systemId: string;
  plantId?: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface MaintenanceTask {
  id: string;
  systemId: string;
  plantId?: string;
  type: 'watering' | 'pruning' | 'harvesting' | 'cleaning' | 'nutrientChange';
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface GrowthPhase {
  name: string;
  startDate: string;
  endDate: string;
  expectedDuration: number;
  actualDuration?: number;
  requirements: {
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    phLevel: { min: number; max: number };
    nutrients: string[];
  };
}