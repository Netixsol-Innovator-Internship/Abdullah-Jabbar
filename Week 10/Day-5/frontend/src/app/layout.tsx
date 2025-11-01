"use client";

import Link from "next/link";
import "./globals.css";
import { ReactNode } from "react";
import { AssignmentProvider } from "@/context/AssignmentContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className="min-h-screen"
        style={{ background: "var(--background)" }}
      >
        <AssignmentProvider>
          {/* Navigation Header */}
          <nav
            className="border-b bg-theme-nav backdrop-blur-md sticky top-0 z-50 shadow-sm"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Assignment Evaluator
                    </h1>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      AI-Powered Grading System
                    </p>
                  </div>
                </div>

                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-all hover:border-blue-300 hover:shadow-md hover:text-blue-600"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </Link>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-fade-in">{children}</div>
          </main>

          {/* Footer */}
          <footer
            className="mt-12 border-t backdrop-blur-sm"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--nav-bg)",
            }}
          >
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <p
                className="text-center text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Powered by AI • Made with ❤️ for educators
              </p>
            </div>
          </footer>
        </AssignmentProvider>
      </body>
    </html>
  );
}
