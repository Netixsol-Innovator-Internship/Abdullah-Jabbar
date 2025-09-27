"use client";

import React, { useState } from "react";

interface PaginatedChatTableProps {
  tableData: {
    columns: string[];
    rows: unknown[][];
  };
}

const PaginatedChatTable: React.FC<PaginatedChatTableProps> = React.memo(
  ({ tableData }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const totalPages = Math.ceil(tableData.rows.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const currentRows = tableData.rows.slice(startIndex, endIndex);

    return (
      <div>
        <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-lg border border-gray-200/50 shadow-sm">
          <table className="min-w-full bg-white/50 backdrop-blur-sm text-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-50/50 sticky top-0">
              <tr>
                {tableData.columns.map((column, colIndex) => (
                  <th
                    key={colIndex}
                    className="px-2 sm:px-4 py-3 text-left font-medium text-xs sm:text-sm text-gray-700"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-100">
              {currentRows.map((row, recordIndex) => (
                <tr
                  key={startIndex + recordIndex}
                  className="hover:bg-gray-50/50"
                >
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap"
                    >
                      {cell?.toString() || "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-4 py-3 bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 rounded-lg">
            <div className="text-xs text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, tableData.rows.length)} of{" "}
              {tableData.rows.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                ‹
              </button>
              <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-md">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PaginatedChatTable.displayName = "PaginatedChatTable";

export default PaginatedChatTable;
