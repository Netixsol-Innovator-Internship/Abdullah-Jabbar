import { AskResponse } from "../../utils/api";

// Message types for the chat stream
export type ChatMessage = {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  data?: AskResponse;
  isTyping?: boolean;
  isAnimating?: boolean;
};
