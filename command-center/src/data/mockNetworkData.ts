import type { Node, Edge } from '@xyflow/react';

// ─── Node data types ────────────────────────────────────
export interface NetworkNodeData {
  label: string;
  subtitle: string;
  nodeType: 'suspect' | 'victim' | 'phone' | 'bankAccount' | 'location' | 'osint' | 'vehicle';
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  avatar?: string;
  flagged?: boolean;
  cluster?: string;
  metadata: Record<string, string>;
  [key: string]: unknown;
}

export interface NetworkEdgeData {
  relation: 'call' | 'transaction' | 'association' | 'suspected' | 'family' | 'coaccused';
  label: string;
  weight: number;
  [key: string]: unknown;
}

// ─── Mock Nodes ─────────────────────────────────────────
export const mockNodes: Node<NetworkNodeData>[] = [
  // ── Suspects ──
  {
    id: 'suspect-1',
    type: 'criminalNode',
    position: { x: 400, y: 200 },
    data: {
      label: 'Ravi Kumar M.',
      subtitle: 'Primary Suspect',
      nodeType: 'suspect',
      riskLevel: 'critical',
      flagged: true,
      cluster: 'syndicate-a',
      metadata: {
        'Age': '34',
        'Prior Cases': '2',
        'Status': 'Wanted',
        'Last Seen': 'HSR Layout, BLR',
      },
    },
  },
  {
    id: 'suspect-2',
    type: 'criminalNode',
    position: { x: 700, y: 100 },
    data: {
      label: 'Deepak S.',
      subtitle: 'Co-accused',
      nodeType: 'suspect',
      riskLevel: 'high',
      flagged: false,
      cluster: 'syndicate-a',
      metadata: {
        'Age': '28',
        'Prior Cases': '1',
        'Status': 'Under Surveillance',
        'Occupation': 'Auto Driver',
      },
    },
  },
  {
    id: 'suspect-3',
    type: 'criminalNode',
    position: { x: 150, y: 350 },
    data: {
      label: 'Farhan J.',
      subtitle: 'Suspected Financier',
      nodeType: 'suspect',
      riskLevel: 'high',
      cluster: 'syndicate-a',
      metadata: {
        'Age': '41',
        'Prior Cases': '0',
        'Status': 'Under Investigation',
        'Occupation': 'Business Owner',
      },
    },
  },

  // ── Victims ──
  {
    id: 'victim-1',
    type: 'criminalNode',
    position: { x: 800, y: 350 },
    data: {
      label: 'Ananya R.',
      subtitle: 'Complainant',
      nodeType: 'victim',
      metadata: {
        'Age': '29',
        'FIR No.': 'BLR/2024/4421',
        'Incident': 'Armed Robbery',
      },
    },
  },
  {
    id: 'victim-2',
    type: 'criminalNode',
    position: { x: 950, y: 200 },
    data: {
      label: 'Suresh B.',
      subtitle: 'Witness / Victim',
      nodeType: 'victim',
      metadata: {
        'Age': '45',
        'FIR No.': 'BLR/2024/4422',
        'Incident': 'Assault',
      },
    },
  },

  // ── Phones ──
  {
    id: 'phone-1',
    type: 'criminalNode',
    position: { x: 250, y: 80 },
    data: {
      label: '+91 98765 XXXXX',
      subtitle: 'Prepaid SIM - Airtel',
      nodeType: 'phone',
      metadata: {
        'IMEI': '35XXXXXXXX12345',
        'Activated': '2024-01-15',
        'Tower Hits': '47',
      },
    },
  },
  {
    id: 'phone-2',
    type: 'criminalNode',
    position: { x: 550, y: 450 },
    data: {
      label: '+91 87654 XXXXX',
      subtitle: 'Postpaid SIM - Jio',
      nodeType: 'phone',
      metadata: {
        'IMEI': '35XXXXXXXX67890',
        'Registered To': 'Fake ID',
        'Tower Hits': '132',
      },
    },
  },

  // ── Bank Accounts ──
  {
    id: 'bank-1',
    type: 'criminalNode',
    position: { x: 100, y: 550 },
    data: {
      label: 'HDFC XXXX-4421',
      subtitle: '₹2.4L suspicious deposits',
      nodeType: 'bankAccount',
      flagged: true,
      cluster: 'syndicate-a',
      metadata: {
        'Bank': 'HDFC Bank',
        'Branch': 'Koramangala',
        'Opened': '2023-06-12',
        'Alert': 'STR Filed',
      },
    },
  },
  {
    id: 'bank-2',
    type: 'criminalNode',
    position: { x: 400, y: 600 },
    data: {
      label: 'SBI XXXX-7789',
      subtitle: 'Shell company account',
      nodeType: 'bankAccount',
      flagged: true,
      metadata: {
        'Bank': 'State Bank of India',
        'Branch': 'Electronic City',
        'Type': 'Current Account',
        'Alert': 'Freeze Order Pending',
      },
    },
  },

  // ── Locations ──
  {
    id: 'loc-1',
    type: 'criminalNode',
    position: { x: 650, y: 550 },
    data: {
      label: 'Koramangala 5th Block',
      subtitle: 'Crime Scene',
      nodeType: 'location',
      metadata: {
        'Coords': '12.9352° N, 77.6245° E',
        'Zone': 'South-East Bengaluru',
        'CCTV Coverage': '4 cameras',
      },
    },
  },
  {
    id: 'loc-2',
    type: 'criminalNode',
    position: { x: 900, y: 500 },
    data: {
      label: 'HSR Layout Safehouse',
      subtitle: 'Suspected Hideout',
      nodeType: 'location',
      flagged: true,
      metadata: {
        'Coords': '12.9116° N, 77.6389° E',
        'Surveillance': 'Active',
        'Last Activity': '2 hours ago',
      },
    },
  },

  // ── OSINT ──
  {
    id: 'osint-1',
    type: 'criminalNode',
    position: { x: 1050, y: 400 },
    data: {
      label: '@dark_rider_blr',
      subtitle: 'Instagram Handle',
      nodeType: 'osint',
      metadata: {
        'Platform': 'Instagram',
        'Followers': '1,247',
        'Linked Phone': '+91 98765 XXXXX',
        'Sentiment': 'Aggressive',
      },
    },
  },

  // ── Vehicle ──
  {
    id: 'vehicle-1',
    type: 'criminalNode',
    position: { x: 200, y: 200 },
    data: {
      label: 'KA-01-MX-4421',
      subtitle: 'White Maruti Swift',
      nodeType: 'vehicle',
      flagged: true,
      metadata: {
        'Make': 'Maruti Suzuki Swift',
        'Color': 'White',
        'Owner': 'Ravi Kumar M.',
        'ANPR Hits': '3',
      },
    },
  },
];

