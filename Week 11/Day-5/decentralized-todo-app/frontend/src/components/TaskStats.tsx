import { BarChart3, CheckCircle, Clock, ListTodo } from "lucide-react";

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

export function TaskStats({ stats }: TaskStatsProps) {
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statItems = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: BarChart3,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        📊 Your Task Statistics
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-full ${item.bg} mb-3`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {item.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Progress
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {stats.completed} of {stats.total} tasks completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Motivational Message */}
      {stats.total > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            {completionRate === 100
              ? "🎉 Congratulations! You've completed all your tasks!"
              : completionRate >= 75
                ? "🚀 You're doing great! Keep up the momentum!"
                : completionRate >= 50
                  ? "💪 You're halfway there! You've got this!"
                  : completionRate > 0
                    ? "🌟 Good start! Every task completed is progress!"
                    : "📝 Ready to tackle your first task?"}
          </p>
        </div>
      )}
    </div>
  );
}
