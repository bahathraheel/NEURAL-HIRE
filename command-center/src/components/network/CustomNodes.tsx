'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { motion } from 'framer-motion';
import { UserRound, Shield, Phone, Landmark, MapPin, Globe, Car, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RISK_COLORS, NODE_TYPES } from '@/lib/constants';
import type { NetworkNodeData } from '@/data/mockNetworkData';

export function CriminalNodeComponent({ data, selected }: NodeProps<Node<NetworkNodeData>>) {
  const color = NODE_TYPES[data.nodeType as keyof typeof NODE_TYPES]?.color || '#cbd5e1';

  // Render correct icon based on type since Lucide icons aren't perfectly serializable from constants
  const renderIcon = () => {
    switch (data.nodeType) {
      case 'suspect': return <UserRound size={16} />;
      case 'victim': return <Shield size={16} />;
      case 'phone': return <Phone size={16} />;
      case 'bankAccount': return <Landmark size={16} />;
      case 'location': return <MapPin size={16} />;
      case 'osint': return <Globe size={16} />;
      case 'vehicle': return <Car size={16} />;
      default: return <UserRound size={16} />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-[180px] bg-white rounded-lg border shadow-sm transition-all overflow-hidden",
        selected ? "border-trust-blue shadow-md ring-2 ring-trust-blue/20" : "border-border"
      )}
    >
      {/* Target handle (Left) */}
      <Handle type="target" position={Position.Left} className="w-2 h-4 rounded-sm border-0 bg-gray-300" />
      
      {/* Left color accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: color }} />

      <div className="p-3 pl-4 flex flex-col gap-1.5 relative">
        {/* Flag Icon */}
        {data.flagged && (
          <div className="absolute top-2 right-2 text-crimson">
            <Flag size={14} className="fill-crimson/20" />
          </div>
        )}

        {/* Header: Icon + Label */}
        <div className="flex items-center gap-2 pr-4">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}20`, color: color }}
          >
            {renderIcon()}
          </div>
          <span className="font-semibold text-xs text-foreground truncate" title={data.label}>
            {data.label}
          </span>
        </div>

        {/* Subtitle */}
        <span className="text-[10px] text-foreground-secondary truncate leading-tight">
          {data.subtitle}
        </span>

        {/* Risk Badge */}
        {data.riskLevel && (
          <div 
            className="mt-1 w-fit px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border"
            style={{ 
              backgroundColor: RISK_COLORS[data.riskLevel].bg, 
              color: RISK_COLORS[data.riskLevel].text,
              borderColor: RISK_COLORS[data.riskLevel].border 
            }}
          >
            {data.riskLevel}
          </div>
        )}
      </div>

      {/* Source handle (Right) */}
      <Handle type="source" position={Position.Right} className="w-2 h-4 rounded-sm border-0 bg-gray-300" />
    </motion.div>
  );
}

export const nodeTypes = {
  criminalNode: CriminalNodeComponent,
};
