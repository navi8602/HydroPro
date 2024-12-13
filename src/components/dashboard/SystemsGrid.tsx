// src/components/dashboard/SystemsGrid.tsx
import { useState, useEffect } from 'react';
import { SystemsService } from '../../api/services/systems.service';
import { RentedSystemCard } from './RentedSystemCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useNotifications } from '../../contexts/NotificationContext';
import type { RentedSystem } from '../../types/system';

export function SystemsGrid() {
  const [systems, setSystems] = useState<RentedSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const { data } = await SystemsService.getRentedSystems();
        setSystems(data);
      } catch (error) {
        addNotification({
          title: 'Ошибка загрузки',
          message: 'Не удалось загрузить список систем',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSystems();
  }, []);

  const handleRemoveSystem = async (systemId: string) => {
    try {
      await SystemsService.removeSystem(systemId);
      setSystems(prev => prev.filter(s => s.id !== systemId));
      addNotification({
        title: 'Успешно',
        message: 'Система удалена',
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Ошибка',
        message: 'Не удалось удалить систему',
        type: 'error'
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
      <div className="grid grid-cols-1 gap-6">
        {systems.map(system => (
            <RentedSystemCard
                key={system.id}
                system={system}
                onRemove={handleRemoveSystem}
            />
        ))}
      </div>
  );
}
