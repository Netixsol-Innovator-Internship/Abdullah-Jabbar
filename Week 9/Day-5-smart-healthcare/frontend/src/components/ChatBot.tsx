"use client";
import React, { useState, useEffect, useRef } from "react";
import { Smile, Send, X, MessageCircle } from "lucide-react";
import { aiApi } from "../services/api";
import { Product } from "../types";
import AgentBubble from "./AgentBubble";
import QuickQuestions from "./QuickQuestions";
import { useChatBot } from "../context/ChatBotContext";

// --- Small Utility Components ---

// Component for the User's message bubbles
const UserBubble: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex justify-end mb-2">
    <div className="max-w-[85%] rounded-t-xl rounded-bl-xl rounded-br-sm bg-indigo-600 p-3 text-white shadow-sm">
      {message}
    </div>
  </div>
);

// Component for the Agent's profile/name display within the chat
// const AgentHeaderBlock: React.FC<{ name: string }> = ({ name }) => (
//   <div className="flex items-center space-x-3 mb-4 py-3">
//     {/* Simple 'C' logo like in the image */}
//     <div className="w-8 h-8 bg-black flex items-center justify-center rounded-full flex-shrink-0">
//       <span className="text-white font-bold text-lg">C</span>
//     </div>
//     <div>
//       <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
//     </div>
//   </div>
// );

// Message interface
interface Message {
  role: "user" | "assistant";
  content: string;
  suggestedProducts?: Product[];
}

// --- Main Chat Widget Component ---

