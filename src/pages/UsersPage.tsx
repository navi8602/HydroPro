
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertTriangle } from 'lucide-react';

interface User {
  id: number;
  phone: string;
  role: string;
  permissions: Permission[];
}

interface Permission {
  systemId: number;
  accessLevel: string;
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить список пользователей');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Не удалось обновить роль пользователя');
      }

      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Ошибка при обновлении роли пользователя');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          Загрузка...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12 text-red-600">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление пользователями</h1>
      {users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Пользователи не найдены
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map(user => (
            <Card key={user.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.phone}</p>
                  <div className="flex gap-2 mt-2">
                    {user.permissions.map(perm => (
                      <Badge key={perm.systemId} variant="info">
                        Система #{perm.systemId}: {perm.accessLevel}
                      </Badge>
                    ))}
                  </div>
                </div>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                  <option value="viewer">Наблюдатель</option>
                </select>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
