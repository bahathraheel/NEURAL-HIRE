// ─── Chat Types ──────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  language?: 'en' | 'kn';
  attachments?: FileAttachment[];
  confidence?: number;
  citations?: Citation[];
  entities?: ExtractedEntity[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio';
  url: string;
  thumbnail?: string;
  size: number;
}

export interface Citation {
  id: string;
  source: string;
  type: 'fir' | 'law' | 'data' | 'osint';
  reference: string;
  relevance: number;
}

export interface ExtractedEntity {
  id: string;
  type: 'person' | 'location' | 'vehicle' | 'phone' | 'organization';
  value: string;
  confidence: number;
}

// ─── Network Graph Types ─────────────────────────────────
export type NodeType = 'suspect' | 'victim' | 'phone' | 'bankAccount' | 'location' | 'osint' | 'vehicle';

export interface CriminalNode {
  id: string;
  type: NodeType;
  label: string;
  subtitle?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  avatar?: string;
  metadata: Record<string, string | number>;
  connections: number;
  flagged?: boolean;
}

export type EdgeRelation = 'call' | 'transaction' | 'association' | 'suspected' | 'family' | 'coaccused';

export interface CriminalEdge {
  id: string;
  source: string;
  target: string;
  relation: EdgeRelation;
  label?: string;
  weight?: number;
  metadata?: Record<string, string | number>;
}

// ─── Alert Types ─────────────────────────────────────────
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface ThreatAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  location?: string;
}

// ─── Layout Types ────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  active?: boolean;
}

// ─── Widget Types ────────────────────────────────────────
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'map' | 'graph' | 'list' | 'stat' | 'chat';
  span?: 1 | 2 | 3 | 4;
  height?: 'sm' | 'md' | 'lg' | 'xl';
}

// ─── Stat Card Types ─────────────────────────────────────
export interface StatCard {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: string;
  color: string;
}
