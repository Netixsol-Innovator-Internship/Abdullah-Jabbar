// file: src/components/Spinner.tsx
"use client";

export default function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 py-8">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}
