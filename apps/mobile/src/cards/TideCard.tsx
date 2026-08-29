import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../utils/i18n';
import { formatTemp } from '../utils/units';
import { Waves, ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';

export const TideCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const { t } = useTranslation();
  const { temperatureUnit } = useAppStore();

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
      title={t('card.tide_title')}
      subtitle="Marine conditions & sea swell"
      icon={<Waves className="h-4 w-4 text-cyan-500" />}
      badge={{
        severity: surfSeverity,
        label: `Surf: ${tide.surf_quality || 'Fair'}`,
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button')}
    >
      <div className="space-y-3.5">
        {/* High / Low Tide Visual Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/25 p-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-white shadow-sm flex-shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 block uppercase font-bold">
                Next High Tide
              </span>
              <p className="font-heading text-xs font-extrabold text-content-primary">
                {tide.next_high}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-sky-500/10 border border-sky-500/25 p-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm flex-shrink-0">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 block uppercase font-bold">
                Next Low Tide
              </span>
              <p className="font-heading text-xs font-extrabold text-content-primary">
                {tide.next_low}
              </p>
            </div>
          </div>
        </div>

        {/* Marine Metrics Strip */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <span className="text-[10px] text-content-muted block uppercase font-bold">Wave Height</span>
            <span className="font-heading text-xs font-bold text-content-primary mt-0.5 block">
              {tide.wave_height_m} meters
            </span>
          </div>
          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <span className="text-[10px] text-content-muted block uppercase font-bold">Sea Surface Temp</span>
            <span className="font-heading text-xs font-bold text-content-primary mt-0.5 block">
              {formatTemp(tide.water_temp_c ?? 27.5, temperatureUnit)}
            </span>
          </div>
        </div>
      </div>
    </CardShell>
  );
};
