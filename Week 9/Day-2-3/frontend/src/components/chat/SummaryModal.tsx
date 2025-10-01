"use client";

import React from "react";
import { SummaryRecord } from "../../utils/api";

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: SummaryRecord | null;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  summary,
}) => {
  if (!isOpen || !summary) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">💭</span>
            Conversation Summary
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {summary.summarizedMemory}
            </p>
          </div>

          {/* Metadata */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Summary Created:</strong>{" "}
              {summary.lastUpdated
                ? new Date(summary.lastUpdated).toLocaleString()
                : "Unknown"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This summary helps maintain context across conversations and
              improves the AI&apos;s understanding of your chat history.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
