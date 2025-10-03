// API service for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type EvaluationMode = "strict" | "loose";

export interface CreateAssignmentDto {
  topic: string;
  instructions: string;
  wordCount?: number;
  mode: EvaluationMode;
}

export interface Assignment {
  _id: string;
  topic: string;
  instructions: string;
  wordCount?: number;
  mode: EvaluationMode;
  createdAt: string;
}

export interface Submission {
  _id: string;
  assignmentId: string;
  studentName: string;
  rollNumber: string;
  fileName: string;
  filePath?: string;
  status: "pending" | "processing" | "in-progress" | "evaluated" | "failed";
  score?: number;
  feedback?: string;
  remarks?: string;
  evaluatedAt?: string;
  createdAt: string;
}

async function parseResponse<T>(
  response: Response,
  fallbackError = "Request failed"
): Promise<T> {
  if (!response.ok) {
    // Try to extract message from JSON error body, otherwise throw generic
    try {
      const err = await response.json();
      const message = err?.message || err?.error || fallbackError;
      throw new Error(message);
    } catch {
      throw new Error(fallbackError);
    }
  }

  // Parse JSON if possible and unwrap { data } wrapper used by backend
  const json = await response.json().catch(() => null);
  if (json && typeof json === "object" && "data" in json) {
    return (json as unknown as { data: T }).data;
  }
  return json as T;
}

// Create a new assignment
export async function createAssignment(
  data: CreateAssignmentDto
): Promise<Assignment> {
  const response = await fetch(`${API_BASE_URL}/assignments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseResponse<Assignment>(response, "Failed to create assignment");
}

// Get all assignments
export async function getAssignments(): Promise<Assignment[]> {
  const response = await fetch(`${API_BASE_URL}/assignments`);
  return parseResponse<Assignment[]>(response, "Failed to fetch assignments");
}

// Get a single assignment by ID
export async function getAssignment(id: string): Promise<Assignment> {
  const response = await fetch(`${API_BASE_URL}/assignments/${id}`);
  return parseResponse<Assignment>(response, "Failed to fetch assignment");
}

// Upload submissions (PDF files)
export async function uploadSubmissions(
  assignmentId: string,
  files: File[]
): Promise<Submission[]> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(
    `${API_BASE_URL}/assignments/${assignmentId}/submissions/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  return parseResponse<Submission[]>(response, "Failed to upload submissions");
}

// Get all submissions for an assignment
export async function getSubmissions(
  assignmentId: string
): Promise<Submission[]> {
  const response = await fetch(
    `${API_BASE_URL}/assignments/${assignmentId}/submissions`
  );
  return parseResponse<Submission[]>(response, "Failed to fetch submissions");
}

// Start evaluation process (only pending submissions)
export async function evaluateAssignment(
  assignmentId: string
): Promise<Submission[]> {
  const response = await fetch(
    `${API_BASE_URL}/assignments/${assignmentId}/evaluate`,
    {
      method: "POST",
    }
  );

  return parseResponse<Submission[]>(response, "Failed to evaluate assignment");
}

// Reevaluate all submissions
export async function reevaluateAllSubmissions(
  assignmentId: string
): Promise<Submission[]> {
  const response = await fetch(
    `${API_BASE_URL}/assignments/${assignmentId}/reevaluate`,
    {
      method: "POST",
    }
  );

  return parseResponse<Submission[]>(
    response,
    "Failed to reevaluate submissions"
  );
}

// Download marks sheet
export async function downloadMarksSheet(
  assignmentId: string,
  format: "xlsx" | "csv" = "xlsx"
): Promise<Blob> {
  const response = await fetch(
    `${API_BASE_URL}/assignments/${assignmentId}/marks-sheet?format=${format}`
  );

  if (!response.ok) {
    throw new Error("Failed to download marks sheet");
  }

  return response.blob();
}

// Poll submissions to check for updates (useful for real-time progress)
export async function pollSubmissions(
  assignmentId: string,
  intervalMs: number = 2000,
  onUpdate: (submissions: Submission[]) => void,
  shouldContinue: () => boolean
): Promise<void> {
  const poll = async () => {
    if (!shouldContinue()) return;

    try {
      const submissions = await getSubmissions(assignmentId);
      onUpdate(submissions);

      // Check if all submissions are evaluated
      const allDone = submissions.every(
        (s) => s.status === "evaluated" || s.status === "failed"
      );

      if (!allDone && shouldContinue()) {
        setTimeout(poll, intervalMs);
      }
    } catch (error) {
      console.error("Error polling submissions:", error);
      if (shouldContinue()) {
        setTimeout(poll, intervalMs);
      }
    }
  };

  poll();
}

// Update assignment evaluation mode
export async function updateAssignmentMode(
  assignmentId: string,
  mode: EvaluationMode
): Promise<Assignment> {
  const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mode }),
  });

  return parseResponse<Assignment>(
    response,
    "Failed to update assignment mode"
  );
}

// Delete a specific submission
export async function deleteSubmission(
  assignmentId: string,
  submissionId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/assignments/${assignmentId}/submissions/${submissionId}`,
    {
      method: "DELETE",
    }
  );

  await parseResponse<void>(response, "Failed to delete submission");
}
