"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import * as api from "@/lib/api";
import { ResultsTable } from "@/components/ResultsTable";
import { DownloadButton } from "@/components/DownloadButton";
import { SubmissionUploader } from "@/components/SubmissionUploader";

type Assignment = api.Assignment;
type Submission = api.Submission;

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(true);
  const [newMode, setNewMode] = useState<"strict" | "loose">("strict");
  const [showUploader, setShowUploader] = useState(false);

  // Load assignment and submissions
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // The assignment endpoint returns both assignment and submissions
        const response = await api.getAssignment(assignmentId);

        // Check if response has assignment and submissions structure
        if (
          response &&
          typeof response === "object" &&
          "assignment" in response &&
          "submissions" in response
        ) {
          const { assignment: assignmentData, submissions: submissionsData } =
            response as any;
          setAssignment(assignmentData);
          setSubmissions(submissionsData);
          setNewMode(assignmentData.mode);
        } else {
          // If it's just the assignment data, fetch submissions separately
          setAssignment(response);
          setNewMode(response.mode);
          const submissionsData = await api.getSubmissions(assignmentId);
          setSubmissions(submissionsData);
        }
      } catch (err) {
        console.error("Failed to load assignment data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    if (assignmentId) {
      loadData();
    }
  }, [assignmentId]);

  // Refresh submissions data
  const refreshSubmissions = async () => {
    try {
      const updatedSubmissions = await api.getSubmissions(assignmentId);
      setSubmissions(updatedSubmissions);
    } catch (err) {
      console.error("Failed to refresh submissions:", err);
    }
  };

  // Handle file upload completion
  const handleUploadComplete = () => {
    setShowUploader(false);
    refreshSubmissions();
  };

  // Handle submission deletion
  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      await api.deleteSubmission(assignmentId, submissionId);
      refreshSubmissions();
    } catch (err) {
      console.error("Failed to delete submission:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete submission"
      );
    }
  };

  // Handle reevaluation
  const handleReevaluate = async (reevaluateAll: boolean = false) => {
    if (!assignment) return;

    try {
      setIsEvaluating(true);
      setError(null);

      // If mode changed, update assignment first
      if (newMode !== assignment.mode) {
        await api.updateAssignmentMode(assignmentId, newMode);
        setAssignment({ ...assignment, mode: newMode });
      }

      // Start evaluation based on the type requested
      if (reevaluateAll) {
        await api.reevaluateAllSubmissions(assignmentId);
      } else {
        await api.evaluateAssignment(assignmentId);
      }

      // Poll for updated results
      let isPolling = true;
      const pollSubmissions = async () => {
        try {
          const updatedSubmissions = await api.getSubmissions(assignmentId);
          setSubmissions(updatedSubmissions);

          const allDone = updatedSubmissions.every(
            (s) => s.status === "evaluated" || s.status === "failed"
          );

          if (!allDone && isPolling) {
            setTimeout(pollSubmissions, 2000);
          } else {
            setIsEvaluating(false);
          }
        } catch (error) {
          console.error("Error polling submissions:", error);
          if (isPolling) {
            setTimeout(pollSubmissions, 2000);
          }
        }
      };

      pollSubmissions();

      // Stop polling after 5 minutes to prevent infinite polling
      setTimeout(
        () => {
          isPolling = false;
          setIsEvaluating(false);
        },
        5 * 60 * 1000
      );
    } catch (err) {
      console.error("Failed to reevaluate:", err);
      setError(err instanceof Error ? err.message : "Failed to reevaluate");
      setIsEvaluating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-slate-600">Loading assignment...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Assignment Not Found
        </h2>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const completedSubmissions = submissions.filter(
    (s) => s.status === "evaluated"
  ).length;
  const failedSubmissions = submissions.filter(
    (s) => s.status === "failed"
  ).length;
  const pendingSubmissions = submissions.filter(
    (s) => s.status === "pending"
  ).length;
  const averageScore =
    submissions
      .filter((s) => s.score !== undefined)
      .reduce((acc, s) => acc + (s.score || 0), 0) /
    Math.max(completedSubmissions, 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">
              {assignment.topic}
            </h1>
          </div>
          <p className="text-slate-600">
            Created on{" "}
            {new Date(assignment.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DownloadButton assignmentId={assignmentId} />
        </div>
      </div>

      {/* Assignment Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Assignment Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Instructions
                </label>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {assignment.instructions}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Word Count
                  </label>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <span className="text-slate-900 font-medium">
                      {assignment.wordCount || "Not specified"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Evaluation Mode
                  </label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`
                          relative flex cursor-pointer flex-col rounded-xl border-2 p-3 transition-all
                          ${
                            newMode === "strict"
                              ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="mode"
                          value="strict"
                          checked={newMode === "strict"}
                          onChange={() => setNewMode("strict")}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className={`
                              flex h-8 w-8 items-center justify-center rounded-lg
                              ${newMode === "strict" ? "bg-indigo-600" : "bg-slate-100"}
                            `}
                          >
                            <svg
                              className={`h-4 w-4 ${newMode === "strict" ? "text-white" : "text-slate-600"}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div
                              className={`font-medium text-sm ${newMode === "strict" ? "text-indigo-900" : "text-slate-900"}`}
                            >
                              Strict Mode
                            </div>
                            <div className="text-xs text-slate-600">
                              Rigorous evaluation
                            </div>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`
                          relative flex cursor-pointer flex-col rounded-xl border-2 p-3 transition-all
                          ${
                            newMode === "loose"
                              ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="mode"
                          value="loose"
                          checked={newMode === "loose"}
                          onChange={() => setNewMode("loose")}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className={`
                              flex h-8 w-8 items-center justify-center rounded-lg
                              ${newMode === "loose" ? "bg-indigo-600" : "bg-slate-100"}
                            `}
                          >
                            <svg
                              className={`h-4 w-4 ${newMode === "loose" ? "text-white" : "text-slate-600"}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div
                              className={`font-medium text-sm ${newMode === "loose" ? "text-indigo-900" : "text-slate-900"}`}
                            >
                              Loose Mode
                            </div>
                            <div className="text-xs text-slate-600">
                              Lenient evaluation
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Statistics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">
                    Total Submissions
                  </span>
                  <span className="font-semibold text-slate-900">
                    {submissions.length}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {completedSubmissions}
                  </span>
                </div>
              </div>

              {pendingSubmissions > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Pending</span>
                    <span className="font-semibold text-orange-600">
                      {pendingSubmissions}
                    </span>
                  </div>
                </div>
              )}

              {failedSubmissions > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Failed</span>
                    <span className="font-semibold text-red-600">
                      {failedSubmissions}
                    </span>
                  </div>
                </div>
              )}

              {completedSubmissions > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">
                      Average Score
                    </span>
                    <span className="font-semibold text-slate-900">
                      {averageScore.toFixed(1)}/100
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Management */}
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Manage Submissions
                </h3>
                <p className="text-sm text-slate-500">
                  Upload new submissions or manage existing ones
                </p>
              </div>
              <button
                onClick={() => setShowUploader(!showUploader)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {showUploader ? "Cancel Upload" : "Upload Files"}
              </button>
            </div>
          </div>

          {showUploader && (
            <div className="p-6">
              <SubmissionUploader
                assignmentId={assignmentId}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          )}
        </div>

        {/* Evaluation Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Evaluation Controls
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleReevaluate(false)}
                disabled={isEvaluating}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEvaluating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
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
                    <span>Evaluate Pending</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleReevaluate(true)}
                disabled={isEvaluating}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEvaluating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Reevaluate All</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-sm text-slate-600">
              <p>
                <strong>Evaluate Pending:</strong> Only evaluate submissions
                with &quot;pending&quot; status
              </p>
              <p>
                <strong>Reevaluate All:</strong> Re-evaluate all submissions
                regardless of current status
              </p>
            </div>
          </div>
        </div>

        {/* Submissions and Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Submissions & Results ({submissions.length})
            </h2>
          </div>

          {/* Custom Results Table for this assignment */}
          <AssignmentResultsTable
            submissions={submissions}
            onDeleteSubmission={handleDeleteSubmission}
          />
        </div>
      </div>
    </div>
  );
}

// Custom results table component for assignment details
function AssignmentResultsTable({
  submissions,
  onDeleteSubmission,
}: {
  submissions: Submission[];
  onDeleteSubmission: (submissionId: string) => void;
}) {
  // Adapt submissions to match the expected format for existing components
  const adaptedSubmissions = submissions.map((sub) => ({
    ...sub,
    rollNo: sub.rollNumber, // Map rollNumber to rollNo for compatibility
    remarks: sub.feedback || sub.remarks, // Use feedback if available, fallback to remarks
  }));

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "evaluated":
        return "bg-green-100 text-green-700";
      case "processing":
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="grid grid-cols-6 gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 text-sm font-semibold text-slate-700">
        <div>Student</div>
        <div>File Name</div>
        <div>Status</div>
        <div>Score</div>
        <div>Feedback</div>
        <div>Actions</div>
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
            No submissions found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Submissions will appear here after they are uploaded
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {submissions.map((submission, index) => (
            <div
              key={submission._id}
              className="grid grid-cols-6 gap-4 px-6 py-5 text-sm transition-colors hover:bg-slate-50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Student Info */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                  <span className="font-semibold text-sm">
                    {(submission.studentName || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {submission.studentName || "Unknown"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {submission.rollNumber || "No Roll No."}
                  </div>
                </div>
              </div>

              {/* File Name */}
              <div className="flex items-center">
                <span
                  className="truncate text-slate-700"
                  title={submission.fileName}
                >
                  {submission.fileName}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadge(submission.status)}`}
                >
                  {submission.status === "evaluated" && (
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {(submission.status === "processing" ||
                    submission.status === "in-progress") && (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  )}
                  {submission.status === "failed" && (
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="capitalize">{submission.status}</span>
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center">
                {submission.score !== undefined ? (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xl font-bold ${getScoreColor(submission.score)}`}
                    >
                      {submission.score}
                    </span>
                    <span className="text-slate-400">/100</span>
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${getScoreBadge(submission.score)}`}
                    >
                      {submission.score >= 85
                        ? "A+"
                        : submission.score >= 70
                          ? "B+"
                          : submission.score >= 50
                            ? "C+"
                            : "F"}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </div>

              {/* Feedback */}
              <div className="flex items-start">
                {submission.feedback || submission.remarks ? (
                  <div className="max-w-xs">
                    <p
                      className="text-slate-700 text-sm line-clamp-3"
                      title={submission.feedback || submission.remarks}
                    >
                      {submission.feedback || submission.remarks}
                    </p>
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">
                    No feedback available
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center">
                <button
                  onClick={() => onDeleteSubmission(submission._id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Delete submission"
                >
                  <svg
                    className="w-4 h-4"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
