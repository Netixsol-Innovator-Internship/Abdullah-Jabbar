"use client";

import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Navigation from "../../components/Navigation";
import UploadForm from "../../components/UploadForm";

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1">
          <div className="max-w-5xl mx-auto p-4">
            <UploadForm />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
