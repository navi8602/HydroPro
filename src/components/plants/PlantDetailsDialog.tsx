import { Dialog } from '../ui/Dialog';
import { PlantType } from '../../types/plants';
import { PlantDetails } from './PlantDetails';
import { PlantMaintenanceSchedule } from './PlantMaintenanceSchedule';
import { PlantEventLog } from './PlantEventLog';
import { PlantStatistics } from './PlantStatistics';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Plant } from '../../types/system';

interface PlantDetailsDialogProps {
  plant: PlantType;
  isOpen: boolean;
  onClose: () => void;
}

export function PlantDetailsDialog({ 
  plant, 
  isOpen, 
  onClose 
}: PlantDetailsDialogProps) {
  // Имитация данных для демонстрации
  const mockPlant: Plant = {
    id: '1',
    name: plant.name,
    position: 1,
    plantedDate: new Date().toISOString(),
    expectedHarvestDate: new Date(Date.now() + plant.growthDays * 24 * 60 * 60 * 1000).toISOString(),
    status: 'healthy'
  };

  const mockStats = {
    totalHarvests: 12,
    lastHarvestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    averageGrowthTime: plant.growthDays,
    successRate: 0.85,
    issues: 2
  };

  const mockEvents = [
    {
      id: '1',
      plantId: '1',
      type: 'watering' as const,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Регулярный полив'
    },
    {
      id: '2',
      plantId: '1',
      type: 'fertilizing' as const,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Внесение питательных веществ'
    }
  ];

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title={plant.name}
    >
      <div className="space-y-6">
        <div className="aspect-video rounded-lg overflow-hidden">
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="maintenance">Обслуживание</TabsTrigger>
            <TabsTrigger value="statistics">Статистика</TabsTrigger>
            <TabsTrigger value="history">История</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="overview">
              <PlantDetails plant={plant} />
            </TabsContent>

            <TabsContent value="maintenance">
              <PlantMaintenanceSchedule
                plant={mockPlant}
                plantType={plant}
              />
            </TabsContent>

            <TabsContent value="statistics">
              <PlantStatistics
                plant={mockPlant}
                stats={mockStats}
              />
            </TabsContent>

            <TabsContent value="history">
              <PlantEventLog
                events={mockEvents}
                onAddEvent={(event) => {
                  console.log('Adding event:', event);
                }}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Dialog>
  );
}