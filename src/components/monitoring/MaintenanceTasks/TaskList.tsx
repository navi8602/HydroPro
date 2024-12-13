// src/components/monitoring/MaintenanceTasks/TaskList.tsx
import { TaskItem } from './TaskItem';
import { TaskFilter } from './TaskFilter';
import type { MaintenanceTask } from '../../../types/monitoring';

interface TaskListProps {
    tasks: MaintenanceTask[];
    onComplete: (taskId: string) => void;
}

export function TaskList({ tasks, onComplete }: TaskListProps) {
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-medium">Задачи обслуживания</h3>
                <TaskFilter value={filter} onChange={setFilter} />
            </div>

            <div className="space-y-3">
                {filteredTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onComplete={onComplete}
                    />
                ))}
            </div>
        </div>
    );
}
