
import { SystemList } from '../components/rental/SystemList';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { HydroponicSystem } from '../types/system';
import { HYDROPONIC_SYSTEMS } from '../data/systems';
import { useNavigate } from 'react-router-dom';

export function SystemsPage() {
  const [systems] = useState<HydroponicSystem[]>(HYDROPONIC_SYSTEMS);
  const navigate = useNavigate();

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

      navigate('/dashboard');
    } catch (error) {
      console.error('Error renting system:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/"
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
