import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useAppStore } from '../store/useAppStore';
import { formatTemp, formatWind } from '../utils/units';
import { Flame, Droplets, Sun, Wind } from 'lucide-react';

export const HeatStressCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const { temperatureUnit, windSpeedUnit } = useAppStore();

  const heatStress = forecast.extras.heat_stress_index || {
    score: 72,
    band: 'orange',
    label: 'High Risk / Severe Thermal Strain',
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

  return (
    <CardShell
      id="card-heat-stress"
      title="Heat-Stress Index"
      subtitle="Biometeorological Strain"
      icon={<Flame className="h-4 w-4" />}
      badge={{
        severity: getSeverity(heatStress.band),
        label: heatStress.label?.split('/')[0].trim() || 'Caution',
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this score?"
    >
      <div className="space-y-3">
        {/* Score & Feels Like Row */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-3xl font-extrabold text-content-primary tracking-tight">
              {heatStress.score}
            </span>
            <span className="text-xs font-semibold text-content-muted">/ 100 Index</span>
          </div>

          <span className="text-xs font-semibold text-content-secondary">
            Perceived: {formatTemp(forecast.current.feels_like_c, temperatureUnit)}
          </span>
        </div>

        {/* 4-Segment Risk Meter */}
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex gap-0.5">
            <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: '30%' }} />
            <div className="h-full bg-amber-400" style={{ width: '25%' }} />
            <div className="h-full bg-orange-500" style={{ width: '25%' }} />
            <div className="h-full bg-red-600 rounded-r-full" style={{ width: '20%' }} />
          </div>
          <div className="flex justify-between text-[9px] font-medium text-content-muted">
            <span>Safe (0-30)</span>
            <span>Caution</span>
            <span>High Risk</span>
            <span>Extreme (90+)</span>
          </div>
        </div>

        {/* 3 Environmental Telemetry Factors */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-subtle/50 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] text-content-muted uppercase font-medium">
              <Droplets className="w-3 h-3 text-sky-400" />
              <span>Humidity</span>
            </div>
            <span className="font-heading text-xs font-bold text-content-primary mt-0.5">
              {forecast.current.humidity_pct}%
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] text-content-muted uppercase font-medium">
              <Sun className="w-3 h-3 text-amber-400" />
              <span>UV Index</span>
            </div>
            <span className="font-heading text-xs font-bold text-content-primary mt-0.5">
              {forecast.current.uv_index}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] text-content-muted uppercase font-medium">
              <Wind className="w-3 h-3 text-teal-400" />
              <span>Wind</span>
            </div>
            <span className="font-heading text-xs font-bold text-content-primary mt-0.5">
              {formatWind(forecast.current.wind_kph, windSpeedUnit)}
            </span>
          </div>
        </div>

        {/* Actionable Health Insight */}
        <p className="text-[11px] text-content-secondary font-medium pt-1 border-t border-border-subtle/30">
          {heatStress.summary || 'Rest in shade every 45 minutes and hydrate with electrolytes.'}
        </p>
      </div>
    </CardShell>
  );
};


