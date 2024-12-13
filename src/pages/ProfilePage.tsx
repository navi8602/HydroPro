import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { RentedSystemCard } from '../components/dashboard/RentedSystemCard';
import { UserCircle } from 'lucide-react';
import type { RentedSystem } from '../types/system';
import { getAuthToken } from '../utils/auth';

export function ProfilePage() {
  const [rentedSystems, setRentedSystems] = useState<RentedSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setError('Требуется авторизация');
      return;
    }
    
    fetch(`/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('User not found');
      return res.json();
    })
    .then(data => {
      setUser(data);
      setUserId(data.id.toString());
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      setError('Ошибка загрузки профиля');
    });
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserSystems();
    }
  }, [userId]);

  const fetchUserSystems = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/systems/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRentedSystems(data || []);
    } catch (error) {
      console.error('Error fetching user systems:', error);
      setError('Ошибка при загрузке систем');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <p className="text-red-500">{error}</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <UserCircle className="h-16 w-16 text-gray-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Профиль пользователя</h2>
            <p className="text-gray-500">ID: {userId || 'Не определен'}</p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-4">Арендованные системы</h3>
        {rentedSystems.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500">У вас пока нет арендованных систем</p>
            <button
              onClick={() => window.location.href = '/systems'}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Арендовать систему
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentedSystems.map((system) => (
              <RentedSystemCard key={system.id} system={system} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}