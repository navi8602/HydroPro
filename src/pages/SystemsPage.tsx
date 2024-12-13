import { SystemList } from '../components/rental/SystemList';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HydroponicSystem } from '../types/system';

interface SystemsPageProps {
  onRentSystem: (systemId: string, months: number) => void;
}

export function SystemsPage({ onRentSystem }: SystemsPageProps) {
  const [systems, setSystems] = useState<HydroponicSystem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch('/api/systems');
        if (!response.ok) throw new Error('Failed to fetch systems');
        const data = await response.json();
        setSystems(data);
      } catch (error) {
        console.error('Error fetching systems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
        onRentSystem={onRentSystem}
      />
    </div>
  );
}