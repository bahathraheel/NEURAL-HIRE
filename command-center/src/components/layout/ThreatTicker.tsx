'use client';

import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
}

const mockAlerts: Alert[] = [
  { id: '1', severity: 'critical', message: 'ANPR Hit — Vehicle KA-01-MX-4421 spotted near MG Road' },
  { id: '2', severity: 'warning', message: 'Unusual activity detected in Sector 7 — 3 emergency calls in 15 min' },
  { id: '3', severity: 'info', message: 'New FIR registered — Case BLR/2024/4423 assigned to Unit 5' },
  { id: '4', severity: 'critical', message: 'VIP Route Threat — Suspicious package reported near Vidhana Soudha' },
  { id: '5', severity: 'warning', message: 'Gang activity spike — 47% increase in East Zone last 24hrs' },
  { id: '6', severity: 'info', message: 'OSINT Alert — Target social media post detected with flagged keywords' },
];

export function ThreatTicker() {
  // Duplicate for seamless infinite scroll
  const displayAlerts = [...mockAlerts, ...mockAlerts];

  return (
    <div className="h-9 bg-gray-900 text-white flex items-center overflow-hidden relative shrink-0">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-900 to-transparent z-10 flex items-center px-4 font-bold text-xs uppercase tracking-wider text-gray-400">
        Live Feed
      </div>
      
      <div className="flex animate-ticker whitespace-nowrap items-center pl-24">
        {displayAlerts.map((alert, idx) => (
          <div key={`${alert.id}-${idx}`} className="flex items-center mx-6 gap-2">
            {alert.severity === 'critical' && (
              <>
                <div className="severity-dot critical" />
                <ShieldAlert size={14} className="text-crimson" />
              </>
            )}
            {alert.severity === 'warning' && (
              <>
                <div className="severity-dot warning" />
                <AlertTriangle size={14} className="text-amber" />
              </>
            )}
            {alert.severity === 'info' && (
              <>
                <div className="severity-dot info" />
                <Info size={14} className="text-trust-blue-light" />
              </>
            )}
            <span className={cn(
              "text-sm font-medium",
              alert.severity === 'critical' ? 'text-red-100' :
              alert.severity === 'warning' ? 'text-amber-100' : 'text-gray-200'
            )}>
              {alert.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
