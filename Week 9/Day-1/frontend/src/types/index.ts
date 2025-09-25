export interface Question {
  _id: string;
  id: string; // For compatibility with history page
  question: string;
  questionText: string; // For compatibility with history page
  mode: "code" | "llm";
  answerId?: string;
  traceId?: string; // For compatibility with history page
  createdAt: string;
}

export interface Answer {
  _id: string;
  questionId: string;
  finalAnswer: string;
  createdAt: string;
}

export interface Document {
  _id: string;
  title: string;
  topic?: string;
  content: string;
  createdAt: string;
}

export interface TraceStep {
  node: string;
  input?: unknown;
  output?: unknown;
  inputSnippet?: string;
  outputSnippet?: string;
  inputSummariesCount?: number;
  outputCount?: number;
  results?: Array<{ id: string; score: number }>;
}

export interface Trace {
  _id: string;
  questionId: string;
  steps: TraceStep[];
  createdAt: string;
}

export interface WorkflowResponse {
  traceId: string;
  answerId: string;
  status: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
