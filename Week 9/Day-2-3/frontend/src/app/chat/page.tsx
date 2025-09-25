"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Navigation from "../../components/Navigation";
import { useAppSelector } from "../../store/hooks";
import {
  askQuestion,
  getConversationHistory,
  getSummary,
  AskResponse,
  SummaryRecord,
} from "../../utils/api";

// Message types for the chat stream
type ChatMessage = {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  data?: AskResponse;
  isTyping?: boolean;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [summary, setSummary] = useState<SummaryRecord | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || "anonymous";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear all conversation history from the UI
  const clearConversation = () => {
    // Clear messages from state
    setMessages([]);
    // Also clear summary
    setSummary(null);
  };

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

  const loadSummary = useCallback(async () => {
    // Skip loading summary for anonymous users or when no token is available
    if (userId === "anonymous") {
      console.log("Skipping summary for anonymous user");
      return;
    }

    try {
      const summaryData = await getSummary(userId);
      setSummary(summaryData);

      // Add system message if summary exists
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
  }, [userId, messages.length]);

  useEffect(() => {
    const initializeChat = async () => {
      await loadSummary();
      await loadConversationHistory();
    };
    initializeChat();
  }, [loadSummary, loadConversationHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: `typing-${Date.now()}`,
      type: "assistant",
      content: "Thinking",
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages((prev) => [...prev, typingMessage]);

    try {
      const response = await askQuestion(userMessage.content, userId);

      // Remove typing indicator and add real response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        return [
          ...filtered,
          {
            id: `assistant-${Date.now()}`,
            type: "assistant",
            content: extractAnswerText(response),
            timestamp: new Date(),
            data: response,
          },
        ];
      });

      // Refresh summary after a few seconds
      setTimeout(loadSummary, 2000);
    } catch (error) {
      console.error("Failed to ask question:", error);

      // Remove typing indicator and add error message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        return [
          ...filtered,
          {
            id: `error-${Date.now()}`,
            type: "assistant",
            content:
              "Sorry, I encountered an error while processing your question.",
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

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

  const renderAnswer = (answer: AskResponse) => {
    if (typeof answer === "string") {
      return <p className="text-gray-700">{answer}</p>;
    }

    if (answer?.type === "text") {
      return <p className="text-gray-700">{answer.data as string}</p>;
    }

    if (
      answer?.type === "table" &&
      answer?.data &&
      typeof answer.data === "object" &&
      "rows" in answer.data
    ) {
      const tableData = answer.data as { columns: string[]; rows: unknown[][] };
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {tableData.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-2 border-b text-left font-semibold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-2 border-b">
                      {cell?.toString() || "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {tableData.rows.length > 5 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing first 5 of {tableData.rows.length} results
            </p>
          )}
        </div>
      );
    }

    if (answer?.type === "multi-format" && Array.isArray(answer?.data)) {
      return (
        <div className="space-y-4">
          {answer.data.map((formatData: unknown, idx: number) => {
            const typedFormatData = formatData as {
              format: string;
            } & AskResponse;
            return (
              <div key={idx} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">
                  {typedFormatData.format} Cricket
                </h4>
                {renderAnswer(typedFormatData)}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <pre className="text-sm bg-gray-100 p-2 rounded">
        {JSON.stringify(answer, null, 2)}
      </pre>
    );
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-50">
        <Navigation />
        {/* Main Chat Area */}
        <div className="flex flex-col h-full">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Cricket Assistant
                </h1>
                <p className="text-xs text-gray-500">
                  AI-powered cricket statistics chatbot
                </p>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
            {/* Summary Banner */}
            {summary && (
              <div className="mx-4 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">💭</span>
                  <div>
                    <p className="text-sm text-blue-800">
                      {summary.summarizedMemory}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Memory from {summary.conversationCount} conversations
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🏏</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Welcome to Cricket Chat!
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Ask me anything about cricket statistics, match records,
                    player performances, or team comparisons. I remember our
                    conversation context!
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() =>
                        setInputValue("Show me India's highest ODI scores")
                      }
                      className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Pak ODI records
                    </button>
                    <button
                      onClick={() =>
                        setInputValue("Top 5 T20 matches with highest scores")
                      }
                      className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50"
                    >
                      T20 high scores
                    </button>
                    <button
                      onClick={() =>
                        setInputValue("Australia vs England Test matches")
                      }
                      className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Ashes matches
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-3xl rounded-2xl px-4 py-2 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : message.type === "system"
                            ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                            : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      {message.isTyping ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {message.content}
                          </span>
                        </div>
                      ) : (
                        <div>
                          {message.data ? (
                            renderAnswer(message.data)
                          ) : (
                            <p className="whitespace-pre-wrap">
                              {message.content}
                            </p>
                          )}
                          <p
                            className={`text-xs mt-2 ${
                              message.type === "user"
                                ? "text-blue-200"
                                : message.type === "system"
                                  ? "text-yellow-600"
                                  : "text-gray-500"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={clearConversation}
                      className="text-sm text-gray-600 hover:text-red-600 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Clear conversation
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your cricket question..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => setInputValue("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Send"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
