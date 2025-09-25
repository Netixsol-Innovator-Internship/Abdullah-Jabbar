"use client";

import { useState } from "react";
import {
  DocumentTextIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { workflowApi } from "@/lib/api";
import { Document } from "@/types";

interface DocumentUploadProps {
  onUploadSuccess?: (doc: Document) => void;
  onUploadError?: (error: string) => void;
}

export function DocumentUpload({
  onUploadSuccess,
  onUploadError,
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setUploadStatus("error");
      onUploadError?.("Please provide both title and content");
      return;
    }

    setIsUploading(true);
    setUploadStatus("idle");

    try {
      const result = await workflowApi.uploadDocument(
        title.trim(),
        content.trim(),
        topic.trim() || undefined
      );

      setUploadStatus("success");
      onUploadSuccess?.(result.doc);

      // Reset form
      setTitle("");
      setTopic("");
      setContent("");
      setFileName("");

      // Reset file input
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: unknown) {
      setUploadStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <DocumentTextIcon className="h-6 w-6 text-indigo-600 mr-3" />
        <h2 className="text-lg font-semibold text-gray-900">Upload Document</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File (Optional)
          </label>
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-400 transition-colors">
            <div className="space-y-1 text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".txt,.md,.json"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                TXT, MD, JSON files up to 10MB
              </p>
              {fileName && (
                <p className="text-sm text-green-600 font-medium">
                  Selected: {fileName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter document title"
            required
          />
        </div>

        {/* Topic */}
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Topic (Optional)
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter document topic"
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Paste or type your document content here..."
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            {content.length} characters
          </p>
        </div>

        {/* Status Messages */}
        {uploadStatus === "success" && (
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-md">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-sm text-green-800">
              Document uploaded successfully!
            </span>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-sm text-red-800">
              Upload failed. Please try again.
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || !title.trim() || !content.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
              Uploading...
            </>
          ) : (
            <>
              <CloudArrowUpIcon className="h-5 w-5 mr-2" />
              Upload Document
            </>
          )}
        </button>
      </form>
    </div>
  );
}
