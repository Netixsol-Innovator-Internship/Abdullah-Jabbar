"use client";

import { Answer } from "@/types";
import { useState } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

interface AnswerCardProps {
  answer: Answer;
  isLoading?: boolean;
}

export function AnswerCard({ answer, isLoading }: AnswerCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer.finalAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            Answer Pending
          </h3>
          <p className="text-yellow-700">
            The final answer is being generated. Please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Final Answer</h2>
          <button
            onClick={handleCopy}
            className="inline-flex items-center px-3 py-2 border border-white/20 rounded-md text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
            {answer.finalAnswer}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Generated on {new Date(answer.createdAt).toLocaleString()}
            </span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              ID: {answer._id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
