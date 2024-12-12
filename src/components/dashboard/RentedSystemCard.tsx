import { useState } from 'react';
import { Card } from '../ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { SystemOverview } from './SystemOverview';
import { SystemMonitoring } from '../monitoring/SystemMonitoring';
import { SystemSettings } from '../settings/SystemSettings';
import { MultiPlantAddDialog } from '../plants/MultiPlantAddDialog';
import type { RentedSystem, Plant } from '../../types/system';
import { useNotifications } from '../../contexts/NotificationContext';

interface RentedSystemCardProps {
  system: RentedSystem;
}

export function RentedSystemCard({ system }: RentedSystemCardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [plants, setPlants] = useState(system.plants);
  const { addNotification } = useNotifications();

  const handleAddPlant = (newPlants: Omit<Plant, 'id' | 'status'>[]) => {
    const plantsWithIds = newPlants.map(plant => ({
      ...plant,
      id: crypto.randomUUID(),
      status: 'healthy'
    }));
    setPlants(prevPlants => [...prevPlants, ...plantsWithIds]);

    addNotification({
      title: 'Растения добавлены',
      message: `Добавлено ${newPlants.length} новых растений`,
      type: 'success',
      systemId: system.id
    });
  };

  const handleRemovePlant = (plantId: string) => {
    setPlants(prevPlants => prevPlants.filter(p => p.id !== plantId));
    addNotification({
      title: 'Растение удалено',
      message: 'Растение успешно удалено из системы',
      type: 'info',
      systemId: system.id
    });
  };

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview">
            <SystemOverview
              system={{ ...system, plants }}
              onAddPlant={() => setIsAddPlantOpen(true)}
              onRemovePlant={handleRemovePlant}
            />
          </TabsContent>

          <TabsContent value="monitoring">
            <SystemMonitoring system={{ ...system, plants }} />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings system={{ ...system, plants }} />
          </TabsContent>
        </div>
      </Tabs>

      <MultiPlantAddDialog
        isOpen={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
        onAdd={handleAddPlant}
        occupiedPositions={plants.map(p => p.position)}
        capacity={system.capacity}
        currentPlants={plants}
      />
    </Card>
  );
}