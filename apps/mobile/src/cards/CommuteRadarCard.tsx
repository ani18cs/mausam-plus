import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { Car, CloudRain, AlertCircle, Navigation } from 'lucide-react';

export const CommuteRadarCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  return (
    <CardShell
      id="card-commute-radar"
      title="Commute Weather & Radar Hazard"
      subtitle="School & office transit window conditions"
      icon={<Car className="h-5 w-5 text-sky-500" />}
      badge={{
        severity: 'caution',
        label: 'Rain Expected (5-7 PM)',
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this alert?"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-sky-500/10 dark:bg-sky-950/40 border border-sky-500/25 p-3">
          <div className="flex items-center gap-2.5">
            <CloudRain className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                Evening Peak Commute
              </span>
              <p className="font-heading text-xs font-bold text-content-primary">
                65% Convective Rain Showers
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-heading text-lg font-bold text-sky-600 dark:text-sky-400">
              +25m
            </span>
            <span className="text-[10px] text-content-muted block font-medium">Est. Delay</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-card-subtle p-2">
            <span className="text-[10px] text-content-muted block font-medium">Road Visibility</span>
            <span className="font-semibold text-content-primary">6.5 km (Clear)</span>
          </div>
          <div className="rounded-lg bg-card-subtle p-2">
            <span className="text-[10px] text-content-muted block font-medium">Citizen Reports</span>
            <span className="font-semibold text-amber-500">2 Flooded Pockets</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
};
