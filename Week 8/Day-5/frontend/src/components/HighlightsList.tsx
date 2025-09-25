"use client";

import React, { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import type { Highlight } from "@/lib/types";

export default function HighlightsList({
  highlights,
  rawHighlights,
}: {
  highlights: string[];
  rawHighlights?: Highlight[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openModal = (i: number) => setOpenIndex(i);
  const closeModal = () => setOpenIndex(null);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Key Highlights
      </h3>
      <div className="space-y-2">
        {highlights.map((h, idx) => (
          <div
            key={`${idx}-${h.slice(0, 40)}`}
            className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            role="button"
            tabIndex={0}
            onClick={() => openModal(idx)}
            onKeyDown={(e) => {
              if (e.key === "Enter") openModal(idx);
            }}
            aria-label={`Open highlight ${idx + 1}`}
          >
            <ChevronRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{h}</span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Highlight details"
        >
          <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Highlight</h4>
              <button
                onClick={closeModal}
                aria-label="Close highlight details"
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X />
              </button>
            </div>

            <div className="text-gray-700 mb-4">
              {rawHighlights && rawHighlights[openIndex] ? (
                <>
                  <p className="mb-2">{rawHighlights[openIndex].snippet}</p>
                  <div className="flex flex-wrap gap-2">
                    {rawHighlights[openIndex].pageNumbers.map((p) => (
                      <span
                        key={`page-${p}`}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-md"
                      >{`Page ${p}`}</span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-2">{highlights[openIndex]}</p>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
