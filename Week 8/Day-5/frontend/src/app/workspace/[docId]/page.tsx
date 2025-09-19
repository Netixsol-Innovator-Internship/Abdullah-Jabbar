// typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SummaryCard from '@/components/SummaryCard';
import HighlightsList from '@/components/HighlightsList';
import ChatBox from '@/components/ChatBox';
import { getDocument } from '@/lib/api';
import type { Document as DocType } from '@/lib/types';
import { escapeHtml } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  sources?: Array<{
    pageNumbers: number[];
    snippet?: string;
  }>;
}

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.docId as string;
  
  const [document, setDocument] = useState<DocType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId]);

  const loadDocument = async () => {
    setIsLoading(true);
    try {
      const doc = await getDocument(docId);
      // sanitize fields that will be rendered as text
      doc.fileName = escapeHtml(doc.fileName);
      doc.category = escapeHtml(doc.category);
      setDocument(doc);
      
      // Add initial system message
      setMessages([{
        id: 'initial',
        type: 'system',
        content: 'Document uploaded and summarized. Ask a question about the document.',
      }]);
    } catch (error) {
      console.error('Failed to load document:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSystemMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  if (isLoading || !document) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
          <span className="text-lg text-gray-600">Loading document...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Panel - Document Info + Summary + Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-md rounded-2xl p-6 max-h-[80vh] overflow-auto"
          >
            <SummaryCard document={document} />

            <div className="mt-6">
              <HighlightsList highlights={document.highlights} rawHighlights={document.rawHighlights} />
            </div>
          </motion.div>

          {/* Right Panel - Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-md rounded-2xl p-6 flex flex-col h-[80vh]"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Q&A</h2>
            
            <ChatBox
              docId={docId}
              initialMessages={messages}
              onUpdateDocument={(m) => handleNewSystemMessage(m)}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}