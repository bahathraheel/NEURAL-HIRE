'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldAlert, FileText, Activity, Network } from 'lucide-react';
import { useNetworkStore } from '@/stores/networkStore';
import { mockNodes, mockEdges } from '@/data/mockNetworkData';
import { RISK_COLORS, NODE_TYPES } from '@/lib/constants';

export function NodeDetailPanel() {
  const { isDetailPanelOpen, selectedNodeId, setDetailPanelOpen, selectNode } = useNetworkStore();

  const node = mockNodes.find((n) => n.id === selectedNodeId);
  const connections = mockEdges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId);

  const handleClose = () => {
    setDetailPanelOpen(false);
    setTimeout(() => selectNode(null), 300); // Clear after animation
  };

  return (
    <AnimatePresence>
      {isDetailPanelOpen && node && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute right-0 top-0 bottom-0 w-[340px] bg-white border-l border-border shadow-xl z-10 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-border flex justify-between items-start bg-background-subtle">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ 
                  backgroundColor: `${NODE_TYPES[node.data.nodeType]?.color || '#cbd5e1'}20`, 
                  color: NODE_TYPES[node.data.nodeType]?.color || '#cbd5e1' 
                }}
              >
                {/* Simplified icon rendering for panel, using default User if undefined */}
                <div className="w-5 h-5 rounded-full bg-current opacity-20" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg leading-tight">{node.data.label}</h3>
                <p className="text-xs text-foreground-secondary">{node.data.subtitle}</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-1.5 text-foreground-secondary hover:bg-background-muted rounded-md transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Risk Assessment */}
            {node.data.riskLevel && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Risk Assessment
                </h4>
                <div 
                  className="w-full px-3 py-2 rounded-lg border flex items-center justify-between"
                  style={{ 
                    backgroundColor: RISK_COLORS[node.data.riskLevel].bg, 
                    borderColor: RISK_COLORS[node.data.riskLevel].border 
                  }}
                >
                  <span className="text-sm font-bold uppercase" style={{ color: RISK_COLORS[node.data.riskLevel].text }}>
                    {node.data.riskLevel} RISK
                  </span>
                  <span className="text-xs font-medium" style={{ color: RISK_COLORS[node.data.riskLevel].text }}>
                    {node.data.riskLevel === 'critical' ? '92/100' : 
                     node.data.riskLevel === 'high' ? '75/100' :
                     node.data.riskLevel === 'medium' ? '45/100' : '15/100'}
                  </span>
                </div>
                {/* Visual Bar */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: node.data.riskLevel === 'critical' ? '92%' : 
                             node.data.riskLevel === 'high' ? '75%' :
                             node.data.riskLevel === 'medium' ? '45%' : '15%',
                      backgroundColor: RISK_COLORS[node.data.riskLevel].text
                    }}
                  />
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} /> Entity Details
              </h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 bg-background-subtle p-3 rounded-lg border border-border">
                {Object.entries(node.data.metadata).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-[10px] text-foreground-muted uppercase font-medium">{key}</span>
                    <span className="text-sm font-medium text-foreground truncate" title={String(value)}>{value as React.ReactNode}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connections */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Network size={14} /> Network Links
              </h4>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <span className="text-2xl font-bold text-foreground">{connections.length}</span>
                  <span className="text-xs text-foreground-secondary ml-1">direct connections</span>
                </div>
                <button className="text-xs font-medium text-trust-blue hover:text-trust-blue-dark flex items-center gap-1">
                  View in Graph <ExternalLink size={12} />
                </button>
              </div>
            </div>

            {/* Mock Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} /> Recent Activity
              </h4>
              <div className="relative border-l-2 border-border ml-2 pl-4 space-y-4">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-crimson ring-4 ring-white" />
                  <p className="text-xs font-medium text-foreground">Flagged in FIR/2024/4421</p>
                  <p className="text-[10px] text-foreground-muted">2 hours ago</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber ring-4 ring-white" />
                  <p className="text-xs font-medium text-foreground">Suspicious transaction detected (₹2.4L)</p>
                  <p className="text-[10px] text-foreground-muted">1 day ago</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-trust-blue ring-4 ring-white" />
                  <p className="text-xs font-medium text-foreground">ANPR Hit at MG Road</p>
                  <p className="text-[10px] text-foreground-muted">3 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border bg-background flex flex-col gap-2">
            <button className="btn-primary w-full text-sm py-2" disabled>Generate Dossier</button>
            <button className="btn-ghost w-full text-sm py-2 border border-border" disabled>Add to Watchlist</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

