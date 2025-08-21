// file: src/components/Pagination.tsx
"use client";

export default function Pagination({
  page,
  setPage
}: {
  page: number;
  setPage: (p: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-50"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Prev
      </button>
      <span className="text-sm" aria-live="polite">Page {page}</span>
      <button
        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700"
        onClick={() => setPage(page + 1)}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