export default function ChatBot() {
  const { isOpen, currentProduct, openedViaAskAI, closeChat, toggleChat } =
    useChatBot();
  // State to manage the visibility of the privacy policy banner
  // Check localStorage to see if user has previously dismissed it
  const [isPolicyBannerVisible, setIsPolicyBannerVisible] = useState(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem(
        "healthcareAI-privacyBannerDismissed"
      );
      return dismissed !== "true";
    }
    return true;
  });
  // State for chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  // State for user input
  const [inputValue, setInputValue] = useState("");
  // State for loading
  const [isLoading, setIsLoading] = useState(false);
  // State for tracking which product is pinned
  const [pinnedProduct, setPinnedProduct] = useState<string | null>(null);
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Refs for chat container scrolling (separate for small and large screens)
  const chatContainerSmallRef = useRef<HTMLDivElement>(null);
  const chatContainerLargeRef = useRef<HTMLDivElement>(null);

  // Helper function to scroll to bottom with natural smooth behavior
  const scrollToBottom = (smooth = true, delay = 0) => {
    const performScroll = () => {
      // Try scrolling the small screen container
      if (chatContainerSmallRef.current) {
        const container = chatContainerSmallRef.current;
        container.scrollTo({
          top: container.scrollHeight,
          behavior: smooth ? "smooth" : "auto",
        });
      }
      // Try scrolling the large screen container
      if (chatContainerLargeRef.current) {
        const container = chatContainerLargeRef.current;
        container.scrollTo({
          top: container.scrollHeight,
          behavior: smooth ? "smooth" : "auto",
        });
      }
      // Fallback method
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "end",
        });
      }
    };

    if (delay > 0) {
      setTimeout(performScroll, delay);
    } else {
      performScroll();
    }
  };

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    // Scroll when new messages are added or when loading stops (response received)
    if (messages.length > 0) {
      // Ultra-smooth scroll with optimized timing
      scrollToBottom(true, 200);
      // Additional gentle scroll to ensure we're at the bottom
      scrollToBottom(true, 500);
    }
  }, [messages, isLoading]);

  // Scroll to bottom of chat messages when opened via Ask AI
  useEffect(() => {
    if (isOpen && openedViaAskAI) {
      // Ultra-smooth progressive scrolling with gentle timing
      scrollToBottom(true, 300);
      scrollToBottom(true, 700);
      scrollToBottom(true, 1100);
      scrollToBottom(true, 1500);
    }
  }, [isOpen, openedViaAskAI]);

  // Handle product query when product context is provided and chat opens
  useEffect(() => {
    if (currentProduct && isOpen) {
      const askAboutProduct = async () => {
        const userMessage = `Tell me about ${currentProduct.name} - provide a brief overview including its benefits, dosage, and key ingredients.`;

        // Add user message first
        const userBubble: Message = { role: "user", content: userMessage };
        setMessages((prev) => [...prev, userBubble]);
        setIsLoading(true);

        try {
          const response = await aiApi.chat(userMessage, currentProduct.id);
          const aiMessage: Message = {
            role: "assistant",
            content: response.response,
            suggestedProducts: response.suggestedProducts || [],
          };
          setMessages((prev) => [...prev, aiMessage]);

          // Ensure ultra-smooth scroll to bottom after product AI response
          scrollToBottom(true, 400);
          scrollToBottom(true, 800);
        } catch (error) {
          console.error("Error getting product information:", error);
          const errorMessage: Message = {
            role: "assistant",
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
  }, [currentProduct, isOpen, isLoading, messages]);

  // Function to send message to AI
  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await aiApi.chat(message, currentProduct?.id);
      const aiMessage: Message = {
        role: "assistant",
        content: response.response,
        suggestedProducts: response.suggestedProducts || [],
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Ensure ultra-smooth scroll to bottom after AI response
      scrollToBottom(true, 400);
      scrollToBottom(true, 800);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I'm having trouble responding right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Ensure ultra-smooth scroll to bottom after error message
      scrollToBottom(true, 400);
      scrollToBottom(true, 800);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick question click
  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    sendMessage(question);
  };

  // Handle input key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Handle send button click
  const handleSendClick = () => {
    sendMessage(inputValue);
  };

  // Handle product pinning - only one product can be pinned at a time
  const handleProductPin = (productName: string) => {
    if (pinnedProduct === productName) {
      // If clicking the same product, unpin it
      setPinnedProduct(null);
    } else {
      // Pin this product (automatically unpins any other)
      setPinnedProduct(productName);
    }
  };

  // Handle privacy policy banner dismissal
  const handlePrivacyBannerDismiss = () => {
    setIsPolicyBannerVisible(false);
    // Save dismissal to localStorage so it stays dismissed
    if (typeof window !== "undefined") {
      localStorage.setItem("healthcareAI-privacyBannerDismissed", "true");
    }
  };

  // If chat is not open, show the sticky floating button
  if (!isOpen) {
    return (
      <>
        {/* Button for screens <= 1500px - stays at screen edge */}
        <div className="fixed bottom-0 right-0 z-50 p-2 sm:p-4 md:p-6 pointer-events-none max-[1500px]:block hidden">
          <button
            onClick={toggleChat}
            className="bg-indigo-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-all duration-300 hover:scale-110 pointer-events-auto min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Open AI Chat Assistant"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          </button>
        </div>

        {/* Button for screens > 1500px - constrained to content area */}
        <div className="fixed inset-0 z-50 pointer-events-none min-[1501px]:block hidden">
          <div className="max-w-[1500px] mx-auto h-full relative py-8">
            <div className="absolute bottom-0 right-2 sm:right-4 md:right-6">
              <button
                onClick={toggleChat}
                className="bg-indigo-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-all duration-300 hover:scale-110 pointer-events-auto min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label="Open AI Chat Assistant"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Chat window for screens <= 1500px - positioned relative to screen */}
      <div className="fixed inset-x-2 bottom-2 sm:inset-x-auto sm:bottom-4 sm:right-4 md:bottom-4 lg:bottom-6 md:right-6 z-50 sm:w-[calc(100%-2rem)] md:w-auto max-[1500px]:block hidden">
        <div
          className="
          w-full max-w-none sm:max-w-sm md:max-w-md
          bg-white rounded-xl shadow-2xl
          flex flex-col h-[calc(100vh-1rem)] sm:h-[calc(100vh-6rem)] md:h-[550px] lg:h-[600px] max-h-[600px]
          overflow-hidden
          border border-gray-200
        "
        >
          {/* Widget Header (Black/Dark Bar) */}
          <header className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-lg flex-shrink-0">
            <div className="flex items-center space-x-2">
              {/* Logo and Title */}

              <h1 className="text-lg font-semibold truncate">
                Chatbase AI Agent
              </h1>
            </div>
            {/* Close Button */}
            <button
              onClick={closeChat}
              className="text-gray-400 hover:text-white flex-shrink-0 p-1 bg-gray-800 rounded-full"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Chat Body (Scrollable Messages) */}
          <main
            ref={chatContainerSmallRef}
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
              onProductPin={handleProductPin}
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
                  onProductPin={handleProductPin}
                />
              )
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start mb-2">
                <div className="max-w-[85%] rounded-t-xl rounded-br-xl rounded-bl-sm bg-gray-100 p-3 text-gray-800 shadow-sm">
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
                    <span className="text-sm">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Show quick questions only if no messages yet */}
            {messages.length === 0 && (
              <QuickQuestions onQuestionClick={handleQuickQuestion} />
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </main>

          {/* Input Area */}
          <footer className="border-t border-gray-200 bg-white flex-shrink-0">
            {/* Privacy Policy Banner (Dismissible) */}
            {isPolicyBannerVisible && (
              <div className="bg-gray-100 p-2 text-xs flex items-center justify-between border-t border-b border-gray-200">
                <p className="text-gray-600">
                  By chatting, you agree to our{" "}
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500 underline"
                  >
                    privacy policy.
                  </a>
                </p>
                <button
                  onClick={handlePrivacyBannerDismiss}
                  className="text-gray-500 hover:text-gray-800 transition p-1"
                  aria-label="Close privacy policy banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Message Input Field */}
            <div className="p-3 flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="w-full py-3 pl-4 pr-16 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder-gray-500 text-sm disabled:opacity-50"
                />
                {/* Emoji Button */}
                <button className="absolute inset-y-0 right-1.5 flex items-center justify-center w-10 text-gray-400 hover:text-gray-600 transition">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              {/* Send Button */}
              <button
                onClick={handleSendClick}
                disabled={isLoading || !inputValue.trim()}
                className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition duration-300 shadow-md flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* Chat window for screens > 1500px - constrained to content area */}
      <div className="fixed inset-0 z-50 pointer-events-none min-[1501px]:block hidden">
        <div className="max-w-[1500px] mx-auto h-full relative py-8">
          <div className="absolute bottom-0 right-2 sm:right-4 md:right-6 pointer-events-auto">
            <div
              className="
              w-full max-w-none sm:max-w-sm md:max-w-md
              bg-white rounded-xl shadow-2xl
              flex flex-col h-[calc(100vh-4rem)] max-h-[600px]
              overflow-hidden
              border border-gray-200
            "
            >
              {/* Widget Header (Black/Dark Bar) */}
              <header className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-lg flex-shrink-0">
                <div className="flex items-center space-x-2">
                  {/* Logo and Title */}
                  <h1 className="text-lg font-semibold truncate">
                    Chatbase AI Agent
                  </h1>
                </div>
                {/* Close Button */}
                <button
                  onClick={closeChat}
                  className="text-gray-400 hover:text-white flex-shrink-0 p-1 bg-gray-800 rounded-full"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>

              {/* Chat Body (Scrollable Messages) */}
              <main
                ref={chatContainerLargeRef}
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
                  onProductPin={handleProductPin}
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
                      onProductPin={handleProductPin}
                    />
                  )
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start mb-2">
                    <div className="max-w-[85%] rounded-t-xl rounded-br-xl rounded-bl-sm bg-gray-100 p-3 text-gray-800 shadow-sm">
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
                        <span className="text-sm">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show quick questions only if no messages yet */}
                {messages.length === 0 && (
                  <QuickQuestions onQuestionClick={handleQuickQuestion} />
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </main>

              {/* Input Area */}
              <footer className="border-t border-gray-200 bg-white flex-shrink-0">
                {/* Privacy Policy Banner (Dismissible) */}
                {isPolicyBannerVisible && (
                  <div className="bg-gray-100 p-2 text-xs flex items-center justify-between border-t border-b border-gray-200">
                    <p className="text-gray-600">
                      By chatting, you agree to our{" "}
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500 underline"
                      >
                        privacy policy.
                      </a>
                    </p>
                    <button
                      onClick={handlePrivacyBannerDismiss}
                      className="text-gray-500 hover:text-gray-800 transition p-1"
                      aria-label="Close privacy policy banner"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Message Input Field */}
                <div className="p-3 flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="w-full py-3 pl-4 pr-16 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder-gray-500 text-sm disabled:opacity-50"
                    />
                    {/* Emoji Button */}
                    <button className="absolute inset-y-0 right-1.5 flex items-center justify-center w-10 text-gray-400 hover:text-gray-600 transition">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Send Button */}
                  <button
                    onClick={handleSendClick}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition duration-300 shadow-md flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
