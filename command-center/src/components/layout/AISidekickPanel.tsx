'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';

export function AISidekickPanel({ children }: { children: React.ReactNode }) {
  const { isSidekickOpen, toggleSidekick } = useChatStore();

  return (
    <>
      <AnimatePresence>
        {!isSidekickOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleSidekick}
            className="absolute right-6 bottom-6 z-50 w-14 h-14 bg-trust-blue text-white rounded-full shadow-glow-blue flex items-center justify-center hover:bg-trust-blue-light transition-colors"
          >
            <Sparkles size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ width: isSidekickOpen ? 420 : 0, opacity: isSidekickOpen ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-full bg-background/95 backdrop-blur-md border-l border-border flex flex-col shrink-0 relative z-30"
        style={{ overflow: 'hidden' }}
      >
        <div className="w-[420px] h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-border bg-background">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-trust-blue-pale flex items-center justify-center text-trust-blue">
                <Sparkles size={16} />
              </div>
              <span className="font-semibold text-foreground">AI Co-Pilot</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 ml-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <button
              onClick={toggleSidekick}
              className="p-2 text-foreground-secondary hover:bg-background-muted rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </motion.div>
    </>
  );
}
