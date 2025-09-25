"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { DocumentUpload } from "@/components/DocumentUpload";
import { QuestionForm } from "@/components/QuestionForm";
import { Document } from "@/types";

export default function DocumentsPage() {
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleUploadSuccess = (doc: Document) => {
    setUploadedDocs((prev) => [doc, ...prev]);
    setNotification({
      type: "success",
      message: `Document "${doc.title}" uploaded successfully!`,
    });

    // Clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  const handleUploadError = (error: string) => {
    setNotification({
      type: "error",
      message: error,
    });

    // Clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Document Management
            </h1>
            <p className="text-gray-600">
              Upload documents and ask questions based on their content
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-1" />
              {uploadedDocs.length} documents uploaded
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-md ${
              notification.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <DocumentUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>

          {/* Question Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <QuestionMarkCircleIcon className="h-6 w-6 text-indigo-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">
                Ask Questions
              </h2>
            </div>

            {uploadedDocs.length > 0 ? (
              <div>
                <p className="text-gray-600 mb-4">
                  You can now ask questions based on your uploaded documents.
                  The AI will search through your documents to find relevant
                  information.
                </p>

                {!showQuestionForm ? (
                  <button
                    onClick={() => setShowQuestionForm(true)}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
                    Ask a Question
                  </button>
                ) : (
                  <div>
                    <div className="mb-4">
                      <button
                        onClick={() => setShowQuestionForm(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        ← Back to documents
                      </button>
                    </div>
                    <QuestionForm />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  Upload a document first to start asking questions
                </p>
                <p className="text-sm text-gray-400">
                  Once you upload documents, you&apos;ll be able to ask
                  questions and get answers based on their content.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Uploaded Documents List */}
        {uploadedDocs.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Uploaded Documents
              </h2>
              <p className="text-gray-600 mt-1">
                Documents available for questioning
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {uploadedDocs.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {doc.title}
                      </h3>
                      {doc.topic && (
                        <p className="text-sm text-gray-500 mt-1">
                          Topic: {doc.topic}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Uploaded:{" "}
                        {new Date(
                          doc.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Explore Your Documents?
          </h3>
          <p className="text-indigo-100 mb-6">
            Upload your documents and start asking intelligent questions powered
            by AI
          </p>
          {uploadedDocs.length === 0 ? (
            <div className="text-indigo-100">
              Get started by uploading your first document above
            </div>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-white/20 text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
            >
              Go to Question Interface
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