// ─── Mock Edges ─────────────────────────────────────────
export const mockEdges: Edge<NetworkEdgeData>[] = [
  // Suspect-1 connections
  {
    id: 'e-s1-s2',
    source: 'suspect-1',
    target: 'suspect-2',
    type: 'criminalEdge',
    data: { relation: 'coaccused', label: 'Co-accused in FIR 4421', weight: 0.95 },
  },
  {
    id: 'e-s1-s3',
    source: 'suspect-1',
    target: 'suspect-3',
    type: 'criminalEdge',
    data: { relation: 'suspected', label: 'Financial link suspected', weight: 0.65 },
  },
  {
    id: 'e-s1-p1',
    source: 'suspect-1',
    target: 'phone-1',
    type: 'criminalEdge',
    data: { relation: 'association', label: 'Registered owner', weight: 0.9 },
  },
  {
    id: 'e-s1-v1',
    source: 'suspect-1',
    target: 'victim-1',
    type: 'criminalEdge',
    data: { relation: 'suspected', label: 'Accused of robbery', weight: 0.88 },
  },
  {
    id: 'e-s1-b1',
    source: 'suspect-1',
    target: 'bank-1',
    type: 'criminalEdge',
    data: { relation: 'transaction', label: '₹2.4L deposits', weight: 0.82 },
  },
  {
    id: 'e-s1-veh1',
    source: 'suspect-1',
    target: 'vehicle-1',
    type: 'criminalEdge',
    data: { relation: 'association', label: 'Registered owner', weight: 0.95 },
  },
  {
    id: 'e-s1-loc2',
    source: 'suspect-1',
    target: 'loc-2',
    type: 'criminalEdge',
    data: { relation: 'association', label: 'Frequent visitor', weight: 0.7 },
  },

  // Suspect-2 connections
  {
    id: 'e-s2-v2',
    source: 'suspect-2',
    target: 'victim-2',
    type: 'criminalEdge',
    data: { relation: 'suspected', label: 'Assault suspect', weight: 0.75 },
  },
  {
    id: 'e-s2-p2',
    source: 'suspect-2',
    target: 'phone-2',
    type: 'criminalEdge',
    data: { relation: 'association', label: 'Burner phone', weight: 0.6 },
  },
  {
    id: 'e-s2-loc1',
    source: 'suspect-2',
    target: 'loc-1',
    type: 'criminalEdge',
    data: { relation: 'association', label: 'Seen at crime scene', weight: 0.85 },
  },

  // Suspect-3 connections
  {
    id: 'e-s3-b1',
    source: 'suspect-3',
    target: 'bank-1',
    type: 'criminalEdge',
    data: { relation: 'transaction', label: 'Beneficiary', weight: 0.72 },
  },
  {
    id: 'e-s3-b2',
    source: 'suspect-3',
    target: 'bank-2',
    type: 'criminalEdge',
    data: { relation: 'transaction', label: 'Shell company owner', weight: 0.88 },
  },

  // Phone connections
  {
    id: 'e-p1-p2',
    source: 'phone-1',
    target: 'phone-2',
    type: 'criminalEdge',
    data: { relation: 'call', label: '47 calls in 30 days', weight: 0.78 },
  },

  // OSINT connections
  {
    id: 'e-s1-o1',
    source: 'suspect-1',
    target: 'osint-1',
    type: 'criminalEdge',
    data: { relation: 'association', label: 'Social media profile', weight: 0.82 },
  },

  // Location connections
  {
    id: 'e-v1-loc1',
    source: 'victim-1',
    target: 'loc-1',
    type: 'criminalEdge',
    data: { relation: 'association', label: 'Incident location', weight: 0.98 },
  },
  {
    id: 'e-veh1-loc1',
    source: 'vehicle-1',
    target: 'loc-1',
    type: 'criminalEdge',
    data: { relation: 'association', label: 'ANPR hit at scene', weight: 0.91 },
  },

  // Bank connections
  {
    id: 'e-b1-b2',
    source: 'bank-1',
    target: 'bank-2',
    type: 'criminalEdge',
    data: { relation: 'transaction', label: '₹1.8L transferred', weight: 0.85 },
  },
];

// ─── Cluster definitions ────────────────────────────────
export const mockClusters = [
  {
    id: 'syndicate-a',
    label: 'Syndicate Alpha',
    color: '#dc2626',
    members: ['suspect-1', 'suspect-2', 'suspect-3', 'bank-1'],
    description: 'AI-detected criminal syndicate linked through financial transactions and communication patterns',
  },
];
