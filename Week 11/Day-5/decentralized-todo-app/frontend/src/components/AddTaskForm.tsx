import { useState } from "react";
import { Plus, Loader2, Star } from "lucide-react";
import { clsx } from "clsx";

interface AddTaskFormProps {
  onCreateTask: (content: string, priority: number, category: string) => void;
  isLoading: boolean;
}

export function AddTaskForm({ onCreateTask, isLoading }: AddTaskFormProps) {
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<number>(3);
  const [category, setCategory] = useState("General");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    onCreateTask(content.trim(), priority, category);
    setContent("");
    setPriority(3);
    setCategory("General");
    setShowAdvanced(false);
  };

  const priorityOptions = [
    { value: 1, label: "Very Low", color: "text-gray-500" },
    { value: 2, label: "Low", color: "text-blue-500" },
    { value: 3, label: "Medium", color: "text-yellow-500" },
    { value: 4, label: "High", color: "text-orange-500" },
    { value: 5, label: "Very High", color: "text-red-500" },
  ];

  const categoryOptions = [
    "General",
    "Work",
    "Personal",
    "Shopping",
    "Health",
    "Education",
    "Finance",
    "Travel",
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        📝 Add New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Content Input */}
        <div>
          <label
            htmlFor="task-content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Task Description *
          </label>
          <textarea
            id="task-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you need to do?"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            disabled={isLoading}
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {content.length}/500 characters
          </p>
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showAdvanced ? "Hide" : "Show"} advanced options
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {/* Priority Selection */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Priority Level
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                disabled={isLoading}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <Star
                  className={clsx(
                    "w-3 h-3",
                    priorityOptions.find((p) => p.value === priority)?.color
                  )}
                />
                <span
                  className={clsx(
                    priorityOptions.find((p) => p.value === priority)?.color
                  )}
                >
                  {priorityOptions.find((p) => p.value === priority)?.label}
                </span>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                disabled={isLoading}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className={clsx(
            "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200",
            isLoading || !content.trim()
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:scale-105"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Task...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Create Task
            </>
          )}
        </button>
      </form>

      {/* Blockchain Info */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-300">
          🔗 <strong>Blockchain Transaction:</strong> Your task will be
          permanently stored on the blockchain. This operation requires a small
          gas fee and may take a few seconds to complete.
        </p>
      </div>
    </div>
  );
}
