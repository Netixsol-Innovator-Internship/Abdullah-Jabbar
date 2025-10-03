"use client";

import { FileUploader } from "@/components/FileUploader";
import { useAssignment } from "@/context/AssignmentContext";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function UploadSubmissionsPage() {
  const router = useRouter();
  const {
    submissions,
    removeSubmission,
    startEvaluation,
    assignment,
    isLoading,
    error,
  } = useAssignment();

  const canStart = useMemo(
    () => submissions.length > 0 && assignment.title.trim().length > 0,
    [submissions, assignment.title]
  );

  const onStart = async () => {
    await startEvaluation();
    // Only navigate if no error occurred
    if (!error) {
      router.push("/assignment/progress");
    }
  };

  return (
    <div className="space-y-6">
      {/* Migration Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <svg
            className="h-6 w-6 text-blue-600 mt-0.5"
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
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              New Workflow Available
            </h3>
            <p className="text-blue-700 mb-4">
              You can now create assignments independently and manage
              submissions separately. This provides more flexibility to
              add/remove submissions and evaluate multiple times.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/assignment/setup")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Assignment
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                View Existing Assignments
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Legacy Upload Flow */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm opacity-75">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Legacy Upload Flow
          </h2>
          <p className="text-sm text-slate-500">
            Continue with the old workflow if needed (creates assignment +
            uploads + evaluates together).
          </p>
        </div>

        {/* Page Header */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Upload Student Submissions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Upload PDF files. Student names and roll numbers will be
                auto-detected from filenames.
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <svg
                  className="h-5 w-5 text-blue-500"
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
                <span>
                  Filename format:{" "}
                  <code className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700">
                    StudentName_RollNumber.pdf
                  </code>
                </span>
              </div>
            </div>
            {submissions.length > 0 && (
              <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {submissions.length}
                </div>
                <div className="text-xs text-blue-600">Files Ready</div>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="animate-slide-in rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-red-500 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="font-semibold text-red-900">Upload Error</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* File Uploader */}
        <FileUploader />

        {/* Uploaded Files List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
            <h3 className="font-semibold text-slate-900">Uploaded Files</h3>
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-900 mb-1">
                No files uploaded yet
              </h3>
              <p className="text-sm text-slate-500">
                Upload PDF files using the area above
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {submissions.map((s, index) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50 animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-1 items-center gap-4">
                    {/* File Icon */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {s.fileName || s.file?.name || "Unknown file"}
                      </p>
                      <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-4 w-4"
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
                          {s.studentName || "Unknown"}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          {s.rollNo || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeSubmission(s.id)}
                    className="ml-4 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 hover:border-red-300"
                    title="Remove file"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg
              className="h-5 w-5 text-slate-400"
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
            <span>
              {submissions.length > 0
                ? `${submissions.length} file${submissions.length > 1 ? "s" : ""} ready for evaluation`
                : "Upload files to continue"}
            </span>
          </div>

          <button
            disabled={!canStart || isLoading}
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
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
                Starting Evaluation...
              </>
            ) : (
              <>
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Start Evaluation
              </>
            )}
          </button>
        </div>
      </div>{" "}
      {/* End Legacy Upload Flow */}
    </div>
  );
}
