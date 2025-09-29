import Cookies from "js-cookie";

// Parse multiple API base URLs from environment variable
const API_BASES = process.env.NEXT_PUBLIC_API_BASE
  ? process.env.NEXT_PUBLIC_API_BASE.split(",").map((url) => url.trim())
  : ["http://localhost:4000"];

// Request timeout (ms) - configurable via NEXT_PUBLIC_API_TIMEOUT_MS
const TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS) || 60000; // default 60s

export type TableData = {
  columns: string[];
  rows: (string | number | null | undefined)[][];
};

export type AskResponse = {
  type: "text" | "table" | "multi-format";
  data: unknown;
  meta?: {
    totalFormats?: number;
    [key: string]: unknown;
  };
};

export type UploadResponse = {
  imported: number;
  upserted: number;
  inserted?: number;
  modified?: number;
};

export type HealthResponse = {
  status: string;
  timestamp: string;
  service: string;
  version: string;
};

export type ConversationRecord = {
  userId: string;
  question: string;
  answer: AskResponse;
  timestamp: string;
};

export type SummaryRecord = {
  userId: string;
  summarizedMemory: string;
  conversationCount: number;
  lastUpdated: string;
};

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage: string;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        `HTTP ${response.status}: ${response.statusText}`;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  // Some endpoints may return 204 No Content or an empty body.
  // Attempt to read text first and parse JSON only when present.
  try {
    if (response.status === 204) {
      // No content
      return null as unknown as T;
    }

    const text = await response.text();
    if (!text) {
      // Empty body
      return null as unknown as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (parseError) {
      // If JSON parsing fails, return the raw text (when T is string) or throw
      // a descriptive error so callers can see what happened.
      // If the caller expects JSON and parsing failed, surface a helpful message.
      if (typeof ("" as unknown as T) === "string") {
        return text as unknown as T;
      }
      throw new Error(
        `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}. Raw response: ${text}`
      );
    }
  } catch (err) {
    // Re-throw as Error to keep single error type across the API layer
    throw err instanceof Error ? err : new Error(String(err));
  }
}

// Function to try multiple API endpoints until one works
async function fetchWithFallback<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let lastError: Error | null = null;

  for (const baseUrl of API_BASES) {
    try {
      console.log(`Trying API endpoint: ${baseUrl}${endpoint}`);

      // merge options but allow callers to provide their own signal
      // Some callers may pass a partial RequestInit with a 'signal' property.
      // Narrow it safely instead of using `any`.
      const maybeSignal = (options as RequestInit & { signal?: AbortSignal })
        .signal;
      const signal = maybeSignal ?? AbortSignal.timeout(TIMEOUT_MS);

      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        signal,
      });

      const result = await handleApiResponse<T>(response);
      console.log(`Successfully connected to: ${baseUrl}`);
      return result;
    } catch (error: unknown) {
      // Handle aborts explicitly to give clearer feedback when requests time out
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        typeof (error as { name?: unknown }).name === "string" &&
        (error as { name?: string }).name === "AbortError"
      ) {
        const msg = `Request to ${baseUrl}${endpoint} aborted after ${TIMEOUT_MS}ms`;
        console.warn(msg, error);
        lastError = new Error(msg);
        // try next base URL (if any)
        continue;
      }

      console.warn(`Failed to connect to ${baseUrl}:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      // Continue to next URL
    }
  }

  // If all URLs failed, throw the last error
  throw lastError || new Error("All API endpoints failed");
}

export async function checkHealth(): Promise<HealthResponse> {
  try {
    return await fetchWithFallback<HealthResponse>("/health", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    throw new Error(
      `Failed to connect to any backend server. Tried: ${API_BASES.join(", ")}. Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function askQuestion(
  question: string,
  userId?: string
): Promise<AskResponse> {
  const token = Cookies.get("access_token");

  try {
    // If we have a token, prefer letting the backend derive the user from the
    // authenticated request (req.user). Only send userId when there's no token
    // (for lightweight demo / anonymous flows).
    const bodyPayload = token ? { question } : { question, userId };

    return await fetchWithFallback<AskResponse>("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(bodyPayload),
    });
  } catch (error) {
    throw new Error(
      `Failed to ask question on any backend server. Tried: ${API_BASES.join(", ")}. Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getConversationHistory(
  userId: string
): Promise<ConversationRecord[]> {
  const token = Cookies.get("access_token");

  // If token doesn't exist or userId is anonymous, return empty array without making an API call
  if (!token || userId === "anonymous") {
    console.log(
      "Skipping history request: User not authenticated or anonymous"
    );
    return [];
  }

  try {
    return await fetchWithFallback<ConversationRecord[]>(
      `/ask/history/${userId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Conversation history fetch error:", error);
    // Return empty array instead of throwing to avoid disrupting the user experience
    return [];
  }
}

export async function getSummary(
  userId: string
): Promise<SummaryRecord | null> {
  const token = Cookies.get("access_token");

  // If token doesn't exist or userId is anonymous, return null without making an API call
  if (!token || userId === "anonymous") {
    console.log(
      "Skipping summary request: User not authenticated or anonymous"
    );
    return null;
  }

  try {
    return await fetchWithFallback<SummaryRecord | null>(
      `/ask/summary/${userId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Summary fetch error:", error);
    // Return null instead of throwing to avoid disrupting the user experience
    return null;
  }
}

export async function clearConversationHistory(userId: string): Promise<void> {
  const token = Cookies.get("access_token");

  if (!token || userId === "anonymous") {
    return;
  }

  try {
    await fetchWithFallback<{ success: boolean }>(`/ask/history/${userId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Failed to clear conversation history:", error);
    throw error;
  }
}

export async function uploadCsv(
  file: File,
  format: "test" | "odi" | "t20"
): Promise<UploadResponse> {
  const token = Cookies.get("access_token");

  try {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("format", format);

    return await fetchWithFallback<UploadResponse>("/upload", {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: fd,
    });
  } catch (error) {
    throw new Error(
      `Failed to upload file on any backend server. Tried: ${API_BASES.join(", ")}. Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
