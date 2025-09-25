// typescript
"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
// Rename the File icon to FileIcon so it doesn't shadow the global DOM File constructor/type
import { Upload, File as FileIcon, Loader2, AlertCircle } from "lucide-react";
import { uploadPDF, MAX_FILE_SIZE_BYTES } from "@/lib/api";
import { sanitizeFileName } from "@/lib/utils";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
        setError("File size exceeds 30MB limit");
        return;
      }
      // sanitize filename before showing
      const sanitized = sanitizeFileName(uploadedFile.name);
      const sanitizedFile = new File([uploadedFile], sanitized, {
        type: uploadedFile.type,
      });
      setFile(sanitizedFile);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const response = await uploadPDF(file, (percent) => {
        setUploadProgress(percent);
      });

      // Navigate to workspace
      // persist last doc id so Navbar "Chats" can link to it
      try {
        localStorage.setItem("lastDocId", response.docId);
      } catch (e) {
        // ignore
      }

      setTimeout(() => {
        router.push(`/workspace/${response.docId}`);
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <nav className="bg-white shadow-md rounded-2xl p-4 mb-8">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-800">
            Smart PDF Analyzer
          </h1>
          <div className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-md rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Upload PDF Document
          </h2>

          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-all duration-200
              ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
              ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
            role="button"
            aria-label="File upload area"
            tabIndex={0}
          >
            <input {...getInputProps()} aria-label="File input" />

            <motion.div
              animate={{ scale: isDragActive ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            </motion.div>

            {isDragActive ? (
              <p className="text-gray-600">Drop the PDF file here...</p>
            ) : (
              <>
                <p className="text-gray-600 mb-2">
                  Drag and drop a PDF file here
                </p>
                <p className="text-sm text-gray-500">
                  or click to select a file
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Maximum file size: 10MB (up to 100 pages)
                </p>
              </>
            )}
          </div>

          <AnimatePresence>
            {file && !isUploading && (
              <motion.div
                key="file-card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                    aria-label="Remove selected file"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            )}

            {isUploading && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <div className="flex items-center justify-center mb-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Processing document...
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="upload-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-red-50 rounded-lg"
              >
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-sm font-semibold text-red-700">
                    {error.includes("too many pages")
                      ? "Document Too Large - Page Limit Exceeded"
                      : error.includes("size exceeds")
                        ? "Document Too Large - File Size Limit Exceeded"
                        : error.includes("timeout")
                          ? "Processing Timeout"
                          : "Upload Error"}
                  </span>
                </div>
                <p className="text-sm text-red-700 ml-7">{error}</p>
                {(error.includes("too many pages") ||
                  error.includes("size exceeds") ||
                  error.includes("timeout")) && (
                  <p className="text-sm text-red-700 ml-7 mt-2">
                    Please upload a smaller PDF document (max 10MB and 100
                    pages).
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {file && !isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <button
                onClick={handleUpload}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                aria-label="Upload and analyze"
              >
                Upload and Analyze
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
