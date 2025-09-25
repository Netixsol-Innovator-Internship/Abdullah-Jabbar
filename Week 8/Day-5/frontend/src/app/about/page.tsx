"use client";

import React from "react";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            About Smart PDF Analyzer
          </h1>

          <p className="text-gray-700 mb-4">
            Smart PDF Analyzer is a small web application that extracts,
            indexes, and answers questions about PDF documents using embeddings
            and an LLM. It demonstrates a simple pipeline for uploading PDFs,
            processing them into searchable chunks, and querying the content in
            natural language.
          </p>

          <h2 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            How it works
          </h2>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Upload a PDF using the Upload area on the home page.</li>
            <li>
              The backend splits the document into chunks and creates
              embeddings.
            </li>
            <li>
              Chunks are stored and later used to retrieve relevant context for
              questions.
            </li>
            <li>
              The chat box lets you ask questions, and the app returns answers
              with sources.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            Try it
          </h2>
          <p className="text-gray-700 mb-4">
            Upload a PDF from the home page, then ask questions in the chat box
            to explore the document content and sources.
          </p>

          <h2 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            Credits
          </h2>
          <p className="text-gray-700 mb-2">
            Built as a demo project to showcase PDF processing, embeddings, and
            question-answering with LLMs.
          </p>
          <p className="text-sm text-gray-600">
            Credit: Abdullah Jabbar — Software Engineer
          </p>
        </div>
      </main>
    </div>
  );
}
