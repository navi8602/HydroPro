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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Не авторизован');
      }
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://0.0.0.0:3002';
      const response = await fetch(`${API_URL}/api/systems/rent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ systemId, months }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to rent system');
      }

      addNotification({
        title: 'Успешная аренда',
        message: 'Система успешно арендована',
        type: 'success'
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error renting system:', {
        error,
        requestBody: { systemId, months },
        token: localStorage.getItem('token'),
        responseStatus: error.response?.status,
        responseData: error.response?.data,
        stack: error.stack
      });
      addNotification({
        title: 'Ошибка',
        message: `Не удалось арендовать систему: ${error.message || 'Неизвестная ошибка'}`,
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