import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { Car, CloudRain } from 'lucide-react';

export const CommuteRadarCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  return (
    <CardShell
      id="card-commute-radar"
      title="Commute & Transit Radar"
      subtitle="Evening transit forecast"
      icon={<Car className="h-4 w-4" />}
      badge={{
        severity: 'caution',
        label: 'Rain Expected',
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this alert?"
    >
      <div className="space-y-3">
        {/* Transit Window Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-medium text-content-muted block">Peak Commute (5-7 PM)</span>
              <p className="font-heading text-sm font-bold text-content-primary">
                65% Convective Rain Showers
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-heading text-xl font-extrabold text-sky-600 dark:text-sky-400">
              +25m
            </span>
            <span className="text-[10px] text-content-muted block font-medium">Est. Delay</span>
          </div>
        </div>

        {/* 2-Column Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle/50 text-center">
          <div>
            <span className="text-[10px] text-content-muted block uppercase font-medium">Road Visibility</span>
            <span className="font-heading text-xs font-bold text-content-primary">6.5 km (Clear)</span>
          </div>
          <div>
            <span className="text-[10px] text-content-muted block uppercase font-medium">Hazard Reports</span>
            <span className="font-heading text-xs font-bold text-amber-500">2 Flooded Pockets</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
};

