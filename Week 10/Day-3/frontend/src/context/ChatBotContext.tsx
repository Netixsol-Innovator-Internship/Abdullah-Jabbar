"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatBotContextType {
  isOpen: boolean;
  currentProduct: { name: string; id: string } | null;
  openedViaAskAI: boolean;
  openChatWithProduct: (productName: string, productId: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export const useChatBot = () => {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error("useChatBot must be used within a ChatBotProvider");
  }
  return context;
};

interface ChatBotProviderProps {
  children: ReactNode;
}

export const ChatBotProvider: React.FC<ChatBotProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [openedViaAskAI, setOpenedViaAskAI] = useState(false);

  const openChatWithProduct = (productName: string, productId: string) => {
    setCurrentProduct({ name: productName, id: productId });
    setOpenedViaAskAI(true);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setOpenedViaAskAI(false);
    // Don't clear currentProduct immediately to allow for smooth transitions
    setTimeout(() => setCurrentProduct(null), 300);
  };

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      setOpenedViaAskAI(false);
      setIsOpen(true);
    }
  };

  return (
    <ChatBotContext.Provider
      value={{
        isOpen,
        currentProduct,
        openedViaAskAI,
        openChatWithProduct,
        closeChat,
        toggleChat,
      }}
    >
      {children}
    </ChatBotContext.Provider>
  );
};
