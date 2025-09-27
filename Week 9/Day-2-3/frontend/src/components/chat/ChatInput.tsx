"use client";

import React, { useRef } from "react";
import Spinner from "../Spinner";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  isClearing: boolean;
  hasMessages: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClearConversation: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  isLoading,
  isClearing,
  hasMessages,
  onSubmit,
  onClearConversation,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl bg-white/95 backdrop-blur-sm shadow-xl rounded-3xl border border-gray-200/50 z-10 transition-all duration-300 hover:shadow-2xl animate-fade-in-scale">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            {hasMessages && (
              <button
                type="button"
                onClick={onClearConversation}
                disabled={isClearing}
                className="text-sm text-gray-500 hover:text-red-500 flex items-center disabled:text-gray-300 disabled:hover:text-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 btn-press"
              >
                {isClearing ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" colorClassName="text-gray-500" />
                    Clearing...
                  </span>
                ) : (
                  <>
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
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your cricket question..."
              className="w-full px-4 py-3 pr-12 bg-gray-50/50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 focus:bg-white transition-all duration-300 focus:shadow-lg animate-pulse-glow focus:animate-none"
              disabled={isLoading}
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 btn-press"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 btn-press animate-pulse-glow disabled:animate-none"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="hidden sm:inline transition-all duration-200">
                Send
              </span>
            )}
            {isLoading ? null : (
              <span className="sm:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
