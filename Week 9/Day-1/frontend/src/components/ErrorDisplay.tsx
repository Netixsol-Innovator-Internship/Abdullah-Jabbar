"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

export function ErrorDisplay({
  title = "Something went wrong",
  message = "An error occurred while loading data. Please try again.",
  onRetry,
  children,
}: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-800 mb-2">{title}</h3>
      <p className="text-red-700 mb-4">{message}</p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
