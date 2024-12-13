
import { SystemList } from '../components/rental/SystemList';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HydroponicSystem } from '../types/system';
import { HYDROPONIC_SYSTEMS } from '../data/systems';
import { useNotifications } from '../contexts/NotificationContext';

export function SystemsPage() {
  const [systems] = useState<HydroponicSystem[]>(HYDROPONIC_SYSTEMS);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const handleRentSystem = async (systemId: string, months: number) => {
    try {
      const response = await fetch('/api/systems/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ systemId, months })
      });

      if (!response.ok) {
        throw new Error('Failed to rent system');
      }

      addNotification({
        title: 'Успешная аренда',
        message: 'Система успешно арендована',
        type: 'success'
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error renting system:', error);
      addNotification({
        title: 'Ошибка',
        message: 'Не удалось арендовать систему',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Вернуться к дашборду
        </Link>
      </div>

      <SystemList
        systems={systems}
        onRentSystem={handleRentSystem}
      />
    </div>
  );
}
