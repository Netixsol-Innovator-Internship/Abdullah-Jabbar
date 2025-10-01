"use client";

import React, { forwardRef } from "react";
import { ChatMessage as ChatMessageType } from "./types";
import ChatMessage from "./ChatMessage";
import WelcomeMessage from "./WelcomeMessage";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  onSuggestionClick: (suggestion: string) => void;
}

const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages, onSuggestionClick }, ref) => {
    return (
      <div className="px-4 py-4 space-y-4 flex flex-col">
        {messages.length === 0 ? (
          <WelcomeMessage onSuggestionClick={onSuggestionClick} />
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={message.id} message={message} index={index} />
          ))
        )}
        <div ref={ref} />
      </div>
    );
  }
);

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;
