// Client-side API helpers for interacting with the backend.
// - uploadPDF: uploads file (uses XMLHttpRequest to provide progress events).
// - getDocument: fetches document metadata by id.
// - submitQuery: posts a question and attempts to stream response; falls back to normal JSON.

import type { QueryResponse, Document } from "./types";

// API base can be overridden in the environment (useful for production).
// During development Next's rewrite will proxy '/api' -> backend at http://localhost:3001
// API base can be overridden in the environment (useful for production).
// During development Next's rewrite will proxy '/api' -> backend at http://localhost:3001
// Normalize the value to avoid trailing-slash issues (so joining with '/upload' won't produce '//')
const rawApiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
const API_BASE = rawApiBase.replace(/\/+$/, "");
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit
export const MAX_QUESTION_LENGTH = 1000;

export function uploadPDF(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ docId: string }> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      reject(
        new Error(
          "File size exceeds 10MB limit. Please upload a smaller document."
        )
      );
      return;
    }

    const fd = new FormData();
    fd.append("file", file, file.name);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/api/upload`);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const body = JSON.parse(xhr.responseText);
          resolve(body);
        } catch {
          reject(new Error("Invalid response from server"));
        }
      } else if (xhr.status === 413) {
        // Specific handling for 413 Content Too Large error
        reject(
          new Error(
            "The file is too large for the server to process. Please upload a smaller file (maximum 10MB)."
          )
        );
      } else {
        try {
          // Try to parse the error response for a better error message
          const errorResponse = JSON.parse(xhr.responseText);
          if (errorResponse && errorResponse.message) {
            reject(new Error(errorResponse.message));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        } catch {
          // If can't parse JSON, use the raw response or status
          const msg =
            xhr.responseText || `Upload failed with status ${xhr.status}`;
          reject(new Error(msg));
        }
      }
    };

    xhr.onerror = () => {
      // Network errors can occur when the file is too large for the server to handle
      reject(
        new Error(
          "Network error during upload. This may occur if the file is too large (maximum 10MB) or your connection was interrupted."
        )
      );
    };

    xhr.ontimeout = () => {
      reject(
        new Error("Upload timed out. Your file may be too large to process.")
      );
    };

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.send(fd);
  });
}

export async function getDocument(docId: string): Promise<Document> {
  const res = await fetch(`${API_BASE}/documents/${encodeURIComponent(docId)}`);
  if (!res.ok) {
    throw new Error("Failed to load document");
  }
  const body = await res.json();
  return body as Document;
}

export async function submitQuery({
  docId,
  question,
  onChunk,
}: {
  docId: string;
  question: string;
  onChunk?: (chunk: string) => void;
}): Promise<QueryResponse> {
  if (!question || question.trim().length === 0) {
    throw new Error("Question is empty");
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    throw new Error(
      `Question exceeds maximum length of ${MAX_QUESTION_LENGTH} characters`
    );
  }

  // Try streaming endpoint first (if backend supports it)
  const res = await fetch(`${API_BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ docId, question }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Query failed with status ${res.status}`);
  }

  // If the backend streams, the response body will be readable
  // We'll attempt to stream, but also support non-streaming JSON
  const contentType = res.headers.get("content-type") || "";
  if (res.body && contentType.includes("text/event-stream") === false) {
    // attempt to stream from the ReadableStream (chunked text)
    try {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let done = false;

      while (!done) {
        const result = await reader.read();
        done = !!result.done;
        if (result.value) {
          const chunkText = decoder.decode(result.value, { stream: true });
          accumulated += chunkText;
          if (onChunk) onChunk(chunkText);
        }
      }

      // After streaming completes, try parse accumulated as JSON
      try {
        const parsed = JSON.parse(accumulated);
        return parsed as QueryResponse;
      } catch {
        // Not JSON, treat as plain text answer
        return { answer: accumulated, sources: [] };
      }
    } catch {
      // fallback to getting JSON body
    }
  }

  // Fallback: parse JSON body normally
  const body = await res.json();
  return body as QueryResponse;
}
