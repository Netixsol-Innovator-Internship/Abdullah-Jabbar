import { useState } from "react";
import { Task } from "./TodoApp";
import { Check, Trash2, Calendar, Tag, Star } from "lucide-react";
import { clsx } from "clsx";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
  isLoading,
}: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "text-gray-500";
      case 2:
        return "text-blue-500";
      case 3:
        return "text-yellow-500";
      case 4:
        return "text-orange-500";
      case 5:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return "Very Low";
      case 2:
        return "Low";
      case 3:
        return "Medium";
      case 4:
        return "High";
      case 5:
        return "Very High";
      default:
        return "Medium";
    }
  };

  return (
    <div
      className={clsx(
        "border rounded-lg p-4 transition-all duration-200 hover:shadow-md",
        task.isCompleted
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          disabled={isLoading}
          className={clsx(
            "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            task.isCompleted
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500",
            isLoading && "opacity-50 cursor-not-allowed",
          )}
        >
          {task.isCompleted && <Check className="w-4 h-4" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={clsx(
                "text-lg font-medium break-words",
                task.isCompleted
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : "text-gray-900 dark:text-white",
              )}
            >
              {task.content}
            </h3>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={isLoading || isDeleting}
              className={clsx(
                "flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
                (isLoading || isDeleting) && "opacity-50 cursor-not-allowed",
              )}
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Task Metadata */}
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            {/* Creation Date */}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.createdAt)}</span>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-1">
              <Star
                className={clsx("w-3 h-3", getPriorityColor(task.priority))}
              />
              <span className={getPriorityColor(task.priority)}>
                {getPriorityLabel(task.priority)}
              </span>
            </div>

            {/* Category */}
            {task.category && task.category !== "General" && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                  {task.category}
                </span>
              </div>
            )}

            {/* Status Badge */}
            <div
              className={clsx(
                "px-2 py-1 rounded-full text-xs font-medium",
                task.isCompleted
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
              )}
            >
              {task.isCompleted ? "Completed" : "Pending"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
