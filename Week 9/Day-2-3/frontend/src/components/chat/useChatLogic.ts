"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../store/hooks";
import {
  askQuestion,
  getConversationHistory,
  getSummary,
  clearConversationHistory,
  AskResponse,
  SummaryRecord,
} from "../../utils/api";
import { ChatMessage } from "./types";

export const useChatLogic = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [summary, setSummary] = useState<SummaryRecord | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isTypingResponse, setIsTypingResponse] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || "anonymous";

  // Debugging: show auth state when hook initializes
  useEffect(() => {
    try {
      console.debug("useChatLogic auth user/token", {
        user,
        token: typeof window !== "undefined" && (document.cookie || ""),
      });
    } catch (e) {
      /* ignore */
    }
  }, [user]);

  // Helper function to add messages with animation
  const addMessageWithAnimation = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, { ...message, isAnimating: true }]);

    // Remove animation flag after animation completes
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, isAnimating: false } : msg
        )
      );
    }, 400);
  }, []);

  // Extract answer text from response
  const extractAnswerText = (answer: AskResponse): string => {
    if (typeof answer === "string") return answer;

    if (answer?.type === "text") return answer.data as string;

    if (
      answer?.type === "table" &&
      answer?.data &&
      typeof answer.data === "object" &&
      "rows" in answer.data
    ) {
      return `Table with ${(answer.data as { rows: unknown[] }).rows.length} rows`;
    }

    if (answer?.type === "multi-format" && Array.isArray(answer?.data)) {
      return `Multi-format response with ${answer.data.length} formats`;
    }

    return JSON.stringify(answer);
  };

  // Clear all conversation history including persisted data
  const clearConversation = useCallback(async () => {
    if (isClearing) return;

    // Allow anonymous sessions (shouldn't happen on protected route) to clear locally
    if (userId === "anonymous") {
      // Add fade out animation before clearing
      setMessages((prev) => prev.map((msg) => ({ ...msg, isAnimating: true })));

      setTimeout(() => {
        setMessages([]);
        setSummary(null);
      }, 300);
      return;
    }

    setIsClearing(true);

    // Add fade out animation
    setMessages((prev) => prev.map((msg) => ({ ...msg, isAnimating: true })));

    try {
      await clearConversationHistory(userId);

      setTimeout(() => {
        setMessages([]);
        setSummary(null);
      }, 300);
    } catch (error) {
      console.error("Failed to clear conversation from server:", error);

      // Reset animation state on error
      setMessages((prev) =>
        prev.map((msg) => ({ ...msg, isAnimating: false }))
      );

      const errorMessage: ChatMessage = {
        id: `error-clear-${Date.now()}`,
        type: "system",
        content:
          "⚠️ Unable to clear your conversation right now. Please try again shortly.",
        timestamp: new Date(),
        isAnimating: true,
      };

      addMessageWithAnimation(errorMessage);
    } finally {
      setIsClearing(false);
    }
  }, [userId, isClearing, addMessageWithAnimation]);

  // Load conversation history and convert to chat messages
  const loadConversationHistory = useCallback(async () => {
    // Skip loading conversation history for anonymous users
    if (userId === "anonymous") {
      console.log("Skipping conversation history for anonymous user");
      return;
    }

    try {
      const history = await getConversationHistory(userId);
      const chatMessages: ChatMessage[] = [];

      history.forEach((conv, index) => {
        // Add user message
        chatMessages.push({
          id: `user-${index}`,
          type: "user",
          content: conv.question,
          timestamp: new Date(conv.timestamp),
        });

        // Add assistant message
        chatMessages.push({
          id: `assistant-${index}`,
          type: "assistant",
          content: extractAnswerText(conv.answer),
          timestamp: new Date(conv.timestamp),
          data: conv.answer,
        });
      });

      if (chatMessages.length > 0) {
        setMessages(chatMessages);
      }
    } catch (error) {
      console.error("Failed to load conversation history:", error);
    }
  }, [userId]);

  // Load summary only when there is no conversation history (unless forced)
  const loadSummary = useCallback(
    async (options?: { force?: boolean }) => {
      // Skip loading summary for anonymous users
      if (userId === "anonymous") {
        console.log("Skipping summary for anonymous user");
        return;
      }

      // If messages already exist and not forced, skip fetching summary
      if (!options?.force && messages.length > 0) {
        console.log("Skipping summary because conversation history exists");
        return;
      }

      try {
        const summaryData = await getSummary(userId);
        setSummary(summaryData);

        // Add system message if summary exists and there are no messages
        if (
          summaryData &&
          summaryData.summarizedMemory &&
          messages.length === 0
        ) {
          setMessages([
            {
              id: "system-summary",
              type: "system",
              content: `💭 Memory loaded: ${summaryData.summarizedMemory}`,
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load summary:", error);
      }
    },
    [userId, messages.length]
  );

  const handleSubmit = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: question.trim(),
      timestamp: new Date(),
      isAnimating: true,
    };

    // Add user message with animation
    addMessageWithAnimation(userMessage);
    setInputValue("");
    setIsLoading(true);
    setIsTypingResponse(true);

    // Add typing indicator with delay for smoother transition
    setTimeout(() => {
      const typingMessage: ChatMessage = {
        id: `typing-${Date.now()}`,
        type: "assistant",
        content: "Thinking",
        timestamp: new Date(),
        isTyping: true,
        isAnimating: true,
      };

      addMessageWithAnimation(typingMessage);
    }, 300);

    try {
      const response = await askQuestion(userMessage.content, userId);

      // Remove typing indicator and add real response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          type: "assistant",
          content: extractAnswerText(response),
          timestamp: new Date(),
          data: response,
          isAnimating: true,
        };

        return [...filtered, assistantMessage];
      });

      // Remove animation flag after animation completes
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.type === "assistant" && msg.isAnimating
              ? { ...msg, isAnimating: false }
              : msg
          )
        );
      }, 400);

      // Refresh summary after a few seconds
      setTimeout(loadSummary, 2000);
    } catch (error) {
      console.error("Failed to ask question:", error);

      // Remove typing indicator and add error message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          type: "assistant",
          content:
            "Sorry, I encountered an error while processing your question.",
          timestamp: new Date(),
          isAnimating: true,
        };

        return [...filtered, errorMessage];
      });

      // Remove animation flag after animation completes
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id.startsWith("error-") && msg.isAnimating
              ? { ...msg, isAnimating: false }
              : msg
          )
        );
      }, 400);
    } finally {
      setIsLoading(false);
      setIsTypingResponse(false);
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      // Load conversation history first. If no history exists, then try loading summary.
      await loadConversationHistory();

      // If there are no messages after history load, attempt to load summary
      if (messages.length === 0) {
        await loadSummary();
      }
    };
    initializeChat();
    // Intentionally omit messages from deps to avoid re-running init on local message changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadSummary, loadConversationHistory]);

  return {
    messages,
    summary,
    inputValue,
    setInputValue,
    isLoading,
    isClearing,
    isTypingResponse,
    handleSubmit,
    clearConversation,
  };
};
