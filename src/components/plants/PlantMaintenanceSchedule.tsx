import { PlantType } from '../../types/plants';
import { Plant } from '../../types/system';
import { Droplets, Beaker, Scissors, Calendar } from 'lucide-react';

interface PlantMaintenanceScheduleProps {
  plant: Plant;
  plantType: PlantType;
}

export function PlantMaintenanceSchedule({ 
  plant, 
  plantType 
}: PlantMaintenanceScheduleProps) {
  if (!plantType.maintenanceSchedule) return null;

  const schedule = plantType.maintenanceSchedule;
  const now = new Date();
  const planted = new Date(plant.plantedDate);
  const daysSincePlanting = Math.floor(
    (now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getNextDate = (intervalDays: number) => {
    const daysUntilNext = intervalDays - (daysSincePlanting % intervalDays);
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + daysUntilNext);
    return nextDate.toLocaleDateString();
  };

  const tasks = [
    {
      icon: Droplets,
      label: 'Следующий полив',
      date: getNextDate(schedule.watering),
      interval: `Каждые ${schedule.watering} дн.`
    },
    {
      icon: Beaker,
      label: 'Следующая подкормка',
      date: getNextDate(schedule.fertilizing),
      interval: `Каждые ${schedule.fertilizing} дн.`
    },
    ...(schedule.pruning ? [{
      icon: Scissors,
      label: 'Следующая обрезка',
      date: getNextDate(schedule.pruning),
      interval: `Каждые ${schedule.pruning} дн.`
    }] : [])
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-medium">График обслуживания</h4>
      <div className="grid gap-3">
        {tasks.map(({ icon: Icon, label, date, interval }) => (
          <div
            key={label}
            className="flex items-center justify-between p-3 
                     bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg">
                <Icon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-gray-500">{interval}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
