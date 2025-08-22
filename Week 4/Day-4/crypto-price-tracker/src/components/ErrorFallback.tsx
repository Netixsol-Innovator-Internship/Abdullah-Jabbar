// file: src/components/ErrorFallback.tsx
"use client";

export default function ErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div role="alert" className="p-4 rounded-lg border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-200">
      <p className="font-medium dark:text-gray-800">Something went wrong.</p>
      <p className="text-sm text-red-700 ">Please retry or check your connection.</p>
      {onRetry && (
        <button
          className="mt-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-500 dark:text-gray-800"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}
