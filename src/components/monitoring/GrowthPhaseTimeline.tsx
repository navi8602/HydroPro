import { GrowthPhase } from '../../types/monitoring';
import { Plant } from '../../types/system';
import { 
  Leaf, Calendar, CheckCircle2, 
  AlertTriangle, Clock 
} from 'lucide-react';

interface GrowthPhaseTimelineProps {
  plant: Plant;
  phases: GrowthPhase[];
}

export function GrowthPhaseTimeline({ plant, phases }: GrowthPhaseTimelineProps) {
  const currentDate = new Date();
  const getCurrentPhase = () => {
    return phases.find(phase => {
      const start = new Date(phase.startDate);
      const end = new Date(phase.endDate);
      return currentDate >= start && currentDate <= end;
    });
  };

  const currentPhase = getCurrentPhase();

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Фазы роста</h3>
      <div className="relative">
        <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200" />
        
        {phases.map((phase, index) => {
          const start = new Date(phase.startDate);
          const end = new Date(phase.endDate);
          const isCurrentPhase = phase === currentPhase;
          const isPastPhase = currentDate > end;
          const isFuturePhase = currentDate < start;

          return (
            <div
              key={phase.name}
              className={`
                relative pl-10 pb-8 last:pb-0
                ${isCurrentPhase ? 'opacity-100' : 'opacity-70'}
              `}
            >
              <div className={`
                absolute left-0 w-8 h-8 rounded-full flex items-center justify-center
                ${isCurrentPhase ? 'bg-green-100' :
                  isPastPhase ? 'bg-gray-100' : 'bg-gray-50'}
              `}>
                {isPastPhase ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : isCurrentPhase ? (
                  <Leaf className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-400" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{phase.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {start.toLocaleDateString()} - {end.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {isCurrentPhase && phase.actualDuration && phase.actualDuration > phase.expectedDuration && (
                  <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-2 rounded">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">
                      Превышение ожидаемой длительности фазы на {
                        phase.actualDuration - phase.expectedDuration
                      } дней
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Температура:</p>
                    <p>{phase.requirements.temperature.min}-{phase.requirements.temperature.max}°C</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Влажность:</p>
                    <p>{phase.requirements.humidity.min}-{phase.requirements.humidity.max}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">pH:</p>
                    <p>{phase.requirements.phLevel.min}-{phase.requirements.phLevel.max}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Питательные вещества:</p>
                    <div className="flex flex-wrap gap-1">
                      {phase.requirements.nutrients.map(nutrient => (
                        <span
                          key={nutrient}
                          className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs"
                        >
                          {nutrient}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}