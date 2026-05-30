'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/layout/Sidebar';
import { GlobalSearchBar } from '@/components/layout/GlobalSearchBar';
import { ThreatTicker } from '@/components/layout/ThreatTicker';
import { AISidekickPanel } from '@/components/layout/AISidekickPanel';
import { WidgetGrid } from '@/components/layout/WidgetGrid';
import { MultimodalChat } from '@/components/chat/MultimodalChat';

const NetworkGraphWidget = dynamic(
  () =>
    import('@/components/network/NetworkGraphWidget').then(
      (mod) => mod.NetworkGraphWidget
    ),
  {
    ssr: false,
    loading: () => (
      <div className="widget-card p-6 h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-trust-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-foreground-secondary">
            Loading Network Analysis...
          </span>
        </div>
      </div>
    ),
  }
);

export default function CommandCenter() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Threat Ticker */}
        <ThreatTicker />

        {/* Global Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <GlobalSearchBar />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Stats + Widget Grid */}
          <WidgetGrid networkGraphWidget={<NetworkGraphWidget />} />
        </main>
      </div>

      {/* AI Sidekick Panel */}
      <AISidekickPanel>
        <MultimodalChat />
      </AISidekickPanel>
    </div>
  );
}
