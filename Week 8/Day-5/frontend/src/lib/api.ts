// Client-side API helpers for interacting with the backend.
// - uploadPDF: uploads file (uses XMLHttpRequest to provide progress events).
// - getDocument: fetches document metadata by id.
// - submitQuery: posts a question and attempts to stream response; falls back to normal JSON.

import type { QueryResponse, Document } from './types';

const API_BASE = '/api';
export const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024; // 30MB
export const MAX_QUESTION_LENGTH = 1000;

export function uploadPDF(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ docId: string }> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      reject(new Error('File size exceeds 30MB limit'));
      return;
    }

    const fd = new FormData();
    fd.append('file', file, file.name);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/upload`);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const body = JSON.parse(xhr.responseText);
          resolve(body);
        } catch (err) {
          reject(new Error('Invalid response from server'));
        }
      } else {
        const msg = xhr.responseText || `Upload failed with status ${xhr.status}`;
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during upload'));
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
    throw new Error('Failed to load document');
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
    throw new Error('Question is empty');
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    throw new Error(`Question exceeds maximum length of ${MAX_QUESTION_LENGTH} characters`);
  }

  // Try streaming endpoint first (if backend supports it)
  const res = await fetch(`${API_BASE}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docId, question }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Query failed with status ${res.status}`);
  }

  // If the backend streams, the response body will be readable
  // We'll attempt to stream, but also support non-streaming JSON
  const contentType = res.headers.get('content-type') || '';
  if (res.body && contentType.includes('text/event-stream') === false) {
    // attempt to stream from the ReadableStream (chunked text)
    try {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
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
    } catch (err) {
      // fallback to getting JSON body
    }
  }

  // Fallback: parse JSON body normally
  const body = await res.json();
  return body as QueryResponse;
}