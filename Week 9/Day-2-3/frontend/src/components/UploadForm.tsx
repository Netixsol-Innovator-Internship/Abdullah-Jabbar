import React, { useState } from "react";
import { uploadCsv } from "../utils/api";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"test" | "odi" | "t20">("odi");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    if (!file) return setError("Please select a CSV file.");
    try {
      setLoading(true);
      const res = await uploadCsv(file, format);
      setStatus(`Imported ${res.imported}, upserted ${res.upserted}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-3">Upload CSV (matches)</h1>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Format</label>
          <select
            value={format}
            onChange={(e) =>
              setFormat(e.target.value as "test" | "odi" | "t20")
            }
            className="mt-1 rounded-md border-gray-300 p-2"
          >
            <option value="test">test</option>
            <option value="odi">odi</option>
            <option value="t20">t20</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">CSV File</label>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-emerald-600 text-white"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setStatus(null);
              setError(null);
            }}
            className="px-4 py-2 rounded-md border"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-4">
        {status && <div className="text-green-700">{status}</div>}
        {error && <div className="text-red-700">{error}</div>}
      </div>
    </div>
  );
}
