"use client";

import { TraceStep } from "@/types";
import {
  CheckCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface TraceViewerProps {
  steps: TraceStep[];
}

const getStepType = (node: string): string => {
  if (node.includes("splitter")) return "splitter";
  if (node.includes("finder")) return "finder";
  if (node.includes("ranker")) return "ranker";
  if (node.includes("summarizer")) return "summarizer";
  if (node.includes("crosschecker")) return "crosschecker";
  if (node.includes("finalwriter")) return "finalwriter";
  return "unknown";
};

const stepTypeNames: Record<string, string> = {
  splitter: "Document Splitter",
  finder: "Document Finder",
  ranker: "Content Ranker",
  summarizer: "Summarizer",
  crosschecker: "Cross Checker",
  finalwriter: "Final Writer",
  unknown: "Processing Step",
};

const stepTypeColors: Record<string, string> = {
  splitter: "bg-blue-100 text-blue-800",
  finder: "bg-green-100 text-green-800",
  ranker: "bg-yellow-100 text-yellow-800",
  summarizer: "bg-purple-100 text-purple-800",
  crosschecker: "bg-pink-100 text-pink-800",
  finalwriter: "bg-indigo-100 text-indigo-800",
  unknown: "bg-gray-100 text-gray-800",
};

function StepCard({ step, index }: { step: TraceStep; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const stepType = getStepType(step.node);
  const isCompleted =
    step.output !== undefined ||
    step.outputSnippet !== undefined ||
    step.outputCount !== undefined;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                {index + 1}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {stepTypeNames[stepType] || step.node}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stepTypeColors[stepType] || stepTypeColors.unknown}`}
                >
                  {step.node}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ClockIcon className="h-5 w-5 text-gray-400" />
            )}
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="space-y-4">
            {/* Input */}
            {step.input !== undefined && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Input:
                </h4>
                <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
                  {typeof step.input === "string"
                    ? step.input
                    : JSON.stringify(step.input, null, 2)}
                </pre>
              </div>
            )}

            {/* Input Snippet */}
            {step.inputSnippet && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Input Snippet:
                </h4>
                <div className="bg-white p-3 rounded border">
                  <pre className="text-xs whitespace-pre-wrap">
                    {step.inputSnippet}
                  </pre>
                </div>
              </div>
            )}

            {/* Output */}
            {step.output !== undefined && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Output:
                </h4>
                <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
                  {typeof step.output === "string"
                    ? step.output
                    : JSON.stringify(step.output, null, 2)}
                </pre>
              </div>
            )}

            {/* Output Snippet */}
            {step.outputSnippet && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Output Snippet:
                </h4>
                <div className="bg-white p-3 rounded border">
                  <pre className="text-xs whitespace-pre-wrap">
                    {step.outputSnippet}
                  </pre>
                </div>
              </div>
            )}

            {/* Output Count */}
            {step.outputCount !== undefined && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Results Found:
                </h4>
                <div className="bg-white p-3 rounded border">
                  <span className="text-sm">{step.outputCount} documents</span>
                </div>
              </div>
            )}

            {/* Input Summaries Count */}
            {step.inputSummariesCount !== undefined && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Summaries Processed:
                </h4>
                <div className="bg-white p-3 rounded border">
                  <span className="text-sm">
                    {step.inputSummariesCount} summaries
                  </span>
                </div>
              </div>
            )}

            {/* Results */}
            {step.results && step.results.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Ranking Results:
                </h4>
                <div className="space-y-2">
                  {step.results.map((result, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded border flex justify-between"
                    >
                      <span className="text-xs text-gray-600">
                        Doc ID: {result.id}
                      </span>
                      <span className="text-xs font-medium">
                        Score: {result.score.toFixed(4)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function TraceViewer({ steps }: TraceViewerProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Waiting for workflow steps...
        </h3>
        <p className="text-gray-500">
          The workflow is being processed. Steps will appear here as they
          complete.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Workflow Steps</h2>
        <span className="text-sm text-gray-500">{steps.length} steps</span>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <StepCard key={`${step.node}-${index}`} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}
