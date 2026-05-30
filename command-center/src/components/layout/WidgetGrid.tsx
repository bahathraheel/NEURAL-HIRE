'use client';

import { motion } from 'framer-motion';
import { FolderOpen, Users, ShieldAlert, Brain, MoreHorizontal } from 'lucide-react';

interface WidgetGridProps {
  networkGraphWidget?: React.ReactNode;
}

export function WidgetGrid({ networkGraphWidget }: WidgetGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <motion.div variants={item} className="widget-card p-5 flex items-start justify-between group">
          <div>
            <p className="text-sm font-medium text-foreground-secondary mb-1">Active Cases</p>
            <h3 className="text-3xl font-bold text-foreground">247</h3>
            <p className="text-xs font-medium text-crimson mt-1 flex items-center">
              <span className="mr-1">↑</span> 12% from last week
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-trust-blue-pale flex items-center justify-center text-trust-blue group-hover:scale-110 transition-transform">
            <FolderOpen size={24} />
          </div>
        </motion.div>

        {/* Stat 2 */}
        <motion.div variants={item} className="widget-card p-5 flex items-start justify-between group">
          <div>
            <p className="text-sm font-medium text-foreground-secondary mb-1">Suspects Tracked</p>
            <h3 className="text-3xl font-bold text-foreground">1,847</h3>
            <p className="text-xs font-medium text-crimson mt-1 flex items-center">
              <span className="mr-1">↑</span> 5% from last week
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-light flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
        </motion.div>

        {/* Stat 3 */}
        <motion.div variants={item} className="widget-card p-5 flex items-start justify-between group">
          <div>
            <p className="text-sm font-medium text-foreground-secondary mb-1">Threat Level</p>
            <h3 className="text-2xl font-bold text-amber">ELEVATED</h3>
            <p className="text-xs font-medium text-foreground-secondary mt-1">
              Based on intel reports
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-crimson-light flex items-center justify-center text-crimson group-hover:scale-110 transition-transform animate-pulse-slow">
            <ShieldAlert size={24} />
          </div>
        </motion.div>

        {/* Stat 4 */}
        <motion.div variants={item} className="widget-card p-5 flex items-start justify-between group">
          <div>
            <p className="text-sm font-medium text-foreground-secondary mb-1">AI Insights Today</p>
            <h3 className="text-3xl font-bold text-foreground">34</h3>
            <p className="text-xs font-medium text-emerald mt-1 flex items-center">
              <span className="mr-1">↑</span> 18% from yesterday
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-light flex items-center justify-center text-emerald group-hover:scale-110 transition-transform">
            <Brain size={24} />
          </div>
        </motion.div>
      </div>

      {/* Main Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Graph spans 2 or 3 cols depending on layout */}
        <motion.div variants={item} className="lg:col-span-3">
          {networkGraphWidget || (
            <div className="widget-card p-6 h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold">Criminal Network Analysis</h2>
                  <p className="text-sm text-foreground-secondary">Loading visualization...</p>
                </div>
                <button className="text-foreground-secondary hover:text-foreground"><MoreHorizontal size={20} /></button>
              </div>
              <div className="flex-1 bg-background-subtle rounded-lg border border-border flex items-center justify-center">
                <span className="text-foreground-muted">Network Graph Placeholder</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Bottom row placeholders */}
        <motion.div variants={item} className="widget-card p-6 h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold">Crime Heatmap</h2>
            <button className="text-foreground-secondary hover:text-foreground"><MoreHorizontal size={20} /></button>
          </div>
          <div className="flex-1 bg-background-subtle rounded-lg border border-border flex items-center justify-center">
            <span className="text-foreground-muted">Map Placeholder</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="widget-card p-6 h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold">Recent FIRs</h2>
            <button className="text-foreground-secondary hover:text-foreground"><MoreHorizontal size={20} /></button>
          </div>
          <div className="flex-1 bg-background-subtle rounded-lg border border-border flex items-center justify-center">
            <span className="text-foreground-muted">List Placeholder</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="widget-card p-6 h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold">Financial Flow Analysis</h2>
            <button className="text-foreground-secondary hover:text-foreground"><MoreHorizontal size={20} /></button>
          </div>
          <div className="flex-1 bg-background-subtle rounded-lg border border-border flex items-center justify-center">
            <span className="text-foreground-muted">Sankey Placeholder</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
