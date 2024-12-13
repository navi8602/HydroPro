import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Sprout, User, LogOut, UserCircle } from 'lucide-react';
import { NotificationCenter } from '../notifications/NotificationCenter';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navigation = [
    { name: 'Дашборд', href: '/dashboard', icon: Home },
    { name: 'Системы', href: '/systems', icon: Package },
    { name: 'Растения', href: '/plants', icon: Sprout },
    { name: 'Пользователи', href: '/users', icon: User },
    { name: 'Профиль', href: '/profile', icon: UserCircle },
  ];

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Package className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                HydroPro
              </span>
            </Link>

            <nav className="ml-10 flex space-x-4">
              {navigation.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  to={href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${location.pathname === href
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}