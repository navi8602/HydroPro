import { RentedSystemCard } from '../components/dashboard/RentedSystemCard';
import { Plus, TrendingUp, Sprout, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RentedSystem } from '../types/system';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { SystemsGrid } from '../components/dashboard/SystemsGrid';

interface DashboardPageProps {
  rentedSystems: RentedSystem[];
}

export function DashboardPage({ rentedSystems }: DashboardPageProps) {
  // Подсчет статистики
  const totalPlants = rentedSystems.reduce((sum, system) => sum + system.plants.length, 0);
  const totalCapacity = rentedSystems.reduce((sum, system) => sum + system.capacity, 0);
  const healthyPlants = rentedSystems.reduce(
    (sum, system) => sum + system.plants.filter(p => p.status === 'healthy').length,
    0
  );
  const warningPlants = rentedSystems.reduce(
    (sum, system) => sum + system.plants.filter(p => p.status === 'warning').length,
    0
  );

  const stats = [
    {
      name: 'Всего систем',
      value: rentedSystems.length,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Растений',
      value: totalPlants,
      total: totalCapacity,
      icon: Sprout,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Здоровые растения',
      value: healthyPlants,
      total: totalPlants,
      icon: Sprout,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      name: 'Требуют внимания',
      value: warningPlants,
      total: totalPlants,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Мои гидропонные системы
          </h1>
          <p className="text-gray-500">
            {rentedSystems.length > 0 
              ? `У вас ${rentedSystems.length} активных систем`
              : 'У вас пока нет арендованных систем'}
          </p>
        </div>
        <Link
          to="/systems"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white 
                   rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Арендовать систему
        </Link>
      </div>

      {rentedSystems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Начните выращивать растения прямо сейчас
          </h3>
          <p className="text-gray-500 mb-4">
            Арендуйте гидропонную систему и создайте свой домашний сад
          </p>
          <Link
            to="/systems"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 
                     text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Выбрать систему
          </Link>
        </div>
      ) : (
        <>
          <DashboardStats stats={stats} />
          <SystemsGrid systems={rentedSystems} />
        </>
      )}
    </div>
  );
}