
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление пользователями</h1>
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
    </div>
  );
}
