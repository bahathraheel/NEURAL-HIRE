'use client';

import { useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useNetworkStore } from '@/stores/networkStore';
import { mockNodes, mockEdges } from '@/data/mockNetworkData';
import type { NodeType } from '@/types';
import { nodeTypes } from './CustomNodes';
import { edgeTypes } from './CustomEdges';
import { GraphToolbar } from './GraphToolbar';
import { NodeDetailPanel } from './NodeDetailPanel';
import { Maximize2, MoreHorizontal } from 'lucide-react';

function NetworkGraphContent() {
  const { 
    activeFilters, 
    isAIClustering, 
    selectNode,
    selectedNodeId
  } = useNetworkStore();

  // Filter nodes based on active filters (empty = all)
  const filteredNodes = useMemo(() => {
    let nodes = mockNodes;
    if (activeFilters.length > 0) {
      nodes = nodes.filter(n => activeFilters.includes(n.data.nodeType as NodeType));
    }
    
    // Update selected state
    return nodes.map(n => ({
      ...n,
      selected: n.id === selectedNodeId
    }));
  }, [activeFilters, selectedNodeId]);

  // Filter edges based on visible nodes
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    return mockEdges.filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));
  }, [filteredNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(filteredNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(filteredEdges);

  // Sync state when filters change
  useMemo(() => {
    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [filteredNodes, filteredEdges, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: { id: string }) => {
    selectNode(node.id);
  }, [selectNode]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
        attributionPosition="bottom-right"
      >
        <Background gap={16} size={1} color="#e2e8f0" />
        <Controls showInteractive={false} className="bg-white border-border shadow-sm rounded-lg overflow-hidden" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data?.riskLevel === 'critical') return '#dc2626';
            if (n.data?.riskLevel === 'high') return '#ea580c';
            return '#cbd5e1';
          }}
          maskColor="rgba(248, 250, 252, 0.7)"
          className="border-border bg-white"
        />

        {/* AI Cluster Background Highlights */}
        {isAIClustering && (
          <Panel position="top-left" className="w-full h-full pointer-events-none -z-10 absolute inset-0">
             {/* Note: True background SVG drawing is complex in pure React Flow without custom layers. 
                 For MVP, we just rely on node-level highlight or a mock overlay. */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-3xl mix-blend-multiply" />
          </Panel>
        )}
      </ReactFlow>
      
      {/* Node Detail Slide-out */}
      <NodeDetailPanel />
    </div>
  );
}

export function NetworkGraphWidget() {
  return (
    <div className="widget-card flex flex-col w-full h-[600px] overflow-hidden relative group">
      {/* Widget Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground">Criminal Network Analysis</h2>
          <span className="text-xs text-foreground-secondary">• 14 entities • 17 connections</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Live</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-foreground-secondary hover:bg-background-muted rounded-md transition-colors opacity-0 group-hover:opacity-100">
            <Maximize2 size={18} />
          </button>
          <button className="p-1.5 text-foreground-secondary hover:bg-background-muted rounded-md transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <GraphToolbar />

      {/* Graph Area */}
      <div className="flex-1 relative bg-background-subtle">
        <ReactFlowProvider>
          <NetworkGraphContent />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
