'use client';

import { motion } from 'framer-motion';
import { Bot, User as UserIcon, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType, ExtractedEntity } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  showXAI?: boolean;
}

const getEntityColor = (type: ExtractedEntity['type']) => {
  switch (type) {
    case 'person': return 'bg-red-100 text-red-700 border-red-200';
    case 'location': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'vehicle': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
    case 'phone': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-blue-100 text-blue-700 border-blue-200';
  }
};

const getConfidenceColor = (score: number) => {
  if (score >= 0.8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (score >= 0.6) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

export function ChatMessage({ message, showXAI = false }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-4 w-full', isAssistant ? 'justify-start' : 'justify-end')}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-trust-blue-pale text-trust-blue flex items-center justify-center shrink-0 mt-1">
          <Bot size={18} />
        </div>
      )}

      {/* Message Content */}
      <div className={cn('flex flex-col max-w-[80%]', isAssistant ? 'items-start' : 'items-end')}>
        <div
          className={cn(
            'px-4 py-3 rounded-2xl whitespace-pre-wrap',
            isAssistant
              ? 'bg-white border border-border text-foreground rounded-bl-sm shadow-sm'
              : 'bg-trust-blue text-white rounded-br-sm shadow-md'
          )}
        >
          {/* Text Content */}
          <div className="text-sm leading-relaxed">{message.content}</div>

          {/* Attachments Preview (if any) */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-black/10 backdrop-blur-sm"
                >
                  {file.type === 'image' ? <ImageIcon size={16} /> : <FileText size={16} />}
                  <span className="text-xs truncate max-w-[150px]">{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* XAI Enhancements for Assistant Messages */}
        {isAssistant && showXAI && (message.confidence || (message.entities && message.entities.length > 0)) && (
          <div className="mt-2 flex flex-col gap-2 w-full max-w-sm">
            {/* Confidence Badge */}
            {message.confidence && (
              <div className={cn(
                'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border w-fit',
                getConfidenceColor(message.confidence)
              )}>
                <CheckCircle2 size={12} />
                <span>{(message.confidence * 100).toFixed(0)}% Confidence</span>
              </div>
            )}

            {/* Extracted Entities */}
            {message.entities && message.entities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {message.entities.map(entity => (
                  <span
                    key={entity.id}
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1',
                      getEntityColor(entity.type)
                    )}
                  >
                    <span className="uppercase opacity-70 tracking-wider">{entity.type}</span>
                    <span>{entity.value}</span>
                  </span>
                ))}
              </div>
            )}
            
            {/* Minimal Citation summary button (just a hint) */}
            {message.citations && message.citations.length > 0 && (
               <div className="text-[11px] text-foreground-muted flex items-center gap-1 hover:text-trust-blue cursor-pointer transition-colors">
                  <FileText size={12} />
                  <span>{message.citations.length} Sources cited in XAI Panel</span>
               </div>
            )}
          </div>
        )}

        <span className="text-[10px] text-foreground-muted mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-background-muted text-foreground-secondary border border-border flex items-center justify-center shrink-0 mt-1">
          <UserIcon size={18} />
        </div>
      )}
    </motion.div>
  );
}
