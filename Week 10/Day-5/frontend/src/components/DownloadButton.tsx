"use client";

import { useAssignment } from "@/context/AssignmentContext";
import { downloadMarksSheet } from "@/lib/api";
import { useState } from "react";

export function DownloadButton({ assignmentId }: { assignmentId?: string }) {
  const { currentAssignmentId, assignment } = useAssignment();
  const [isDownloading, setIsDownloading] = useState(false);

  // Use provided assignmentId or fall back to context
  const activeAssignmentId = assignmentId || currentAssignmentId;

  const onDownload = async (format: "xlsx" | "csv" = "xlsx") => {
    if (!activeAssignmentId) {
      alert("No assignment selected");
      return;
    }

    setIsDownloading(true);
    try {
      const blob = await downloadMarksSheet(activeAssignmentId, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const fileName = `${assignment.title?.trim() || "results"}-marksheet.${format}`;
      a.href = url;
      a.download = fileName.replace(/\s+/g, "_");
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download marks sheet");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => onDownload("xlsx")}
        disabled={isDownloading || !activeAssignmentId}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
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
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {isDownloading ? "Downloading..." : "Download Excel"}
      </button>
      <button
        onClick={() => onDownload("csv")}
        disabled={isDownloading || !activeAssignmentId}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
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
            d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        {isDownloading ? "Downloading..." : "Download CSV"}
      </button>
    </div>
  );
}
