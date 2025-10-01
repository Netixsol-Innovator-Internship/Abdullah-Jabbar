"use client";

import React, { useEffect, useRef } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Navigation from "../../components/Navigation";
import ChatMessages from "../../components/chat/ChatMessages";
import ChatInput from "../../components/chat/ChatInput";
import SummaryModal from "../../components/chat/SummaryModal";
import { useChatLogic } from "../../components/chat/useChatLogic";

export default function ChatPage() {
  const {
    messages,
    summary,
    inputValue,
    setInputValue,
    isLoading,
    isClearing,
    isSummarizing,
    showToast,
    toastMessage,
    showSummaryModal,
    setShowSummaryModal,
    handleSubmit,
    clearConversation,
    viewSummarization,
    hasMessages,
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
            isSummarizing={isSummarizing}
            hasMessages={hasMessages}
            onSubmit={handleFormSubmit}
            onClearConversation={clearConversation}
            onViewSummarization={viewSummarization}
          />

          {/* Toast Notification */}
          {showToast && (
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
              {toastMessage}
            </div>
          )}

          {/* Summary Modal */}
          <SummaryModal
            isOpen={showSummaryModal}
            onClose={() => setShowSummaryModal(false)}
            summary={summary}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
