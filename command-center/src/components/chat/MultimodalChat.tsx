'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Paperclip, SendHorizontal, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';
import { WELCOME_MESSAGE, getMockResponse } from '@/data/mockChatResponses';
import { ChatMessage } from './ChatMessage';
import { VoiceInput } from './VoiceInput';
import { FileDropZone } from './FileDropZone';
import { XAIConfidencePanel } from './XAIConfidencePanel';

export function MultimodalChat() {
  const { 
    messages, addMessage, isXAIMode, toggleXAIMode, 
    language, setLanguage, isTyping, setTyping, clearAttachments 
  } = useChatStore();
  
  const [input, setInput] = useState('');
  const [showDropzone, setShowDropzone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage(WELCOME_MESSAGE);
    }
  }, [messages.length, addMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isXAIMode]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
      language,
    });
    
    setInput('');
    setShowDropzone(false);
    clearAttachments();
    setTyping(true);

    // Mock AI response delay
    setTimeout(() => {
      addMessage(getMockResponse(input));
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border bg-background/95 backdrop-blur z-10 shrink-0">
        <div className="flex bg-background-muted rounded-md p-1">
          <button 
            onClick={() => setLanguage('en')}
            className={cn("px-3 py-1 text-xs font-medium rounded transition-colors", language === 'en' ? 'bg-white shadow-sm text-foreground' : 'text-foreground-secondary hover:text-foreground')}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('kn')}
            className={cn("px-3 py-1 text-xs font-medium rounded transition-colors", language === 'kn' ? 'bg-white shadow-sm text-foreground' : 'text-foreground-secondary hover:text-foreground')}
          >
            ಕನ್ನಡ
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleXAIMode}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors border", 
              isXAIMode ? 'bg-trust-blue-pale text-trust-blue border-trust-blue-light' : 'bg-background hover:bg-background-muted border-border text-foreground-secondary'
            )}
            title="Toggle Explainable AI Mode"
          >
            {isXAIMode ? <Eye size={14} /> : <EyeOff size={14} />}
            XAI {isXAIMode ? 'ON' : 'OFF'}
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-background hover:bg-background-muted border border-border text-foreground transition-colors">
            <FileText size={14} />
            Report
          </button>
        </div>
      </div>

      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col gap-2">
            <ChatMessage message={msg} showXAI={isXAIMode} />
            
            {/* Show XAI Panel right after the assistant message if XAI is enabled */}
            {isXAIMode && msg.role === 'assistant' && msg.confidence && (
              <div className="pl-12 pr-4 w-full">
                <XAIConfidencePanel 
                  confidence={msg.confidence} 
                  citations={msg.citations || []} 
                  entities={msg.entities} 
                />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-foreground-muted pl-12"
          >
            <div className="flex gap-1">
              <motion.div className="w-1.5 h-1.5 bg-current rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
              <motion.div className="w-1.5 h-1.5 bg-current rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
              <motion.div className="w-1.5 h-1.5 bg-current rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
            </div>
            <span className="text-xs font-medium">Analyzing...</span>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-background border-t border-border shrink-0">
        <AnimatePresence>
          {showDropzone && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mb-2 overflow-hidden"
            >
              <FileDropZone />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 bg-background-subtle border border-border rounded-xl p-2 focus-within:border-trust-blue-light focus-within:shadow-glow-blue transition-all">
          <button 
            onClick={() => setShowDropzone(!showDropzone)}
            className={cn("p-2 rounded-full transition-colors shrink-0", showDropzone ? 'bg-trust-blue-pale text-trust-blue' : 'text-foreground-secondary hover:bg-background-muted hover:text-foreground')}
          >
            <Paperclip size={20} />
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message or drop files..."
            className="flex-1 max-h-32 min-h-[40px] bg-transparent border-none outline-none resize-none py-2 text-sm"
            rows={1}
          />
          
          <VoiceInput />
          
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-trust-blue text-white rounded-full hover:bg-trust-blue-light disabled:opacity-50 disabled:hover:bg-trust-blue transition-colors shrink-0"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
