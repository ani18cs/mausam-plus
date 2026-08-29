import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../utils/i18n';
import { formatTemp, formatWind } from '../utils/units';
import { Flame, Droplets, Sun, Wind, HeartPulse } from 'lucide-react';

export const HeatStressCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const { t } = useTranslation();
  const { temperatureUnit, windSpeedUnit } = useAppStore();

  const heatStress = forecast.extras.heat_stress_index || {
    score: 72,
    band: 'orange',
    label: 'High Risk / Severe Strain',
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

  return (
    <CardShell
      id="card-heat-stress"
      title={t('card.heat_stress_title')}
      subtitle="Biometeorological Strain"
      icon={<Flame className="h-4 w-4 text-orange-500" />}
      badge={{
        severity: getSeverity(heatStress.band),
        label: heatStress.label?.split('/')[0].trim() || 'Caution',
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button')}
    >
      <div className="space-y-3.5">
        {/* Main Score & Perceived Temperature Row */}
        <div className="rounded-2xl bg-card-subtle p-3 space-y-2 border border-border-subtle/60">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-content-muted block">
                Thermal Stress Score
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-heading text-3xl font-extrabold text-content-primary tracking-tight">
                  {heatStress.score}
                </span>
                <span className="text-xs font-bold text-content-muted">/ 100 Index</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider font-bold text-content-muted block">
                Feels Like
              </span>
              <span className="font-heading text-base font-extrabold text-orange-500">
                {formatTemp(forecast.current.feels_like_c, temperatureUnit)}
              </span>
            </div>
          </div>

          {/* Thermal Spectrum Bar with Needle */}
          <div className="space-y-1">
            <div className="relative h-2.5 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 to-rose-600 shadow-inner overflow-visible">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900 shadow-md transition-all duration-300"
                style={{ left: `calc(${scorePct}% - 8px)` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-content-muted pt-0.5">
              <span className="text-emerald-500">Safe (0-30)</span>
              <span className="text-amber-500">Caution (30-60)</span>
              <span className="text-orange-500">High Risk (60-85)</span>
              <span className="text-rose-500">Extreme (85+)</span>
            </div>
          </div>
        </div>

        {/* Environmental Triad Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <div className="flex items-center justify-center gap-1 text-[10px] text-content-muted uppercase font-bold">
              <Droplets className="w-3 h-3 text-sky-400" /> Humidity
            </div>
            <span className="font-heading text-xs font-bold text-content-primary mt-0.5 block">
              {forecast.current.humidity_pct}%
            </span>
          </div>

          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <div className="flex items-center justify-center gap-1 text-[10px] text-content-muted uppercase font-bold">
              <Sun className="w-3 h-3 text-amber-400" /> UV Index
            </div>
            <span className="font-heading text-xs font-bold text-content-primary mt-0.5 block">
              {forecast.current.uv_index}
            </span>
          </div>

          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <div className="flex items-center justify-center gap-1 text-[10px] text-content-muted uppercase font-bold">
              <Wind className="w-3 h-3 text-teal-400" /> Wind
            </div>
            <span className="font-heading text-xs font-bold text-content-primary mt-0.5 block">
              {formatWind(forecast.current.wind_kph, windSpeedUnit)}
            </span>
          </div>
        </div>

        {/* Actionable Health Insight */}
        <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-2.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 flex-shrink-0" />
          <span className="leading-snug">{heatStress.summary}</span>
        </div>
      </div>
    </CardShell>
  );
};
