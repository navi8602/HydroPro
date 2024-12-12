import { Line } from 'react-chartjs-2';
import { Plant } from '../../types/system';
import { PlantGrowthData } from '../../types/monitoring';

interface PlantGrowthChartProps {
  plant: Plant;
  growthData: PlantGrowthData[];
}

export function PlantGrowthChart({ plant, growthData }: PlantGrowthChartProps) {
  const data = {
    labels: growthData.map(d => new Date(d.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Высота (см)',
        data: growthData.map(d => d.height),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Количество листьев',
        data: growthData.map(d => d.leafCount),
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `График роста: ${plant.name}`
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <Line data={data} options={options} />
    </div>
  );
}