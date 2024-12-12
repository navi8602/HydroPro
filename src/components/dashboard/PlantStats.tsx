import { 
  CheckCircle, AlertTriangle, AlertOctagon, 
  TrendingUp, Sprout, Leaf 
} from 'lucide-react';

interface PlantStatsProps {
  total: number;
  healthy: number;
  warning: number;
  critical: number;
}

export function PlantStats({ 
  total,
  healthy,
  warning,
  critical 
}: PlantStatsProps) {
  const stats = [
    {
      label: 'Здоровые растения',
      value: healthy,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Растут в оптимальных условиях',
      details: healthy > 0 ? [
        'Стабильный рост',
        'Оптимальные показатели',
        'Нормальное развитие'
      ] : []
    },
    {
      label: 'Требуют внимания',
      value: warning,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      description: 'Приближается время сбора урожая',
      details: warning > 0 ? [
        'Проверьте параметры',
        'Подготовьтесь к сбору',
        'Требуется наблюдение'
      ] : []
    },
    {
      label: 'Критические',
      value: critical,
      icon: AlertOctagon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Требуется немедленное действие',
      details: critical > 0 ? [
        'Срочный сбор урожая',
        'Проверка параметров',
        'Возможны проблемы'
      ] : []
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map(({ 
        label, value, icon: Icon, color, bgColor, borderColor,
        description, details 
      }) => (
        <div
          key={label}
          className={`relative overflow-hidden rounded-lg border ${borderColor} ${bgColor} 
                     transition-all duration-200 hover:shadow-md`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${bgColor}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              {value > 0 && (
                <div className={`text-xs font-medium ${color} flex items-center`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {Math.round((value / total) * 100)}% от общего числа
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <h4 className="font-medium text-gray-900">{label}</h4>
                <span className={`text-2xl font-semibold ${color}`}>{value}</span>
              </div>
              <p className="text-sm text-gray-600">{description}</p>
            </div>

            {value > 0 && details.length > 0 && (
              <div className="mt-3 pt-3 border-t border-dashed">
                <ul className="space-y-1">
                  {details.map((detail, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Sprout className={`h-3 w-3 mr-2 ${color}`} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Декоративный элемент */}
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <Leaf className={`h-24 w-24 ${color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}