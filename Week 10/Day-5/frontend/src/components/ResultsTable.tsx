"use client";

import { useAssignment } from "@/context/AssignmentContext";

export function ResultsTable() {
  const { submissions } = useAssignment();

  const getScoreColor = (score?: number) => {
    if (!score) return "text-slate-600";
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBadge = (score?: number) => {
    if (!score) return "";
    if (score >= 85) return "bg-green-100 text-green-700";
    if (score >= 70) return "bg-blue-100 text-blue-700";
    if (score >= 50) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="grid grid-cols-4 gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 text-sm font-semibold text-slate-700">
        <div>Student Name</div>
        <div>Roll Number</div>
        <div>Score</div>
        <div>Feedback</div>
      </div>
      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
            <svg
              className="h-12 w-12 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-slate-900">
            No results to display
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Results will appear here after evaluation is complete
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {submissions.map((s, index) => (
            <div
              key={s.id}
              className="grid grid-cols-4 gap-4 px-6 py-5 text-sm transition-colors hover:bg-slate-50 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                  <span className="font-semibold text-sm">
                    {(s.studentName || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="truncate font-medium text-slate-900">
                  {s.studentName || "Unknown"}
                </span>
              </div>

              <div className="flex items-center text-slate-600">
                {s.rollNo || "N/A"}
              </div>

              <div className="flex items-center">
                {s.score !== undefined ? (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl font-bold ${getScoreColor(s.score)}`}
                    >
                      {s.score}
                    </span>
                    <span className="text-slate-400">/100</span>
                    <span
                      className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${getScoreBadge(s.score)}`}
                    >
                      {s.score >= 85
                        ? "Excellent"
                        : s.score >= 70
                          ? "Good"
                          : s.score >= 50
                            ? "Pass"
                            : "Needs Work"}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </div>

              <div className="flex items-center">
                {s.remarks ? (
                  <p className="text-slate-700 line-clamp-2">{s.remarks}</p>
                ) : (
                  <span className="text-slate-400">No feedback available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
