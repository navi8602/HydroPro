// Добавим новые типы для систем
export interface HydroponicSystem {
  id: string;
  name: string;
  model: string;
  description: string;
  capacity: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  features: string[];
  monthlyPrice: number;
  imageUrl: string;
  specifications: {
    powerConsumption: number; // Вт
    waterCapacity: number; // л
    lightingType: string;
    automationLevel: 'basic' | 'advanced' | 'professional';
  };
}

export interface RentalPeriod {
  months: 3 | 6 | 12;
  discount: number;
}