"use client";

import { useQuestions } from "@/hooks/useApi";
import { Question } from "@/types";
import Link from "next/link";
import {
  ClockIcon,
  ArrowRightIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

function QuestionCard({ question }: { question: Question }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-900 mb-3 line-clamp-3">
            {question.questionText}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {new Date(question.createdAt).toLocaleDateString()}
            </div>
            <span>•</span>
            <span>{new Date(question.createdAt).toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          {question.traceId ? (
            <Link
              href={`/results/${question.traceId}`}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
            >
              View Results
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Link>
          ) : (
            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md">
              No Results
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { questions, isLoading, error, mutate } = useQuestions();

  const handleRefresh = () => {
    mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h1 className="text-lg font-medium text-red-800 mb-2">
              Error Loading History
            </h1>
            <p className="text-red-700 mb-4">
              {error && typeof error === "object" && "message" in error
                ? (error as Error).message
                : "Failed to load question history. Please try again."}
            </p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Try Again
            </button>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Question History
              </h1>
              <p className="text-gray-600">
                View all your previous research questions and their results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {questions?.length || 0} questions
              </span>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {questions && questions.length > 0 ? (
          <div className="space-y-6">
            {questions
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BeakerIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              No Questions Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven&apos;t asked any research questions yet. Start by asking
              your first question!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Ask Your First Question
            </Link>
          </div>
        )}

        {/* Call to Action */}
        {questions && questions.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready for Another Question?
            </h3>
            <p className="text-indigo-100 mb-6">
              Continue your research journey with our AI-powered workflow
              assistant
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-white/20 text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
            >
              Ask New Question
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
