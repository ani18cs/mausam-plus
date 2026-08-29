import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { Waves, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
      title="Tide & Coastal Swell"
      subtitle="Marine conditions"
      icon={<Waves className="h-4 w-4 text-cyan-500" />}
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
          <div className="rounded-xl bg-card-subtle p-2.5 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-cyan-500 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-content-muted block uppercase font-medium">Next High</span>
              <p className="font-heading text-xs font-bold text-content-primary">{tide.next_high}</p>
            </div>
          </div>

          <div className="rounded-xl bg-card-subtle p-2.5 flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-content-muted block uppercase font-medium">Next Low</span>
              <p className="font-heading text-xs font-bold text-content-primary">{tide.next_low}</p>
            </div>
          </div>
        </div>

        {/* Marine Metrics Strip */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle/50 text-center">
          <div>
            <span className="text-[10px] text-content-muted block uppercase font-medium">Wave Swell</span>
            <span className="font-heading text-xs font-bold text-content-primary">{tide.wave_height_m} m</span>
          </div>
          <div>
            <span className="text-[10px] text-content-muted block uppercase font-medium">Sea Temp</span>
            <span className="font-heading text-xs font-bold text-content-primary">{tide.water_temp_c ?? 27.5} °C</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
};

