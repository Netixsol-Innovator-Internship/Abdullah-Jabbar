"use client";

import { useState } from "react";
import * as api from "@/lib/api";

interface SubmissionUploaderProps {
  assignmentId: string;
  onUploadComplete: () => void;
}

export function SubmissionUploader({
  assignmentId,
  onUploadComplete,
}: SubmissionUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);

    // Validate file types
    const invalidFiles = filesArray.filter(
      (file) => file.type !== "application/pdf"
    );
    if (invalidFiles.length > 0) {
      setError(
        `Only PDF files are allowed. Invalid files: ${invalidFiles.map((f) => f.name).join(", ")}`
      );
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(`Uploading ${filesArray.length} file(s)...`);

    try {
      await api.uploadSubmissions(assignmentId, filesArray);
      setUploadProgress("Upload completed successfully!");
      setTimeout(() => {
        setUploadProgress(null);
        onUploadComplete();
      }, 1000);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
    // Reset input
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative rounded-xl border-2 border-dashed p-8 text-center transition-all
          ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
          }
          ${isUploading ? "opacity-50 pointer-events-none" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div
              className={`
              flex h-16 w-16 items-center justify-center rounded-full 
              ${dragActive ? "bg-blue-100" : "bg-slate-100"}
            `}
            >
              <svg
                className={`h-8 w-8 ${dragActive ? "text-blue-600" : "text-slate-600"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
          </div>

          <div>
            <p className="text-lg font-medium text-slate-900">
              {dragActive ? "Drop files here" : "Upload PDF submissions"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Drag and drop PDF files here, or click to select files
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Maximum 50 files. Student names and roll numbers will be
              auto-detected from filenames.
            </p>
          </div>
        </div>
      </div>

      {/* Progress/Status */}
      {uploadProgress && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="font-medium">{uploadProgress}</span>
          </div>
        </div>
      )}

      {/* Error */}
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
            <span className="font-medium">Upload Error</span>
          </div>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
