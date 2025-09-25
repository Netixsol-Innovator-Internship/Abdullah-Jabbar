"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { TraceViewer } from "@/components/TraceViewer";
import type { Trace, TraceStep } from "@/types";

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data.trace; // Extract trace from the response
};

export default function ResultsPage() {
  const params = useParams();
  const traceId = params.traceId as string;

  const [copied, setCopied] = useState(false);

  // Fetch trace data using SWR
  const {
    data: trace,
    isLoading: traceLoading,
    error: traceError,
    mutate: refreshTrace,
  } = useSWR<Trace>(traceId ? `/trace/${traceId}` : null, fetcher);

  const handleRefresh = () => {
    refreshTrace();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Extract final answer from trace steps, prioritizing full output over snippet
  const getFinalAnswer = (): string | null => {
    if (!trace?.steps || !Array.isArray(trace.steps)) return null;

    // Look for the last step that has output with text or result
    const finalStep = trace.steps
      .filter(
        (step: TraceStep) =>
          (step.output && typeof step.output === "string") || step.outputSnippet
      )
      .pop();

    // Prioritize full output over truncated snippet
    return (
      (typeof finalStep?.output === "string" ? finalStep.output : null) ||
      finalStep?.outputSnippet ||
      null
    );
  };

  const finalAnswer = getFinalAnswer();

  if (traceLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (traceError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h1 className="text-lg font-medium text-red-800 mb-2">
              Error Loading Data
            </h1>
            <p className="text-red-700">
              {traceError?.message || "Failed to load data. Please try again."}
            </p>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trace) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Trace Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The requested trace could not be found.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Question Analysis Results
            </h1>
            <p className="text-gray-600">
              Trace ID: <span className="font-mono text-sm">{trace._id}</span>
            </p>
          </div>

          {finalAnswer && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-green-800">
                  Final Answer
                </h2>
                <button
                  onClick={() => copyToClipboard(finalAnswer)}
                  className="inline-flex items-center px-2 py-1 text-sm text-green-700 hover:text-green-900"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-green-700 whitespace-pre-wrap">
                {finalAnswer}
              </p>
            </div>
          )}
        </div>

        {/* Trace Viewer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Processing Steps
            </h2>
            <p className="text-gray-600 mt-1">
              Detailed trace of the analysis workflow
            </p>
          </div>
          <div className="p-6">
            <TraceViewer steps={trace.steps || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
