"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAssignment } from "@/context/AssignmentContext";

export default function DashboardPage() {
  const { history } = useAssignment();
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl p-8 text-white shadow-2xl hero-gradient">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-3">Welcome Back! 👋</h2>
              <p className="text-blue-100 text-lg mb-6">
                Evaluate student assignments instantly with AI-powered grading.
                Save time and provide consistent feedback.
              </p>
              <Link
                href="/assignment/setup"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--primary)",
                }}
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Assignment
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="hidden lg:flex gap-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 text-center min-w-[120px]">
                <div className="text-3xl font-bold">{history.length}</div>
                <div className="text-sm text-blue-100">Assignments</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 text-center min-w-[120px]">
                <div className="text-3xl font-bold">
                  {history.filter((h) => h.status === "completed").length}
                </div>
                <div className="text-sm text-blue-100">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute -left-8 -bottom-8 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/assignment/setup" className="group">
          <div
            className="card-hover rounded-xl border p-6 shadow-sm transition-all"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  New Assignment
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Create and setup
                </p>
              </div>
            </div>
          </div>
        </Link>

        <div
          className="card-hover rounded-xl border p-6 shadow-sm"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <svg
                className="h-6 w-6"
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
            <div>
              <h3
                className="font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Completed
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {history.filter((h) => h.status === "completed").length}{" "}
                assignments
              </p>
            </div>
          </div>
        </div>

        <div
          className="card-hover rounded-xl border p-6 shadow-sm"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3
                className="font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                In Progress
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {history.filter((h) => h.status === "pending").length}{" "}
                assignments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment History */}
      <div
        className="rounded-xl border shadow-sm overflow-hidden"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="border-b px-6 py-4"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--background)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Assignment History
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                All your previous assignments and evaluations
              </p>
            </div>
            {history.length > 0 && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {history.length} Total
              </span>
            )}
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              No assignments yet
            </h3>
            <p
              className="text-sm mb-6 max-w-md"
              style={{ color: "var(--text-muted)" }}
            >
              Get started by creating your first assignment. It only takes a
              minute!
            </p>
            <Link
              href="/assignment/setup"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:opacity-90"
              style={{
                backgroundColor: "var(--primary)",
                color: "white",
              }}
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Assignment
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className="border-b"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                }}
              >
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Assignment
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Created Date
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border)",
                }}
              >
                {history.map((h, index) => (
                  <tr
                    key={h.id}
                    className="transition-colors animate-slide-in cursor-pointer table-row-hover"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      backgroundColor: "var(--card-bg)",
                    }}
                    onClick={() => router.push(`/assignment/${h.id}`)}
                  >
                    <td className="px-6 py-4">
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {h.title}
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Assignment #{h.id.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {new Date(h.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          h.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {h.status === "completed" ? (
                          <>
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
                            Completed
                          </>
                        ) : (
                          <>
                            <svg
                              className="h-3 w-3 animate-spin"
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
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
