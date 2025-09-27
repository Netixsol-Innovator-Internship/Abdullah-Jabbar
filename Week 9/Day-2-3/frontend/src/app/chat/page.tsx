"use client";

import React, { useEffect, useRef } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Navigation from "../../components/Navigation";
import SummaryBanner from "../../components/chat/SummaryBanner";
import ChatMessages from "../../components/chat/ChatMessages";
import ChatInput from "../../components/chat/ChatInput";
import { useChatLogic } from "../../components/chat/useChatLogic";

export default function ChatPage() {
  const {
    messages,
    summary,
    inputValue,
    setInputValue,
    isLoading,
    isClearing,
    handleSubmit,
    clearConversation,
  } = useChatLogic();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(inputValue);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pb-32">
        <Navigation />
        {/* Main Chat Area */}
        <div className="max-w-4xl mx-auto w-full">
          {/* Summary Banner */}
          {summary && <SummaryBanner summary={summary} />}

          {/* Messages Area */}
          <ChatMessages
            messages={messages}
            onSuggestionClick={setInputValue}
            ref={messagesEndRef}
          />

          {/* Fixed Input Area */}
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={isLoading}
            isClearing={isClearing}
            hasMessages={messages.length > 0}
            onSubmit={handleFormSubmit}
            onClearConversation={clearConversation}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
