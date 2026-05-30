'use client';

import { 
  UserRound, Shield, Phone, Landmark, MapPin, Globe, Car, 
  Grid, GitBranch, Circle, Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNetworkStore } from '@/stores/networkStore';
import { NODE_TYPES } from '@/lib/constants';
import type { NodeType } from '@/types';

export function GraphToolbar() {
  const { 
    activeFilters, toggleFilter, 
    layoutMode, setLayoutMode,
    isAIClustering, toggleAIClustering
  } = useNetworkStore();

  const filterConfigs: { type: NodeType; icon: React.ElementType; label: string }[] = [
    { type: 'suspect', icon: UserRound, label: 'Suspect' },
    { type: 'victim', icon: Shield, label: 'Victim' },
    { type: 'phone', icon: Phone, label: 'Phone' },
    { type: 'bankAccount', icon: Landmark, label: 'Bank' },
    { type: 'location', icon: MapPin, label: 'Location' },
    { type: 'osint', icon: Globe, label: 'OSINT' },
    { type: 'vehicle', icon: Car, label: 'Vehicle' },
  ];

  return (
    <div className="flex items-center justify-between p-3 bg-white border-b border-border rounded-t-xl shrink-0 overflow-x-auto">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mr-2">Filters:</span>
        <div className="flex items-center gap-1.5">
          {filterConfigs.map((f) => {
            const Icon = f.icon;
            const isActive = activeFilters.includes(f.type) || activeFilters.length === 0;
            const color = NODE_TYPES[f.type]?.color || '#cbd5e1';

            return (
              <button
                key={f.type}
                onClick={() => toggleFilter(f.type)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all border",
                  isActive 
                    ? "bg-background shadow-sm text-foreground" 
                    : "bg-background-subtle border-transparent text-foreground-muted opacity-60 hover:opacity-100"
                )}
                style={{ borderColor: isActive ? `${color}40` : 'transparent' }}
              >
                <Icon size={12} style={{ color: isActive ? color : 'currentColor' }} />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 pl-4 ml-4 border-l border-border shrink-0">
        {/* Layout Modes */}
        <div className="flex bg-background-subtle rounded-lg p-1 border border-border">
          <button
            onClick={() => setLayoutMode('force')}
            className={cn("p-1.5 rounded-md transition-colors", layoutMode === 'force' ? 'bg-white shadow-sm text-trust-blue' : 'text-foreground-secondary hover:text-foreground')}
            title="Force Directed Layout"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setLayoutMode('hierarchical')}
            className={cn("p-1.5 rounded-md transition-colors", layoutMode === 'hierarchical' ? 'bg-white shadow-sm text-trust-blue' : 'text-foreground-secondary hover:text-foreground')}
            title="Hierarchical Layout"
          >
            <GitBranch size={16} />
          </button>
          <button
            onClick={() => setLayoutMode('radial')}
            className={cn("p-1.5 rounded-md transition-colors", layoutMode === 'radial' ? 'bg-white shadow-sm text-trust-blue' : 'text-foreground-secondary hover:text-foreground')}
            title="Radial Layout"
          >
            <Circle size={16} />
          </button>
        </div>

        {/* AI Clustering */}
        <button
          onClick={toggleAIClustering}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
            isAIClustering
              ? "bg-trust-blue-pale text-trust-blue border-trust-blue shadow-glow-blue"
              : "bg-white text-foreground-secondary border-border hover:bg-background-muted"
          )}
        >
          <Sparkles size={14} className={isAIClustering ? "animate-pulse" : ""} />
          {isAIClustering ? 'AI Clustering Active' : 'AI Cluster Analysis'}
        </button>
      </div>
    </div>
  );
}
