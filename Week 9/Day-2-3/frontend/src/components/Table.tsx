import React from "react";

type Props = {
  columns: string[];
  rows: (string | number | null | undefined)[][];
};

export default function Table({ columns, rows }: Props) {
  if (!columns || columns.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No columns available
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">No data available</div>
    );
  }

  return (
    <div className="overflow-auto max-h-96 border border-slate-200 rounded-lg">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 sticky top-0">
          <tr>
            {columns.map((c, index) => (
              <th
                key={`${c}-${index}`}
                className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-slate-50">
              {r.map((cell, j: number) => (
                <td
                  key={j}
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
  );
}
