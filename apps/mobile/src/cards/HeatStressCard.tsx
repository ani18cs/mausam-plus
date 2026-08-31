import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../utils/i18n';
import { formatTemp, formatWind } from '../utils/units';
import { Flame, Droplets, Sun, Navigation } from 'lucide-react';

export const HeatStressCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const { t } = useTranslation();
  const { temperatureUnit, windSpeedUnit } = useAppStore();

  const heatStress = forecast.extras.heat_stress_index || {
    score: 72,
    band: 'orange',
    label: 'Moderate Strain',
    summary: 'High humidity restricts sweat evaporation. Hydrate frequently.',
  };

  const getSeverity = (band: string): 'safe' | 'caution' | 'warning' | 'severe' => {
    switch (band) {
      case 'green':
        return 'safe';
      case 'yellow':
        return 'caution';
      case 'orange':
        return 'warning';
      case 'red':
        return 'severe';
      default:
        return 'caution';
    }
  };

  const scorePct = Math.min(100, Math.max(0, heatStress.score));
  const windDirDeg = forecast.current.wind_dir_deg ?? 180;

  // SVG Circular Gauge
  const radius = 34;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (scorePct / 100) * circumference;

  const severityColor =
    heatStress.score < 30
      ? '#10B981'
      : heatStress.score < 60
      ? '#F59E0B'
      : heatStress.score < 85
      ? '#F97316'
      : '#EF4444';

  return (
    <CardShell
      id="card-heat-stress"
      title={t('card.heat_stress_title') || 'Heat Stress'}
      subtitle="Thermal load index"
      icon={<Flame className="h-4 w-4 text-orange-500" />}
      badge={{
        severity: getSeverity(heatStress.band),
        label: heatStress.label?.split('/')[0].trim() || 'Caution',
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button') || 'Why?'}
    >
      <div className="space-y-2.5">
        {/* Main High-Signal Row: Gauge + Primary Value + Feels Like */}
        <div className="rounded-2xl bg-card-subtle p-3 border border-border-subtle/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Circular Progress Arc */}
            <div className="relative w-16 h-12 flex items-center justify-center flex-shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeLinecap="round"
                  className="text-border-strong opacity-30"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke={severityColor}
                  strokeWidth="7"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1.5">
                <span className="font-heading text-lg font-extrabold text-content-primary leading-none">
                  {heatStress.score}
                </span>
                <span className="text-[8px] font-bold text-content-muted">/100</span>
              </div>
            </div>

            <div>
              <p className="font-heading text-sm font-bold text-content-primary leading-tight">
                {heatStress.label?.split('/')[0].trim() || 'Moderate Risk'}
              </p>
              <span className="text-[10px] font-medium text-content-muted block mt-0.5">
                Biometeorological Strain
              </span>
            </div>
          </div>

          <div className="text-right pl-2 border-l border-border-subtle">
            <span className="text-[9px] uppercase font-bold text-content-muted block">
              Feels Like
            </span>
            <span className="font-heading text-base font-extrabold text-orange-500">
              {formatTemp(forecast.current.feels_like_c, temperatureUnit)}
            </span>
          </div>
        </div>

        {/* 3 High-Signal Metrics Strip */}
        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-medium">
          <div className="rounded-xl bg-card-subtle py-1.5 px-2 border border-border-subtle/40">
            <span className="text-content-muted block">Humidity</span>
            <span className="font-heading text-xs font-bold text-content-primary">
              {forecast.current.humidity_pct}%
            </span>
          </div>
          <div className="rounded-xl bg-card-subtle py-1.5 px-2 border border-border-subtle/40">
            <span className="text-content-muted block">UV Index</span>
            <span className="font-heading text-xs font-bold text-content-primary">
              {forecast.current.uv_index}
            </span>
          </div>
          <div className="rounded-xl bg-card-subtle py-1.5 px-2 border border-border-subtle/40">
            <span className="text-content-muted block">Wind</span>
            <span className="font-heading text-xs font-bold text-content-primary">
              {formatWind(forecast.current.wind_kph, windSpeedUnit)}
            </span>
          </div>
        </div>
      </div>
    </CardShell>
  );
};
