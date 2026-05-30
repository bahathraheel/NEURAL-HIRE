'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Paperclip, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

const filters = ['All', 'Cases', 'Suspects', 'Locations'];

export function GlobalSearchBar() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
      className={cn(
        'w-full max-w-4xl mx-auto flex items-center h-14 px-4 rounded-xl glass-panel transition-shadow duration-300',
        isFocused ? 'shadow-lg border-trust-blue-light' : 'shadow-sm border-border'
      )}
    >
      <Search className="text-foreground-muted shrink-0 mr-3" size={20} />
      
      <input
        type="text"
        placeholder="Search cases, suspects, locations, or ask AI..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-foreground-muted text-base"
      />

      <div className="flex items-center gap-2 ml-4 shrink-0">
        <div className="hidden md:flex items-center gap-1 mr-2 border-r border-border pr-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                activeFilter === filter
                  ? 'bg-trust-blue text-white'
                  : 'bg-background-muted text-foreground-secondary hover:bg-border-hover'
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <button className="p-2 rounded-full text-foreground-secondary hover:bg-background-muted transition-colors">
          <Paperclip size={18} />
        </button>
        <button className="p-2 rounded-full text-foreground-secondary hover:bg-background-muted transition-colors">
          <Mic size={18} />
        </button>
      </div>
    </motion.div>
  );
}
