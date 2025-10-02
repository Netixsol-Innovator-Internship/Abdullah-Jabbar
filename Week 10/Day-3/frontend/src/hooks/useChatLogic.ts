import { useState, useEffect, useRef } from "react";
import { aiApi } from "../services/api";
import { Product } from "../types";

export interface Message {
  role: "user" | "assistant";
  content: string;
  suggestedProducts?: Product[];
}

export const useChatLogic = (
  currentProduct?: { name: string; id: string } | null
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pinnedProduct, setPinnedProduct] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Handle product pinning
  const handleProductPin = (productName: string) => {
    if (pinnedProduct === productName) {
      setPinnedProduct(null);
    } else {
      setPinnedProduct(productName);
    }
  };

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(true, 200);
      scrollToBottom(true, 500);
    }
  }, [messages, isLoading]);

  return {
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
  };
};
