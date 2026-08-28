import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { Waves, ArrowUpRight, ArrowDownRight, Compass, Thermometer } from 'lucide-react';

export const TideCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const tide = forecast.extras.tide || {
    next_high: '03:45 PM (+1.8m)',
    next_low: '09:20 PM (+0.4m)',
    wave_height_m: 1.2,
    water_temp_c: 27.5,
    surf_quality: 'Fair',
  };

  const surfSeverity =
    tide.surf_quality === 'Good' || tide.surf_quality === 'Excellent'
      ? 'safe'
      : tide.surf_quality === 'Fair'
      ? 'caution'
      : 'warning';

  return (
    <CardShell
      id="card-beach-tide"
      title="Tide, Wave & Coastal Marine"
      subtitle="Oceanic swell & surf safety telemetry"
      icon={<Waves className="h-5 w-5 text-cyan-500" />}
      badge={{
        severity: surfSeverity,
        label: `Surf: ${tide.surf_quality || 'Fair'}`,
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this tide?"
    >
      <div className="space-y-3">
        {/* High / Low Tide Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-card-subtle p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-content-muted">Next High Tide</span>
              <p className="font-heading text-xs font-bold text-content-primary">{tide.next_high}</p>
            </div>
          </div>

          <div className="rounded-xl bg-card-subtle p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-content-muted">Next Low Tide</span>
              <p className="font-heading text-xs font-bold text-content-primary">{tide.next_low}</p>
            </div>
          </div>
        </div>

        {/* Marine Metrics Strip */}
        <div className="flex items-center justify-between rounded-xl border border-border-subtle p-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-accent-primary" />
            <div>
              <span className="text-[10px] text-content-muted block font-medium">Wave Height</span>
              <span className="font-heading text-sm font-bold text-content-primary">{tide.wave_height_m} m Swell</span>
            </div>
          </div>

          <div className="h-6 w-px bg-border-subtle" />

          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <div>
              <span className="text-[10px] text-content-muted block font-medium">Sea Water Temp</span>
              <span className="font-heading text-sm font-bold text-content-primary">{tide.water_temp_c ?? 27.5} °C</span>
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
};
