import { clsx } from "clsx";
import { ListTodo, Clock, CheckCircle } from "lucide-react";

interface TaskFiltersProps {
  currentFilter: "all" | "pending" | "completed";
  onFilterChange: (filter: "all" | "pending" | "completed") => void;
  taskCounts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export function TaskFilters({
  currentFilter,
  onFilterChange,
  taskCounts,
}: TaskFiltersProps) {
  const filters = [
    {
      key: "all" as const,
      label: "All Tasks",
      icon: ListTodo,
      count: taskCounts.all,
      color: "blue",
    },
    {
      key: "pending" as const,
      label: "Pending",
      icon: Clock,
      count: taskCounts.pending,
      color: "yellow",
    },
    {
      key: "completed" as const,
      label: "Completed",
      icon: CheckCircle,
      count: taskCounts.completed,
      color: "green",
    },
  ];

  const getFilterStyles = (
    filterKey: string,
    color: string,
    isActive: boolean
  ) => {
    const baseStyles =
      "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md";

    if (isActive) {
      switch (color) {
        case "blue":
          return `${baseStyles} bg-blue-600 text-white shadow-lg`;
        case "yellow":
          return `${baseStyles} bg-yellow-600 text-white shadow-lg`;
        case "green":
          return `${baseStyles} bg-green-600 text-white shadow-lg`;
        default:
          return `${baseStyles} bg-gray-600 text-white shadow-lg`;
      }
    }

    return `${baseStyles} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-${color}-300 dark:hover:border-${color}-600`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🔍 Filter Tasks
      </h2>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={getFilterStyles(
              filter.key,
              filter.color,
              currentFilter === filter.key
            )}
          >
            <filter.icon className="w-5 h-5" />
            <span>{filter.label}</span>
            <span
              className={clsx(
                "px-2 py-1 rounded-full text-xs font-bold min-w-[20px] flex items-center justify-center",
                currentFilter === filter.key
                  ? "bg-white/20 text-white"
                  : filter.color === "blue"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    : filter.color === "yellow"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                      : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
              )}
            >
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Description */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {currentFilter === "all" && (
            <>
              📋 Showing all your tasks. Total:{" "}
              <strong>{taskCounts.all}</strong>
            </>
          )}
          {currentFilter === "pending" && (
            <>
              ⏳ Showing tasks that need your attention. Pending:{" "}
              <strong>{taskCounts.pending}</strong>
            </>
          )}
          {currentFilter === "completed" && (
            <>
              ✅ Showing your accomplished tasks. Completed:{" "}
              <strong>{taskCounts.completed}</strong>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
