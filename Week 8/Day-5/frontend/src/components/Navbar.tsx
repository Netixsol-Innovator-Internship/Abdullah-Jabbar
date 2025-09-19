'use client';

import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md rounded-2xl p-4 mb-6" role="navigation" aria-label="Main navigation">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800">Smart PDF Analyzer</h1>
        <div className="flex gap-4">
          <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
          <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
        </div>
      </div>
    </nav>
  );
}