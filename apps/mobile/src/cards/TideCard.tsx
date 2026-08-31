import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../utils/i18n';
import { formatTemp } from '../utils/units';
import { Waves, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export const TideCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const { t } = useTranslation();
  const { temperatureUnit } = useAppStore();

  const tide = forecast.extras.tide;

  if (!tide) {
    return (
      <CardShell
        id="card-beach-tide"
        title={t('card.tide_title')}
        subtitle="Swell & coastal rhythm"
        icon={<Waves className="h-4 w-4 text-cyan-500" />}
        badge={{
          severity: 'caution',
          label: t('card.pending_integration'),
        }}
        onWhyClick={onOpenWhyModal}
        whyLabel={t('card.why_button')}
      >
        <div className="rounded-2xl bg-card-subtle p-4 border border-border-subtle text-center space-y-2">
          <Info className="w-6 h-6 text-cyan-500 mx-auto" />
          <h4 className="font-heading text-xs font-bold text-content-primary">
            {t('card.pending_integration')}
          </h4>
          <p className="text-[11px] text-content-muted leading-relaxed">
            Active location is inland. Real-time tidal swell telemetry is calibrated for coastal coastal zones (Goa, Mumbai, Chennai, Vizag, Kerala, Odisha).
          </p>
        </div>
      </CardShell>
    );
  }

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
      subtitle="Swell & coastal rhythm"
      icon={<Waves className="h-4 w-4 text-cyan-500" />}
      badge={{
        severity: surfSeverity,
        label: `Surf: ${tide.surf_quality || 'Fair'}`,
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button')}
    >
      <div className="space-y-3">
        {/* Visual Wave Curve Timeline */}
        <div className="rounded-2xl bg-card-subtle p-3 border border-border-subtle/70 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-content-muted">
            <span>Tidal Rhythm Timeline</span>
            <span className="text-cyan-500">Live Swell</span>
          </div>

          {/* SVG Sine Wave Graphic */}
          <div className="relative h-16 w-full flex items-center justify-center overflow-hidden">
            <svg
              className="w-full h-full text-cyan-500/30"
              viewBox="0 0 300 60"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,30 Q 37.5,5 75,30 T 150,30 T 225,30 T 300,30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <path
                d="M 0,30 Q 37.5,5 75,30 T 150,30 T 225,30 T 300,30 L 300,60 L 0,60 Z"
                fill="url(#tideGradient)"
                opacity="0.25"
              />
              <defs>
                <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* High Tide Peak Marker */}
              <circle cx="75" cy="18" r="5" fill="#06b6d4" className="animate-pulse" />
              {/* Low Tide Trough Marker */}
              <circle cx="225" cy="42" r="5" fill="#38bdf8" />
            </svg>

            {/* Overlay Time Labels */}
            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
              <div className="text-left -mt-4">
                <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-2.5 h-2.5 inline" /> High Tide
                </span>
                <span className="text-[10px] font-extrabold text-content-primary">
                  {tide.next_high}
                </span>
              </div>

              <div className="text-right mt-4">
                <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-0.5 justify-end">
                  <ArrowDownRight className="w-2.5 h-2.5 inline" /> Low Tide
                </span>
                <span className="text-[10px] font-extrabold text-content-primary">
                  {tide.next_low}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Marine Metrics Strip */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <span className="text-[10px] text-content-muted block uppercase font-bold">Wave Height</span>
            <span className="font-heading text-xs font-bold text-content-primary mt-0.5 block">
              {tide.wave_height_m}m Swell
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
