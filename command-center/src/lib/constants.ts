// ─── Color Palette ───────────────────────────────────────
export const COLORS = {
  // Primary
  trustBlue: '#1d4ed8',
  trustBlueLight: '#3b82f6',
  trustBluePale: '#dbeafe',
  trustBlueDark: '#1e3a8a',

  // Alerts
  crimson: '#dc2626',
  crimsonLight: '#fecaca',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  emerald: '#059669',
  emeraldLight: '#d1fae5',

  // Neutrals
  white: '#ffffff',
  offWhite: '#f8fafc',
  gray50: '#f9fafb',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
} as const;

// ─── Animation Configs ───────────────────────────────────
export const ANIMATION = {
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  springSmooth: { type: 'spring' as const, stiffness: 200, damping: 25 },
  springBouncy: { type: 'spring' as const, stiffness: 400, damping: 20 },
  easeOut: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  easeInOut: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
} as const;

// ─── Breakpoints ─────────────────────────────────────────
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '4k': 2560,
} as const;

// ─── Sidebar Config ──────────────────────────────────────
export const SIDEBAR = {
  expandedWidth: 260,
  collapsedWidth: 72,
} as const;

// ─── Risk Levels ─────────────────────────────────────────
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export const RISK_COLORS: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  low: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  medium: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  high: { bg: '#fed7aa', text: '#9a3412', border: '#fb923c' },
  critical: { bg: '#fecaca', text: '#991b1b', border: '#f87171' },
} as const;

// ─── Node Types ──────────────────────────────────────────
export const NODE_TYPES = {
  suspect: { icon: 'User', color: '#dc2626', label: 'Suspect' },
  victim: { icon: 'Shield', color: '#1d4ed8', label: 'Victim' },
  phone: { icon: 'Phone', color: '#64748b', label: 'Phone' },
  bankAccount: { icon: 'Landmark', color: '#059669', label: 'Bank Account' },
  location: { icon: 'MapPin', color: '#f59e0b', label: 'Location' },
  osint: { icon: 'Globe', color: '#7c3aed', label: 'OSINT' },
  vehicle: { icon: 'Car', color: '#0891b2', label: 'Vehicle' },
} as const;
