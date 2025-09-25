"use client";

import { QuestionForm } from "@/components/QuestionForm";
import Link from "next/link";
import { BeakerIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <BeakerIcon className="h-16 w-16 text-indigo-300 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Research Workflow Assistant
            </h1>
            <p className="text-xl md:text-2xl text-indigo-200 mb-8 max-w-3xl mx-auto">
              AI-powered research assistant that processes your questions
              through an intelligent workflow to deliver comprehensive,
              well-researched answers.
            </p>
          </div>
        </div>
      </div>

      {/* Document Upload Call-to-Action */}
      <div className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center">
              <CloudArrowUpIcon className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upload Your Documents
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Have your own research materials? Upload documents and ask
                questions based on their content.
              </p>
              <Link
                href="/documents"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                Upload Documents
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Question Form Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ask Your Research Question
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your research question below and let our AI workflow provide
              you with comprehensive answers
            </p>
          </div>

          <QuestionForm />
        </div>
      </div>
    </div>
  );
}
