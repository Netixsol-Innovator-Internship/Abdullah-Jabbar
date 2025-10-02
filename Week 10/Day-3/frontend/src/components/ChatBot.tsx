"use client";
import React, { useEffect } from "react";
import { aiApi } from "../services/api";
import { useChatBot } from "../context/ChatBotContext";
import { useAuth } from "../hooks/useAuth";
import { useChatLogic } from "../hooks/useChatLogic";
import { usePrivacyBanner } from "../hooks/usePrivacyBanner";
import FloatingChatButton from "./FloatingChatButton";
import ChatWindow from "./ChatWindow";

export default function ChatBot() {
  const { isOpen, currentProduct, openedViaAskAI, closeChat, toggleChat } =
    useChatBot();
  const { user } = useAuth();
  const { isPolicyBannerVisible, handlePrivacyBannerDismiss } =
    usePrivacyBanner();

  const {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    setIsLoading,
    pinnedProduct,
    messagesEndRef,
    chatContainerSmallRef,
    chatContainerLargeRef,
    scrollToBottom,
    sendMessage,
    handleQuickQuestion,
    handleKeyPress,
    handleSendClick,
    handleProductPin,
  } = useChatLogic(currentProduct);

  // Scroll to bottom of chat messages when opened via Ask AI
  useEffect(() => {
    if (isOpen && openedViaAskAI) {
      // Ultra-smooth progressive scrolling with gentle timing
      scrollToBottom(true, 300);
      scrollToBottom(true, 700);
      scrollToBottom(true, 1100);
      scrollToBottom(true, 1500);
    }
  }, [isOpen, openedViaAskAI, scrollToBottom]);

  // Handle product query when product context is provided and chat opens
  useEffect(() => {
    if (currentProduct && isOpen) {
      const askAboutProduct = async () => {
        const userMessage = `Tell me about ${currentProduct.name} - provide a brief overview including its benefits, dosage, and key ingredients.`;

        // Add user message first
        const userBubble = { role: "user" as const, content: userMessage };
        setMessages((prev) => [...prev, userBubble]);
        setIsLoading(true);

        try {
          const response = await aiApi.chat(userMessage, currentProduct.id);
          const aiMessage = {
            role: "assistant" as const,
            content: response.response,
            suggestedProducts: response.suggestedProducts || [],
          };
          setMessages((prev) => [...prev, aiMessage]);

          // Ensure ultra-smooth scroll to bottom after product AI response
          scrollToBottom(true, 400);
          scrollToBottom(true, 800);
        } catch (error) {
          console.error("Error getting product information:", error);
          const errorMessage = {
            role: "assistant" as const,
            content: `I can help you learn about ${currentProduct.name}. Feel free to ask me any questions about its benefits, dosage, ingredients, or suitability for your needs.`,
          };
          setMessages((prev) => [...prev, errorMessage]);

          // Ensure ultra-smooth scroll to bottom after error message
          scrollToBottom(true, 400);
          scrollToBottom(true, 800);
        } finally {
          setIsLoading(false);
        }
      };

      // Only ask about product if we don't already have messages about this product
      const hasProductQuery = messages.some(
        (msg) =>
          msg.role === "user" && msg.content.includes(currentProduct.name)
      );

      if (!hasProductQuery && !isLoading) {
        askAboutProduct();
      }
    }
  }, [
    currentProduct,
    isOpen,
    isLoading,
    messages,
    setMessages,
    setIsLoading,
    scrollToBottom,
  ]);

  // Don't render chatbot if user is not logged in
  if (!user) {
    return null;
  }

  // If chat is not open, show the sticky floating button
  if (!isOpen) {
    return <FloatingChatButton onClick={toggleChat} />;
  }

  return (
    <>
      {/* Chat window for screens <= 1500px - positioned relative to screen */}
      <ChatWindow
        currentProduct={currentProduct}
        messages={messages}
        isLoading={isLoading}
        inputValue={inputValue}
        pinnedProduct={pinnedProduct}
        isPolicyBannerVisible={isPolicyBannerVisible}
        chatContainerRef={chatContainerSmallRef}
        messagesEndRef={messagesEndRef}
        onClose={closeChat}
        onInputChange={setInputValue}
        onSend={handleSendClick}
        onKeyPress={handleKeyPress}
        onQuickQuestion={handleQuickQuestion}
        onProductPin={handleProductPin}
        onPrivacyBannerDismiss={handlePrivacyBannerDismiss}
        containerClassName="fixed inset-x-2 bottom-2 sm:inset-x-auto sm:bottom-4 sm:right-4 md:bottom-4 lg:bottom-6 md:right-6 z-50 sm:w-[calc(100%-2rem)] md:w-auto max-[1500px]:block hidden"
        showVoiceInput={true}
      />

      {/* Chat window for screens > 1500px - constrained to content area */}
      <div className="fixed inset-0 z-50 pointer-events-none min-[1501px]:block hidden">
        <div className="max-w-[1500px] mx-auto h-full relative py-8">
          <div className="absolute bottom-0 right-2 sm:right-4 md:right-6 pointer-events-auto">
            <ChatWindow
              currentProduct={currentProduct}
              messages={messages}
              isLoading={isLoading}
              inputValue={inputValue}
              pinnedProduct={pinnedProduct}
              isPolicyBannerVisible={isPolicyBannerVisible}
              chatContainerRef={chatContainerLargeRef}
              messagesEndRef={messagesEndRef}
              onClose={closeChat}
              onInputChange={setInputValue}
              onSend={handleSendClick}
              onKeyPress={handleKeyPress}
              onQuickQuestion={handleQuickQuestion}
              onProductPin={handleProductPin}
              onPrivacyBannerDismiss={handlePrivacyBannerDismiss}
              windowClassName="w-full max-w-none sm:max-w-sm md:max-w-md bg-white rounded-xl shadow-2xl flex flex-col h-[calc(100vh-4rem)] max-h-[600px] overflow-hidden border border-gray-200"
              showVoiceInput={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
