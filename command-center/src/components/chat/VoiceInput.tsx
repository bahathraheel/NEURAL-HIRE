'use client';

import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';

export function VoiceInput() {
  const { isRecording, setRecording, addMessage } = useChatStore();

  const handleToggle = () => {
    if (isRecording) {
      setRecording(false);
    } else {
      setRecording(true);
      // Simulate speech recognition ending after 3 seconds
      setTimeout(() => {
        setRecording(false);
        addMessage({
          id: `msg-${Date.now()}`,
          role: 'user',
          content: 'Show me the suspect profile for case FIR/2024/4421',
          timestamp: new Date(),
        });
      }, 3000);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulsing background when recording */}
      {isRecording && (
        <motion.div
          className="absolute inset-0 bg-crimson-light rounded-full z-0"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      
      <button
        onClick={handleToggle}
        className={cn(
          'relative z-10 p-3 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm',
          isRecording 
            ? 'bg-crimson text-white shadow-glow-crimson scale-110' 
            : 'bg-background-muted text-foreground-secondary hover:bg-trust-blue hover:text-white'
        )}
      >
        <Mic size={20} />
      </button>

      {/* Recording Indicator Tooltip */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-2 whitespace-nowrap"
        >
          <div className="flex items-end gap-0.5 h-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-crimson rounded-t-sm"
                animate={{ height: ['4px', '12px', '4px'] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
          Listening...
        </motion.div>
      )}
    </div>
  );
}
