'use client';

import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge, Edge } from '@xyflow/react';
import type { NetworkEdgeData } from '@/data/mockNetworkData';

export function CriminalEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}: EdgeProps<Edge<NetworkEdgeData>>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Determine styles based on relation
  let stroke = '#94a3b8';
  let strokeWidth = 2;
  let strokeDasharray = 'none';
  let animationClass = '';

  switch (data?.relation) {
    case 'call':
      stroke = '#64748b';
      strokeDasharray = '5,5';
      animationClass = 'animate-pulse';
      break;
    case 'transaction':
      stroke = '#059669'; // Emerald
      strokeWidth = 3;
      break;
    case 'suspected':
      stroke = '#dc2626'; // Crimson
      strokeDasharray = '4,4';
      break;
    case 'family':
      stroke = '#7c3aed'; // Purple
      break;
    case 'coaccused':
      stroke = '#dc2626'; // Crimson
      strokeWidth = 3;
      break;
    case 'association':
    default:
      stroke = '#94a3b8'; // Slate
      break;
  }

  return (
    <>
      <BaseEdge 
        id={id} 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ ...style, stroke, strokeWidth, strokeDasharray }} 
        className={animationClass}
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan bg-white/90 backdrop-blur-sm border border-border px-2 py-0.5 rounded-full shadow-sm text-[10px] font-medium text-foreground-secondary"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const edgeTypes = {
  criminalEdge: CriminalEdgeComponent,
};
