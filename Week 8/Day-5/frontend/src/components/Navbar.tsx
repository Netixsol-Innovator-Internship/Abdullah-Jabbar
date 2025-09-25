"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [workspaceHref, setWorkspaceHref] = useState<string>("/");

  useEffect(() => {
    try {
      const last = localStorage.getItem("lastDocId");
      if (last) setWorkspaceHref(`/workspace/${last}`);
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <nav
      className="bg-white shadow-md rounded-2xl p-4 mb-6"
      role="navigation"
      aria-label="Main navigation"
    >
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
          <Link
            href={workspaceHref}
            className="text-gray-600 hover:text-gray-900"
          >
            Chats
          </Link>
        </div>
      </div>
    </nav>
  );
}
