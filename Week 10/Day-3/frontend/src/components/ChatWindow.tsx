import React, { RefObject } from "react";
import ChatHeader from "./ChatHeader";
import UserBubble from "./UserBubble";
import AgentBubble from "./AgentBubble";
import LoadingIndicator from "./LoadingIndicator";
import QuickQuestions from "./QuickQuestions";
import ChatInput from "./ChatInput";
import PrivacyBanner from "./PrivacyBanner";
import { Message } from "../hooks/useChatLogic";
import { Product } from "../types";

interface ChatWindowProps {
  currentProduct?: { name: string; id: string } | null;
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  pinnedProduct: string | null;
  isPolicyBannerVisible: boolean;
  chatContainerRef: RefObject<HTMLDivElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onQuickQuestion: (question: string) => void;
  onProductPin: (productName: string) => void;
  onPrivacyBannerDismiss: () => void;
  containerClassName?: string;
  windowClassName?: string;
  showVoiceInput?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  currentProduct,
  messages,
  isLoading,
  inputValue,
  pinnedProduct,
  isPolicyBannerVisible,
  chatContainerRef,
  messagesEndRef,
  onClose,
  onInputChange,
  onSend,
  onKeyPress,
  onQuickQuestion,
  onProductPin,
  onPrivacyBannerDismiss,
  containerClassName = "",
  windowClassName = "w-full max-w-none sm:max-w-sm md:max-w-md bg-white rounded-xl shadow-2xl flex flex-col h-[calc(100vh-1rem)] sm:h-[calc(100vh-6rem)] md:h-[550px] lg:h-[600px] max-h-[600px] overflow-hidden border border-gray-200",
  showVoiceInput = true,
}) => (
  <div className={containerClassName}>
    <div className={windowClassName}>
      <ChatHeader onClose={onClose} />

      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 chat-container"
      >
        {/* Welcome message */}
        <AgentBubble
          message={
            currentProduct
              ? `Hi! I can answer questions about ${currentProduct.name}. Ask me anything about dosage, ingredients, or suitability.`
              : `Hi! I am a Healthcare AI — I can help with questions about supplements, dosages, ingredients, side effects, and product recommendations.`
          }
          pinnedProduct={pinnedProduct}
          onProductPin={onProductPin}
        />

        {/* Chat Messages */}
        {messages.map((message, index) =>
          message.role === "user" ? (
            <UserBubble key={index} message={message.content} />
          ) : (
            <AgentBubble
              key={index}
              message={message.content}
              suggestedProducts={message.suggestedProducts}
              pinnedProduct={pinnedProduct}
              onProductPin={onProductPin}
            />
          )
        )}

        {/* Loading indicator */}
        {isLoading && <LoadingIndicator />}

        {/* Show quick questions only if no messages yet */}
        {messages.length === 0 && (
          <QuickQuestions onQuestionClick={onQuickQuestion} />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="border-t border-gray-200 bg-white flex-shrink-0">
        <PrivacyBanner
          isVisible={isPolicyBannerVisible}
          onDismiss={onPrivacyBannerDismiss}
        />
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSend}
          onKeyPress={onKeyPress}
          isLoading={isLoading}
          showVoiceInput={showVoiceInput}
        />
      </footer>
    </div>
  </div>
);

export default ChatWindow;
