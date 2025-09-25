import React, { useState, useEffect } from "react";
import { askQuestion, AskResponse } from "../utils/api";
import Table from "./Table";

// Type for individual format data in multi-format response
type SingleFormatData = {
  format: string;
  type: "table" | "text";
  data:
    | string
    | {
        columns: string[];
        rows: (string | number | null | undefined)[][];
      };
  meta?: {
    query?: {
      collection?: string;
      filter?: Record<string, unknown>;
      projection?: Record<string, unknown>;
      sort?: Record<string, unknown>;
      limit?: number;
    };
  };
};

// Type guards
const isTableData = (
  data: unknown
): data is {
  columns: string[];
  rows: (string | number | null | undefined)[][];
} => {
  if (
    !data ||
    typeof data !== "object" ||
    !("columns" in data) ||
    !("rows" in data)
  ) {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return Array.isArray(obj.columns) && Array.isArray(obj.rows);
};

const isMultiFormatData = (data: unknown): data is SingleFormatData[] => {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (item) =>
        item &&
        typeof item === "object" &&
        "format" in item &&
        "type" in item &&
        "data" in item
    )
  );
};

const getFormatDisplayName = (formatData: SingleFormatData): string => {
  // First try to get format from meta.query.filter.format
  if (
    formatData.meta?.query?.filter &&
    typeof formatData.meta.query.filter === "object"
  ) {
    const filter = formatData.meta.query.filter as Record<string, unknown>;
    if (filter.format && typeof filter.format === "string") {
      switch (filter.format.toLowerCase()) {
        case "test":
          return "Test Match";
        case "odi":
          return "ODI Match";
        case "t20":
          return "T20 Match";
        default:
          return filter.format.toUpperCase() + " Match";
      }
    }
  }

  // Fallback to the format field if available
  if (formatData.format && formatData.format !== "Unknown") {
    return formatData.format.toUpperCase();
  }

  // Last fallback
  return "Unknown Format";
};

interface AskFormProps {
  selectedExample?: string;
}

export default function AskForm({ selectedExample }: AskFormProps) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedExample) {
      setQ(selectedExample);
      setResult(null);
      setError(null);
    }
  }, [selectedExample]);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setResult(null);
    if (!q.trim()) return setError("Please enter a question.");
    try {
      setLoading(true);
      const r = await askQuestion(q.trim(), "simple_user");
      setResult(r);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-3">Ask Cricket Stats</h1>
      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium">Question</span>
          <textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={3}
            placeholder="e.g. Show Australia ODI matches in 2005"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 p-2"
          />
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? "Asking..." : "Ask"}
          </button>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setResult(null);
              setError(null);
            }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-slate-300 bg-white"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="mt-6">
        {error && <div className="text-red-600">{error}</div>}

        {result && result.type === "text" && (
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="text-sm text-slate-500 mb-2">Result (text)</div>
            <div className="text-base">{String(result.data)}</div>
            {result.meta && (
              <pre className="mt-3 text-xs text-slate-500 overflow-auto">
                {JSON.stringify(result.meta, null, 2)}
              </pre>
            )}
          </div>
        )}

        {result && result.type === "table" && isTableData(result.data) && (
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="text-sm text-slate-500 mb-2">Result (table)</div>
            <Table columns={result.data.columns} rows={result.data.rows} />
            {result.meta && (
              <pre className="mt-3 text-xs text-slate-500 overflow-auto">
                {JSON.stringify(result.meta, null, 2)}
              </pre>
            )}
          </div>
        )}

        {result &&
          result.type === "multi-format" &&
          isMultiFormatData(result.data) && (
            <div className="space-y-6">
              <div className="text-sm text-slate-500 mb-4">
                Results ({result.meta?.totalFormats || result.data?.length || 0}{" "}
                formats)
              </div>
              {result.data?.map(
                (formatData: SingleFormatData, index: number) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-md shadow-sm"
                  >
                    <div className="text-sm font-medium text-slate-700 mb-3">
                      {getFormatDisplayName(formatData)}
                      {formatData.type === "table" &&
                      isTableData(formatData.data)
                        ? ` - ${formatData.data.rows.length} records`
                        : ""}
                    </div>

                    {/* Handle text type */}
                    {formatData.type === "text" &&
                      typeof formatData.data === "string" && (
                        <div className="text-slate-800 whitespace-pre-wrap">
                          {formatData.data}
                        </div>
                      )}

                    {/* Handle table type */}
                    {formatData.type === "table" &&
                      isTableData(formatData.data) && (
                        <Table
                          columns={formatData.data.columns}
                          rows={formatData.data.rows}
                        />
                      )}

                    {formatData.meta && (
                      <details className="mt-3">
                        <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-700">
                          View query details
                        </summary>
                        <pre className="mt-2 text-xs text-slate-500 overflow-auto bg-slate-50 p-2 rounded">
                          {JSON.stringify(formatData.meta, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )
              )}
              {result.meta && (
                <details className="bg-slate-50 p-3 rounded-md">
                  <summary className="text-xs text-slate-600 cursor-pointer hover:text-slate-800 font-medium">
                    View overall metadata
                  </summary>
                  <pre className="mt-2 text-xs text-slate-500 overflow-auto">
                    {JSON.stringify(result.meta, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
