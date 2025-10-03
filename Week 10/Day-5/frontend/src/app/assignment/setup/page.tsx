"use client";

import { AssignmentForm } from "@/components/AssignmentForm";

import Link from "next/link";

export default function AssignmentSetupPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Create Assignment
          </h2>
          <p className="text-sm text-slate-500">
            Set up your assignment parameters and evaluation criteria
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-600">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
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
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="font-medium text-slate-900">Setup Assignment</span>
      </nav>

      {/* Form */}
      <AssignmentForm />
    </div>
  );
}
