
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertTriangle, UserCircle, Search, Filter, Clock } from 'lucide-react';

interface User {
  id: number;
  phone: string;
  role: string;
  permissions: Permission[];
  lastActive?: string;
  registeredAt?: string;
}

interface Permission {
  systemId: number;
  accessLevel: string;
}

const roleLabels = {
  user: 'Пользователь',
  admin: 'Администратор',
  viewer: 'Наблюдатель'
};

const accessLevelColors = {
  owner: 'bg-purple-100 text-purple-800',
  admin: 'bg-red-100 text-red-800',
  user: 'bg-blue-100 text-blue-800',
  viewer: 'bg-green-100 text-green-800'
};

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

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
      setError(error.message || 'Ошибка при загрузке пользователей');
      setLoading(false);
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.phone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const userStats = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Загрузка пользователей...</p>
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
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление пользователями</h1>
            <p className="text-gray-500 mt-1">Всего пользователей: {users.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(roleLabels).map(([role, label]) => (
            <Card key={role} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-2xl font-bold">{userStats[role] || 0}</p>
                </div>
                <UserCircle className={`h-8 w-8 ${
                  role === 'admin' ? 'text-red-500' :
                  role === 'user' ? 'text-blue-500' : 'text-green-500'
                }`} />
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Поиск по номеру телефона..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Все роли</option>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <UserCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Пользователи не найдены</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map(user => (
            <Card key={user.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <UserCircle className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{user.phone}</p>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.permissions.map(perm => (
                      <Badge 
                        key={`${user.id}-${perm.systemId}`} 
                        className={`${accessLevelColors[perm.accessLevel as keyof typeof accessLevelColors]}`}
                      >
                        Система #{perm.systemId}: {perm.accessLevel}
                      </Badge>
                    ))}
                  </div>
                  {user.lastActive && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Последняя активность: {new Date(user.lastActive).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 
                             focus:ring-indigo-500 sm:text-sm p-2"
                  >
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
