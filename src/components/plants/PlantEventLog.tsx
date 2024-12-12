import { useState } from 'react';
import { PlantEvent } from '../../types/plants';
import { formatDateTime } from '../../utils/date';
import { 
  Droplets, Scissors, Beaker, AlertTriangle,
  FileText, Calendar, ChevronDown, ChevronUp 
} from 'lucide-react';

interface PlantEventLogProps {
  events: PlantEvent[];
  onAddEvent: (event: Omit<PlantEvent, 'id'>) => void;
}

const EVENT_ICONS = {
  watering: Droplets,
  harvesting: Calendar,
  pruning: Scissors,
  fertilizing: Beaker,
  issue: AlertTriangle,
  note: FileText
} as const;

const EVENT_LABELS = {
  watering: 'Полив',
  harvesting: 'Сбор урожая',
  pruning: 'Обрезка',
  fertilizing: 'Подкормка',
  issue: 'Проблема',
  note: 'Заметка'
} as const;

export function PlantEventLog({ events, onAddEvent }: PlantEventLogProps) {
  const [showAll, setShowAll] = useState(false);
  const [newEventType, setNewEventType] = useState<PlantEvent['type']>('note');
  const [newEventDescription, setNewEventDescription] = useState('');

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const displayedEvents = showAll ? sortedEvents : sortedEvents.slice(0, 3);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventDescription.trim()) return;

    onAddEvent({
      plantId: events[0]?.plantId || '',
      type: newEventType,
      timestamp: new Date().toISOString(),
      description: newEventDescription.trim()
    });

    setNewEventDescription('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddEvent} className="space-y-3">
        <div className="flex gap-2">
          <select
            value={newEventType}
            onChange={(e) => setNewEventType(e.target.value as PlantEvent['type'])}
            className="rounded-md border-gray-300 text-sm"
          >
            {Object.entries(EVENT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input
            type="text"
            value={newEventDescription}
            onChange={(e) => setNewEventDescription(e.target.value)}
            placeholder="Описание события..."
            className="flex-1 rounded-md border-gray-300 text-sm"
          />
          <button
            type="submit"
            disabled={!newEventDescription.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm
                     hover:bg-indigo-700 disabled:bg-gray-300"
          >
            Добавить
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {displayedEvents.map((event) => {
          const Icon = EVENT_ICONS[event.type];
          return (
            <div
              key={event.id}
              className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <div className={`
                p-2 rounded-lg
                ${event.type === 'issue' ? 'bg-red-100' :
                  event.type === 'harvesting' ? 'bg-green-100' : 'bg-gray-100'}
              `}>
                <Icon className={`h-4 w-4
                  ${event.type === 'issue' ? 'text-red-600' :
                    event.type === 'harvesting' ? 'text-green-600' : 'text-gray-600'}
                `} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium text-sm">
                    {EVENT_LABELS[event.type]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDateTime(event.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {events.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Показать меньше
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Показать все ({events.length})
            </>
          )}
        </button>
      )}
    </div>
  );
}
