import axios from "axios";
import { Trace, WorkflowResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const workflowApi = {
  // Run workflow with a question
  runWorkflow: async (questionText: string): Promise<WorkflowResponse> => {
    const response = await api.post("/ask", {
      question: questionText,
    });
    return {
      traceId: response.data.traceId,
      answerId: response.data.answerId,
      status: response.data.ok ? "success" : "error",
    };
  },

  // Get trace details
  getTrace: async (traceId: string): Promise<Trace> => {
    const response = await api.get(`/trace/${traceId}`);
    return response.data.trace;
  },

  // Upload document
  uploadDocument: async (title: string, content: string, topic?: string) => {
    const response = await api.post("/upload", {
      title,
      content,
      topic,
    });
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get("/");
    return response.data;
  },
};

export default api;
