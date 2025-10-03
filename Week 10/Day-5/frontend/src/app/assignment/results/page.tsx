"use client";

import { useAssignment } from "@/context/AssignmentContext";
import { ResultsTable } from "@/components/ResultsTable";
import { DownloadButton } from "@/components/DownloadButton";
import Link from "next/link";

export default function ResultsPage() {
  const { submissions, assignment } = useAssignment();

  const avgScore =
    submissions.length > 0
      ? Math.round(
          submissions.reduce((sum, s) => sum + (s.score || 0), 0) /
            submissions.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="3" />
              </svg>
              Evaluation Complete
            </div>
            <h2 className="text-3xl font-bold mt-2">Results</h2>
            <p className="mt-2 text-green-100">
              {assignment.title
                ? assignment.title
                : "Assignment Evaluation Results"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-100">
              Average Score
            </div>
            <div className="text-5xl font-bold">{avgScore}</div>
            <div className="text-green-100">out of 100</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Submissions
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {submissions.length}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Passed (≥50)</p>
              <p className="mt-1 text-3xl font-bold text-green-600">
                {submissions.filter((s) => (s.score || 0) >= 50).length}
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <svg
                className="h-6 w-6 text-green-600"
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
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Excellence (≥85)
              </p>
              <p className="mt-1 text-3xl font-bold text-indigo-600">
                {submissions.filter((s) => (s.score || 0) >= 85).length}
              </p>
            </div>
            <div className="rounded-lg bg-indigo-100 p-3">
              <svg
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Export Results</p>
            <p className="text-sm text-slate-500">
              Download marks sheet in your preferred format
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <DownloadButton />
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 transition-all hover:border-slate-300 hover:shadow-md"
          >
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>
        </div>
      </div>

      {/* Results Table */}
      <ResultsTable />
    </div>
  );
}
