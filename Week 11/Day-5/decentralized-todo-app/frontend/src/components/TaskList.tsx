import { Task } from "./TodoApp";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  isLoading: boolean;
}

export function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  isLoading,
}: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id!)}
          onDelete={() => onDeleteTask(task.id!)}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
