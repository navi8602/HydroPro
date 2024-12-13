// src/utils/maintenance.ts
import type { MaintenanceTask } from '../types/monitoring';

export function getUpcomingTasks(tasks: MaintenanceTask[]): MaintenanceTask[] {
    const now = new Date();
    return tasks
        .filter(task => !task.completed && new Date(task.dueDate) > now)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export function getOverdueTasks(tasks: MaintenanceTask[]): MaintenanceTask[] {
    const now = new Date();
    return tasks
        .filter(task => !task.completed && new Date(task.dueDate) < now)
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
}
