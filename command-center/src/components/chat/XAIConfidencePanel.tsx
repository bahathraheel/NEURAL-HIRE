'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText, Scale, Database, Globe, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Citation, ExtractedEntity } from '@/types';

interface XAIConfidencePanelProps {
  confidence: number;
  citations: Citation[];
  entities?: ExtractedEntity[];
}

const getConfidenceColor = (score: number) => {
  if (score >= 0.8) return '#059669'; // emerald
  if (score >= 0.6) return '#f59e0b'; // amber
  return '#dc2626'; // crimson
};

const CitationIcon = ({ type }: { type: Citation['type'] }) => {
  switch (type) {
    case 'fir': return <FileText size={14} className="text-blue-500" />;
    case 'law': return <Scale size={14} className="text-purple-500" />;
    case 'data': return <Database size={14} className="text-emerald-500" />;
    case 'osint': return <Globe size={14} className="text-amber-500" />;
  }
};

export function XAIConfidencePanel({ confidence, citations, entities }: XAIConfidencePanelProps) {
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);
  
  const score = Math.round(confidence * 100);
  const color = getConfidenceColor(confidence);
  const circumference = 2 * Math.PI * 24; // r=24
  const strokeDashoffset = circumference - (confidence * circumference);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-background-subtle border border-border rounded-xl p-4 w-full flex flex-col gap-4 shadow-sm"
    >
      {/* Header & Gauge */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32" cy="32" r="24"
              stroke="currentColor" strokeWidth="6" fill="transparent"
              className="text-gray-200"
            />
            <motion.circle
              cx="32" cy="32" r="24"
              stroke={color} strokeWidth="6" fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-foreground">
            {score}%
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground flex items-center gap-1.5">
            AI Confidence Score
            <AlertCircle size={14} className="text-foreground-muted cursor-help" />
          </h4>
          <p className="text-xs text-foreground-secondary mt-0.5 leading-relaxed text-balance">
            This prediction is legally defensible based on cross-referenced official databases and penal code matching.
          </p>
        </div>
      </div>

      {/* Extracted Entities */}
      {entities && entities.length > 0 && (
        <div className="pt-2 border-t border-border">
          <h5 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
            Extracted Entities
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {entities.map(e => (
              <span key={e.id} className="px-2 py-1 rounded bg-background border border-border text-xs flex items-center gap-1">
                <span className="font-medium text-foreground opacity-70">{e.type}:</span>
                <span className="text-foreground">{e.value}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Citations Tree */}
      <div className="pt-2 border-t border-border">
        <h5 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
          Citation Tree
        </h5>
        <div className="space-y-1.5">
          {citations.map((cit, idx) => {
            const isExpanded = expandedCitation === cit.id;
            return (
              <motion.div
                key={cit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedCitation(isExpanded ? null : cit.id)}
                  className="w-full flex items-center justify-between p-2.5 hover:bg-background-muted transition-colors text-left"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <CitationIcon type={cit.type} />
                    <span className="text-sm font-medium text-foreground truncate">{cit.source}</span>
                  </div>
                  <ChevronDown size={16} className={cn('text-foreground-muted transition-transform shrink-0', isExpanded && 'rotate-180')} />
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-2.5 pb-2.5 pt-0"
                    >
                      <div className="text-xs text-foreground-secondary bg-background-muted p-2 rounded-md">
                        <p className="mb-1">{cit.reference}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] uppercase font-semibold text-foreground-muted">Relevance:</span>
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-trust-blue" style={{ width: `${cit.relevance * 100}%` }} />
                          </div>
                          <span className="text-[10px] font-medium">{Math.round(cit.relevance * 100)}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 flex justify-end">
        <button className="btn-ghost text-xs text-foreground-muted hover:text-crimson">
          Challenge This Logic
        </button>
      </div>
    </motion.div>
  );
}
