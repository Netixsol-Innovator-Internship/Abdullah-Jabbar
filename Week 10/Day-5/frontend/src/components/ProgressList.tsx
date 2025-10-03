"use client";

import { useAssignment } from "@/context/AssignmentContext";

export function ProgressList() {
  const { submissions } = useAssignment();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-3 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700">
        <div>Student Name</div>
        <div>Roll Number</div>
        <div>Status</div>
      </div>
      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <svg
              className="h-8 w-8 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-500">No submissions in progress.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {submissions.map((s, index) => (
            <div
              key={s.id}
              className="grid grid-cols-3 items-center gap-4 px-6 py-4 text-sm transition-colors hover:bg-slate-50 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="truncate font-medium text-slate-900">
                  {s.studentName || "Unknown"}
                </span>
              </div>

              <div className="text-slate-600">{s.rollNo || "N/A"}</div>

              <div className="flex items-center gap-2">
                {s.status === "processing" || s.status === "pending" ? (
                  <>
                    <div className="flex h-2 w-2 items-center justify-center">
                      <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                    <span className="font-medium text-blue-600">
                      Processing...
                    </span>
                  </>
                ) : s.status === "failed" ? (
                  <>
                    <span className="inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                    <span className="font-medium text-red-600">Failed</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium text-green-600">Complete</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
