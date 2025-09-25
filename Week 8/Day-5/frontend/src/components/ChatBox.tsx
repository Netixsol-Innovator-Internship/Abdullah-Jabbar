"use client";

import React, { useRef, useState, useEffect } from "react";
import { Send, Copy } from "lucide-react";
import { submitQuery } from "@/lib/api";

type Message = {
  id: string;
  type: "user" | "system";
  content: string;
  sources?: Array<{ pageNumbers: number[]; snippet?: string }>;
};

export default function ChatBox({
  docId,
  initialMessages = [],
  onUpdateDocument,
}: {
  docId: string;
  initialMessages?: Message[];
  onUpdateDocument?: (m: Message) => void;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isQuerying) return;

    if (input.length > 1000) {
      setError("Question exceeds maximum length of 1000 characters.");
      return;
    }

    const userMessage: Message = {
      // Use a slightly more unique id to avoid collisions when created rapidly
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      type: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsQuerying(true);

    // Optimistic system message placeholder
    const systemId = `sys-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const placeholder: Message = {
      id: systemId,
      type: "system",
      content: "Thinking...",
      sources: [],
    };
    setMessages((prev) => [...prev, placeholder]);

    try {
      let streamedText = "";
      const response = await submitQuery({
        docId,
        question: userMessage.content,
        onChunk: (chunk) => {
          // update placeholder with streaming content
          streamedText += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === systemId ? { ...m, content: streamedText } : m
            )
          );
        },
      });

      // If backend didn't stream, response will be available here
      const finalMessage: Message = {
        id: `sys-${Date.now() + 1}`,
        type: "system",
        content: response.answer,
        sources: response.sources,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === systemId ? finalMessage : m))
      );
      if (onUpdateDocument) onUpdateDocument(finalMessage);
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id.startsWith("sys-")
            ? {
                ...m,
                content:
                  "Sorry, I encountered an error processing your question. Please try again.",
              }
            : m
        )
      );
    } finally {
      setIsQuerying(false);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 overflow-auto mb-4 space-y-4"
        role="log"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={
                message.type === "user"
                  ? "self-end bg-blue-100 rounded-xl p-3 max-w-[75%]"
                  : "self-start bg-gray-100 rounded-xl p-3 max-w-[75%]"
              }
            >
              <div className="text-sm text-gray-900 whitespace-pre-wrap">
                {message.content}
              </div>

              {message.type === "system" &&
                message.sources &&
                message.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.sources.map((s, idx) => (
                      <div
                        key={`${message.id}-source-${idx}`}
                        className="flex items-center gap-2"
                      >
                        {s.pageNumbers.map((p) => (
                          <span
                            key={`${message.id}-page-${p}`}
                            className="text-xs bg-gray-100 px-2 py-1 rounded-md"
                          >{`Page ${p}`}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

              {message.type === "system" && (
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    aria-label={`Copy answer ${message.id}`}
                    className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-xs cursor-pointer"
                    onClick={() => handleCopy(message.content, message.id)}
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedId === message.id ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-auto">
        <label htmlFor="chat-input" className="sr-only">
          Ask a question about the document
        </label>
        <div className="flex gap-2">
          <input
            id="chat-input"
            aria-label="Ask a question about the document"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-black  placeholder-gray-400 focus:outline-none"
            placeholder="Ask a question..."
            maxLength={1000}
            disabled={isQuerying}
          />
          <button
            type="submit"
            aria-label="Send question"
            disabled={isQuerying}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <Send />
            <span>Send</span>
          </button>
        </div>

        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
}
