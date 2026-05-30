import { create } from 'zustand';
import type { NodeType } from '@/types';

type LayoutMode = 'force' | 'hierarchical' | 'radial';

interface NetworkState {
  selectedNodeId: string | null;
  activeFilters: NodeType[];
  layoutMode: LayoutMode;
  isAIClustering: boolean;
  isDetailPanelOpen: boolean;
  searchQuery: string;
  highlightedCluster: string | null;

  // Actions
  selectNode: (id: string | null) => void;
  toggleFilter: (filter: NodeType) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleAIClustering: () => void;
  setDetailPanelOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setHighlightedCluster: (cluster: string | null) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  selectedNodeId: null,
  activeFilters: [],
  layoutMode: 'force',
  isAIClustering: false,
  isDetailPanelOpen: false,
  searchQuery: '',
  highlightedCluster: null,

  selectNode: (selectedNodeId) =>
    set({ selectedNodeId, isDetailPanelOpen: selectedNodeId !== null }),

  toggleFilter: (filter) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(filter)
        ? state.activeFilters.filter((f) => f !== filter)
        : [...state.activeFilters, filter],
    })),

  setLayoutMode: (layoutMode) => set({ layoutMode }),

  toggleAIClustering: () =>
    set((state) => ({ isAIClustering: !state.isAIClustering })),

  setDetailPanelOpen: (isDetailPanelOpen) => set({ isDetailPanelOpen }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setHighlightedCluster: (highlightedCluster) => set({ highlightedCluster }),
}));
