"use client";

import { useAssignment } from "@/context/AssignmentContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as api from "@/lib/api";

export function AssignmentForm() {
  const router = useRouter();
  const { assignment, setAssignment, addHistoryEntry } = useAssignment();

  const [title, setTitle] = useState(assignment.title);
  const [instructions, setInstructions] = useState(assignment.instructions);
  const [mode, setMode] = useState<"strict" | "loose">(assignment.mode);
  const [wordCount, setWordCount] = useState(assignment.wordCount || 500);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      // Create assignment in backend immediately
      const createdAssignment = await api.createAssignment({
        topic: title,
        instructions,
        wordCount,
        mode,
      });

      // Update context
      setAssignment({ title, instructions, mode, wordCount });
      addHistoryEntry({
        title,
        status: "completed", // Since assignment is created, mark as completed
      });

      // Navigate to assignment detail page instead of upload page
      router.push(`/assignment/${createdAssignment._id}`);
    } catch (err) {
      console.error("Failed to create assignment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create assignment"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl animate-scale-in"
      onSubmit={onSubmit}
    >
      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Assignment Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            placeholder="e.g., Essay on Mental Health Awareness"
            required
          />
        </div>

        {/* Instructions Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Assignment Instructions
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            rows={6}
            placeholder='e.g., "Write a comprehensive essay on mental health awareness, covering causes, effects, and solutions. Include relevant statistics and examples."'
            required
          />
        </div>

        {/* Word Count Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Expected Word Count
          </label>
          <div className="relative">
            <input
              type="number"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value) || 500)}
              min="100"
              max="10000"
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              placeholder="500"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              words
            </span>
          </div>
        </div>

        {/* Evaluation Mode */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Evaluation Mode
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`
              relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all
              ${
                mode === "strict"
                  ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-600/10"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }
            `}
            >
              <input
                type="radio"
                name="mode"
                value="strict"
                checked={mode === "strict"}
                onChange={() => setMode("strict")}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div
                  className={`
                  flex h-10 w-10 items-center justify-center rounded-lg
                  ${mode === "strict" ? "bg-indigo-600" : "bg-slate-100"}
                `}
                >
                  <svg
                    className={`h-5 w-5 ${mode === "strict" ? "text-white" : "text-slate-600"}`}
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
                    className={`font-semibold ${mode === "strict" ? "text-indigo-900" : "text-slate-900"}`}
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
              relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all
              ${
                mode === "loose"
                  ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-600/10"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }
            `}
            >
              <input
                type="radio"
                name="mode"
                value="loose"
                checked={mode === "loose"}
                onChange={() => setMode("loose")}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <div
                  className={`
                  flex h-10 w-10 items-center justify-center rounded-lg
                  ${mode === "loose" ? "bg-indigo-600" : "bg-slate-100"}
                `}
                >
                  <svg
                    className={`h-5 w-5 ${mode === "loose" ? "text-white" : "text-slate-600"}`}
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
                    className={`font-semibold ${mode === "loose" ? "text-indigo-900" : "text-slate-900"}`}
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

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-2 text-red-700">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Error</span>
          </div>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isCreating}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Creating Assignment...</span>
            </>
          ) : (
            <>
              <span>Create Assignment</span>
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
