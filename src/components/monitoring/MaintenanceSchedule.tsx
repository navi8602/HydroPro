import { MaintenanceTask } from '../../types/monitoring';
import { 
  Calendar, CheckCircle2, Clock, 
  Droplets, Scissors, Trash2, 
  RefreshCw, FileText 
} from 'lucide-react';

interface MaintenanceScheduleProps {
  tasks: MaintenanceTask[];
  onCompleteTask: (taskId: string) => void;
}

const TASK_ICONS = {
  watering: Droplets,
  pruning: Scissors,
  harvesting: Calendar,
  cleaning: RefreshCw,
  nutrientChange: FileText
} as const;

const TASK_LABELS = {
  watering: 'Полив',
  pruning: 'Обрезка',
  harvesting: 'Сбор урожая',
  cleaning: 'Очистка системы',
  nutrientChange: 'Замена раствора'
} as const;

export function MaintenanceSchedule({ 
  tasks, 
  onCompleteTask 
}: MaintenanceScheduleProps) {
  const today = new Date();
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const isOverdue = (date: string) => {
    return new Date(date) < today && !isToday(date);
  };

  const isToday = (date: string) => {
    const taskDate = new Date(date);
    return taskDate.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">График обслуживания</h3>
        <span className="text-sm text-gray-500">
          {tasks.filter(t => !t.completed).length} активных задач
        </span>
      </div>

      <div className="space-y-2">
        {sortedTasks.map(task => {
          const Icon = TASK_ICONS[task.type];
          const isTaskOverdue = isOverdue(task.dueDate);
          const isTaskToday = isToday(task.dueDate);

          return (
            <div
              key={task.id}
              className={`
                flex items-center justify-between p-3 rounded-lg
                ${task.completed 
                  ? 'bg-gray-50' 
                  : isTaskOverdue 
                    ? 'bg-red-50'
                    : isTaskToday 
                      ? 'bg-green-50' 
                      : 'bg-white border border-gray-200'}
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-lg
                  ${task.completed 
                    ? 'bg-gray-100' 
                    : isTaskOverdue 
                      ? 'bg-red-100'
                      : isTaskToday 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'}
                `}>
                  <Icon className={`
                    h-5 w-5
                    ${task.completed 
                      ? 'text-gray-500' 
                      : isTaskOverdue 
                        ? 'text-red-600'
                        : isTaskToday 
                          ? 'text-green-600' 
                          : 'text-gray-600'}
                  `} />
                </div>

                <div>
                  <p className="font-medium">
                    {TASK_LABELS[task.type]}
                    {task.notes && (
                      <span className="ml-2 font-normal text-sm text-gray-500">
                        {task.notes}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    {task.completed ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Выполнено {new Date(task.completedAt!).toLocaleString()}
                      </span>
                    ) : (
                      isTaskOverdue && (
                        <span className="flex items-center text-red-600">
                          <Clock className="h-4 w-4 mr-1" />
                          Просрочено
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {!task.completed && (
                <button
                  onClick={() => onCompleteTask(task.id)}
                  className="flex items-center px-3 py-1 text-sm font-medium 
                           text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Выполнить
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}