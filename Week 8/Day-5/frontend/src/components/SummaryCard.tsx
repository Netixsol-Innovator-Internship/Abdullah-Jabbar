"use client";

import React from "react";
import type { Document } from "@/lib/types";
import { FileText } from "lucide-react";
import { escapeHtml } from "@/lib/utils";

export default function SummaryCard({ document }: { document: Document }) {
  return (
    <div
      className="p-4 rounded-2xl shadow bg-white"
      role="region"
      aria-labelledby="summary-heading"
    >
      <div className="flex items-center mb-3">
        <FileText className="h-5 w-5 text-gray-500 mr-2" />
        <h2
          id="summary-heading"
          className="text-xl font-semibold text-gray-800"
        >
          Document Information
        </h2>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div>
          <span className="text-gray-500">File:</span>
          <span className="ml-2 text-gray-700">
            {escapeHtml(document.fileName)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Category:</span>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
            {escapeHtml(document.category)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Pages:</span>
          <span className="ml-2 text-gray-700">{document.pageCount}</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        Executive Summary
      </h3>
      <div className="text-gray-600 space-y-2">
        {document.summary.split("\n\n").map((paragraph, idx) => (
          <p key={`${idx}-${paragraph.slice(0, 40)}`}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
