'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  Network,
  Map,
  Globe,
  Brain,
  Landmark,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SIDEBAR } from '@/lib/constants';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cases', label: 'Cases', icon: FolderOpen },
  { id: 'network', label: 'Network Analysis', icon: Network },
  { id: 'map', label: 'Crime Map', icon: Map },
  { id: 'osint', label: 'OSINT Intelligence', icon: Globe },
  { id: 'profiling', label: 'Behavioral Profiling', icon: Brain },
  { id: 'financial', label: 'Financial Analysis', icon: Landmark },
  { id: 'threats', label: 'Threat Center', icon: ShieldAlert },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <motion.aside
      initial={{ width: SIDEBAR.expandedWidth }}
      animate={{ width: collapsed ? SIDEBAR.collapsedWidth : SIDEBAR.expandedWidth }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full bg-background border-r border-border flex flex-col justify-between relative z-20 shrink-0"
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header / Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-bold text-lg tracking-tight text-foreground truncate"
            >
              Anti-Gravity
            </motion.span>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-background-muted text-foreground-secondary transition-colors mx-auto"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  'w-full flex items-center h-10 px-3 rounded-md transition-all group relative',
                  isActive
                    ? 'bg-trust-blue-pale text-trust-blue-dark font-medium'
                    : 'text-foreground-secondary hover:bg-background-subtle hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-trust-blue rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={20} className={cn('shrink-0', isActive ? 'text-trust-blue' : '')} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-3 truncate text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-background-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.pravatar.cc/150?u=sharma" alt="User" className="w-full h-full object-cover" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-w-0"
          >
            <span className="text-sm font-semibold text-foreground truncate">Inspector Sharma</span>
            <span className="text-xs text-foreground-muted truncate">SI-2847</span>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
