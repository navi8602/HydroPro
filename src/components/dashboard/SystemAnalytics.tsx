import { Card } from '../ui/Card';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/date';

interface AnalyticsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface SystemAnalyticsProps {
  data: AnalyticsData;
  predictions: {
    nextHarvest: string;
    expectedYield: number;
    potentialIssues: string[];
  };
}

export function SystemAnalytics({ data, predictions }: SystemAnalyticsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Аналитика системы</h3>
          <select className="text-sm border-gray-300 rounded-md">
            <option value="7">За неделю</option>
            <option value="30">За месяц</option>
            <option value="90">За 3 месяца</option>
          </select>
        </div>
        <div className="h-64">
          <Line
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Следующий урожай</h4>
              <p className="text-sm text-gray-500">
                {formatDate(predictions.nextHarvest)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Ожидаемый урожай: {predictions.expectedYield} кг
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium">Возможные проблемы</h4>
              <ul className="mt-1 space-y-1">
                {predictions.potentialIssues.map((issue, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium">Расход ресурсов</h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Вода:</span>
                  <span>2.3 л/день</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Энергия:</span>
                  <span>1.8 кВт/день</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Питательные в-ва:</span>
                  <span>150 мл/неделю</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}