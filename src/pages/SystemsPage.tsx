import { SystemList } from '../components/rental/SystemList';
import { HYDROPONIC_SYSTEMS } from '../data/systems';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SystemsPageProps {
  onRentSystem: (systemId: string, months: number) => void;
}

export function SystemsPage({ onRentSystem }: SystemsPageProps) {
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
        systems={HYDROPONIC_SYSTEMS}
        onRentSystem={onRentSystem}
      />
    </div>
  );
}