"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAssignment } from "@/context/AssignmentContext";

export function FileUploader() {
  const { addSubmissions } = useAssignment();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const pdfs = acceptedFiles.filter(
        (f) =>
          f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
      );
      if (pdfs.length > 0) {
        addSubmissions(pdfs);
      }
    },
    [addSubmissions]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: { "application/pdf": [".pdf"] },
      multiple: true,
      onDrop,
    });

  return (
    <div
      {...getRootProps()}
      className={`group relative overflow-hidden rounded-xl border-2 border-dashed transition-all cursor-pointer ${
        isDragActive && !isDragReject
          ? "border-blue-400 bg-blue-50 shadow-lg scale-[1.02]"
          : isDragReject
            ? "border-red-400 bg-red-50"
            : "border-slate-300 bg-white hover:border-blue-300 hover:bg-blue-50/50"
      }`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center py-12 px-6">
        {/* Upload Icon */}
        <div
          className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full transition-all ${
            isDragActive && !isDragReject
              ? "bg-blue-100 scale-110"
              : isDragReject
                ? "bg-red-100"
                : "bg-slate-100 group-hover:bg-blue-100 group-hover:scale-110"
          }`}
        >
          {isDragReject ? (
            <svg
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className={`h-10 w-10 transition-colors ${
                isDragActive
                  ? "text-blue-500"
                  : "text-slate-400 group-hover:text-blue-500"
              }`}
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
          )}
        </div>

        {/* Text Content */}
        <div className="text-center">
          {isDragReject ? (
            <>
              <p className="text-lg font-semibold text-red-600 mb-1">
                Only PDF files are allowed
              </p>
              <p className="text-sm text-red-500">
                Please upload PDF documents only
              </p>
            </>
          ) : isDragActive ? (
            <>
              <p className="text-lg font-semibold text-blue-600 mb-1">
                Drop your files here
              </p>
              <p className="text-sm text-blue-500">
                Release to upload PDF files
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-slate-700 mb-1">
                Drag & drop PDF files here
              </p>
              <p className="text-sm text-slate-500 mb-4">
                or click to browse from your computer
              </p>
              <div className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
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
                Select Files
              </div>
            </>
          )}
        </div>

        {/* File Info */}
        {!isDragActive && !isDragReject && (
          <div className="mt-6 flex items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              PDF files only
            </div>
            <div className="flex items-center gap-1.5">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Multiple files supported
            </div>
          </div>
        )}
      </div>

      {/* Decorative gradient border */}
      <div
        className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 blur transition-opacity ${
          isDragActive && !isDragReject ? "opacity-20" : ""
        }`}
      ></div>
    </div>
  );
}
