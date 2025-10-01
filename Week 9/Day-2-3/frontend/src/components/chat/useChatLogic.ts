"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAppSelector } from "../../store/hooks";
import {
  askQuestion,
  getConversationHistory,
  getSummary,
  createSummary,
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
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Use refs to track initialization state to prevent re-renders
  const hasLoadedHistory = useRef(false);
  const isInitialized = useRef(false);
  const lastUserMessageCount = useRef(0);

  // Use the proper user ID - the backend returns user._id as id
  const userId = user?.id;

  // Toast utility function
  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide toast after 3 seconds
  }, []);

  // Auto-summarization after 5 messages (optimized)
  const checkAutoSummarization = useCallback(
    async (currentMessages: ChatMessage[]) => {
      // Count user messages only (exclude system messages)
      const userMessages = currentMessages.filter((msg) => msg.type === "user");
      const currentUserCount = userMessages.length;

      // Only trigger if we've crossed a 5-message threshold and haven't summarized yet
      if (
        currentUserCount >= 5 &&
        currentUserCount % 5 === 0 &&
        currentUserCount > lastUserMessageCount.current &&
        !summary &&
        userId &&
        isAuthenticated
      ) {
        lastUserMessageCount.current = currentUserCount;
        try {
          const newSummary = await createSummary(userId);
          if (newSummary) {
            setSummary(newSummary);
            showToastMessage(
              "💭 Memory updated - Your conversation has been automatically summarized for better context!"
            );
          }
        } catch (error) {
          console.error("Auto-summarization failed:", error);
        }
      }
    },
    [summary, userId, isAuthenticated, showToastMessage]
  );

  // Debugging: show auth state when hook initializes
  useEffect(() => {
    try {
      console.debug("useChatLogic auth state", {
        user,
        userId,
        isAuthenticated,
        token: typeof window !== "undefined" && (document.cookie || ""),
      });
    } catch {
      /* ignore */
    }
  }, [user, userId, isAuthenticated]);

  // Helper function to add messages with animation (optimized for stability)
  const addMessageWithAnimation = useCallback((message: ChatMessage) => {
    // Add message immediately
    setMessages((prev) => [...prev, { ...message, isAnimating: true }]);

    // Remove animation flag after animation completes - only for the specific message
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, isAnimating: false } : msg
        )
      );
    }, 1200); // Keep duration consistent
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
    if (isClearing || !userId || !isAuthenticated) return;

    setIsClearing(true);

    // Add fade out animation
    setMessages((prev) => prev.map((msg) => ({ ...msg, isAnimating: true })));

    try {
      await clearConversationHistory(userId);

      setTimeout(() => {
        setMessages([]);
        setSummary(null);
        hasLoadedHistory.current = false; // Reset to allow reloading
      }, 800); // Increased from 300ms to 800ms for better visibility
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
  }, [userId, isAuthenticated, isClearing, addMessageWithAnimation]);

  // Load conversation history and convert to chat messages
  const loadConversationHistory = useCallback(async () => {
    // Only load once and only for authenticated users with valid userId
    if (!userId || !isAuthenticated || hasLoadedHistory.current) {
      console.log(
        "Skipping conversation history - already loaded or user not authenticated"
      );
      return;
    }

    try {
      hasLoadedHistory.current = true; // Mark as loaded to prevent re-loading

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
      hasLoadedHistory.current = false; // Reset on error to allow retry
    }
  }, [userId, isAuthenticated]);

  // Load summary only when there is no conversation history (unless forced)
  const loadSummary = useCallback(
    async (options?: { force?: boolean }) => {
      // Only load for authenticated users with valid userId
      if (!userId || !isAuthenticated) {
        console.log("Skipping summary - user not authenticated or no userId");
        return;
      }

      // Get current messages length at call time (not as dependency)
      const currentMessages = messages;

      // If messages already exist and not forced, skip fetching summary
      if (!options?.force && currentMessages.length > 0) {
        console.log("Skipping summary because conversation history exists");
        return;
      }

      try {
        const summaryData = await getSummary(userId);
        setSummary(summaryData);

        // Don't add any system messages to chat - summary will be shown via modal when requested
        console.log("Summary loaded silently for user:", userId);
      } catch (error) {
        console.error("Failed to load summary:", error);
      }
    },
    [userId, isAuthenticated, messages] // Added messages dependency back
  );

  const handleSubmit = async (question: string) => {
    if (!question.trim() || isLoading || !userId || !isAuthenticated) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: question.trim(),
      timestamp: new Date(),
      isAnimating: true,
    };

    // Add user message immediately and stabilize it
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setIsTypingResponse(true);

    // Remove user message animation flag quickly to stabilize it
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, isAnimating: false } : msg
        )
      );
    }, 400); // Slightly increased for better visual transition

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

      setMessages((prev) => [...prev, typingMessage]);
    }, 600); // Balanced delay

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

      // Remove animation flag after animation completes (increased duration)
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.type === "assistant" && msg.isAnimating
              ? { ...msg, isAnimating: false }
              : msg
          )
        );
      }, 1200); // Increased from 400ms to 1200ms

      // Check for auto-summarization after successful response
      setTimeout(() => {
        setMessages((currentMessages) => {
          checkAutoSummarization(currentMessages);
          return currentMessages; // Don't modify messages, just check for summarization
        });
      }, 1500); // Wait for animations to complete

      // Don't reload summary automatically - it causes re-renders and message flickering
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

      // Remove animation flag after animation completes (consistent timing)
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id.startsWith("error-") && msg.isAnimating
              ? { ...msg, isAnimating: false }
              : msg
          )
        );
      }, 1200); // Match other animation timings
    } finally {
      setIsLoading(false);
      setIsTypingResponse(false);
    }
  };

  // View or create summarization
  const viewSummarization = useCallback(async () => {
    if (!userId || !isAuthenticated || isSummarizing) return;

    setIsSummarizing(true);

    try {
      let currentSummary = summary;

      // If no summary exists, create one
      if (!currentSummary && messages.length > 0) {
        currentSummary = await createSummary(userId);
        if (currentSummary) {
          setSummary(currentSummary);
          showToastMessage("💭 New summary created!");
        }
      }

      // Open modal to display the summary instead of adding to chat
      if (currentSummary) {
        setShowSummaryModal(true);
      } else {
        showToastMessage(
          "⚠️ No conversation to summarize yet. Start chatting to build conversation history!"
        );
      }
    } catch (error) {
      console.error("Failed to view/create summary:", error);
      showToastMessage(
        "⚠️ Unable to load summary right now. Please try again shortly."
      );
    } finally {
      setIsSummarizing(false);
    }
  }, [
    userId,
    isAuthenticated,
    isSummarizing,
    summary,
    messages.length,
    showToastMessage,
  ]);

  useEffect(() => {
    const initializeChat = async () => {
      // Only initialize once per session
      if (!userId || !isAuthenticated || isInitialized.current) {
        return;
      }

      isInitialized.current = true;

      // Load conversation history first. If no history exists, then try loading summary.
      await loadConversationHistory();

      // If there are no messages after history load, attempt to load summary
      // Use a timeout to check after state updates
      setTimeout(async () => {
        if (messages.length === 0) {
          await loadSummary();
        }
      }, 100);
    };

    initializeChat();
  }, [
    userId,
    isAuthenticated,
    loadConversationHistory,
    loadSummary,
    messages.length,
  ]); // Added missing dependencies

  return {
    messages,
    summary,
    inputValue,
    setInputValue,
    isLoading,
    isClearing,
    isSummarizing,
    isTypingResponse,
    showToast,
    toastMessage,
    showSummaryModal,
    setShowSummaryModal,
    handleSubmit,
    clearConversation,
    viewSummarization,
    hasMessages: messages.length > 0,
  };
};
