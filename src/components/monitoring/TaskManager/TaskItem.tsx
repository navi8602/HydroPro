// src/components/monitoring/TaskManager/TaskItem.tsx
import { formatDistance, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { MaintenanceTask } from '../../../types/monitoring';

interface TaskItemProps {
    task: MaintenanceTask;
    onComplete: (id: string) => void;
    onReschedule: (id: string, date: Date) => void;
}

export function TaskItem({
                             task,
                             onComplete,
                             onReschedule
                         }: TaskItemProps) {
    const isOverdue = isBefore(new Date(task.dueDate), new Date());

    return (
        <div className={`
      p-4 rounded-lg border
      ${task.completed ? 'bg-gray-50 border-gray-200' :
            isOverdue ? 'bg-red-50 border-red-200' :
                'bg-white border-gray-200'}
    `}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>

                    <div className="flex items-center space-x-4 mt-2 text-sm">
            <span className="text-gray-500">
              Срок: {formatDistance(
                new Date(task.dueDate),
                new Date(),
                { addSuffix: true, locale: ru }
            )}
            </span>

                        {task.assignedTo && (
                            <span className="text-gray-500">
                Исполнитель: {task.assignedTo}
              </span>
                        )}
                    </div>
                </div>

                {!task.completed && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onComplete(task.id)}
                            className="btn-success-sm"
                        >
                            Выполнено
                        </button>

                        <button
                            onClick={() => {
                                const date = new Date();
                                date.setDate(date.getDate() + 1);
                                onReschedule(task.id, date);
                            }}
                            className="btn-secondary-sm"
                        >
                            Перенести
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
