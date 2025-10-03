"use client";

import { useAssignment } from "@/context/AssignmentContext";
import { ProgressList } from "@/components/ProgressList";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EvaluationProgressPage() {
  const router = useRouter();
  const { submissions } = useAssignment();

  const total = submissions.length;
  const done = submissions.filter((s) => s.status === "done").length;
  const progress = total > 0 ? (done / total) * 100 : 0;

  useEffect(() => {
    if (total > 0 && done === total) {
      const t = setTimeout(() => router.push("/assignment/results"), 1000);
      return () => clearTimeout(t);
    }
  }, [done, total, router]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Evaluation in Progress
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              AI is evaluating submissions. This may take a few moments.
            </p>
          </div>
          {total > 0 && (
            <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-blue-600">Complete</div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-blue-500 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="font-semibold text-slate-900">
                Overall Progress
              </span>
            </div>
            <span className="text-sm font-medium text-slate-600">
              {done} of {total} Submissions
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{total}</div>
              <div className="text-xs text-blue-600">Total</div>
            </div>
            <div className="rounded-lg bg-orange-50 p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {total - done}
              </div>
              <div className="text-xs text-orange-600">Pending</div>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{done}</div>
              <div className="text-xs text-green-600">Done</div>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <ProgressList />
      </div>

      {/* Info Message */}
      {done < total && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-blue-500 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900">Please wait</h4>
              <p className="text-sm text-blue-700">
                Evaluation is in progress. You&apos;ll be automatically
                redirected when complete.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
