// file: src/components/Toast.tsx
"use client";

import { useEffect, useState } from "react";

export default function Toast({ message }: { message: string }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm shadow-lg"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
