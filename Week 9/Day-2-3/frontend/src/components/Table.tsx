import React, { useState } from "react";

type Props = {
  columns: string[];
  rows: (string | number | null | undefined)[][];
};

export default function Table({ columns, rows }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  if (!columns || columns.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 animate-fade-in-scale">
        No columns available
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 animate-fade-in-scale">
        No data available
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(rows.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRows = rows.slice(startIndex, endIndex);

  // Display all records in one horizontal table with pagination
  return (
    <div className="animate-fade-in-scale">
      <div className="overflow-auto border border-slate-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              {columns.map((column, colIndex) => (
                <th
                  key={colIndex}
                  className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {currentRows.map((row, recordIndex) => (
              <tr key={startIndex + recordIndex} className="hover:bg-slate-50">
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap"
                  >
                    {cell === null || cell === undefined ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg animate-fade-in">
          <div className="text-xs text-slate-500">
            Showing {startIndex + 1} to {Math.min(endIndex, rows.length)} of{" "}
            {rows.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              ‹
            </button>
            <span className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
