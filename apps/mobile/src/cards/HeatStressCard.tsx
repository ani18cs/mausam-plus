import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { Flame, Droplets, Sun, Wind, Info } from 'lucide-react';

export const HeatStressCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
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
      title="Physiological Heat-Stress Index"
      subtitle="Composite biometeorological load (Temp + RH + UV + Wind)"
      icon={<Flame className="h-5 w-5 text-orange-500" />}
      badge={{
        severity: getSeverity(heatStress.band),
        label: heatStress.label?.split('/')[0].trim() || 'Caution',
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this score?"
    >
      <div className="space-y-3.5">
        {/* Main Score Hero and Meter */}
        <div className="flex items-end justify-between">
          <div>
            <span className="font-heading text-4xl font-extrabold text-content-primary tracking-tight">
              {heatStress.score}
            </span>
            <span className="ml-1 text-xs font-semibold text-content-muted">/ 100 Index</span>
            <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mt-0.5">
              {heatStress.label}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-medium text-content-muted block">Apparent Thermal Load</span>
            <span className="font-heading text-base font-bold text-content-primary">
              {forecast.current.feels_like_c}°C Perceived
            </span>
          </div>
        </div>

        {/* 4-Segment Thermal Strain Visual Bar */}
        <div className="space-y-1">
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: '30%' }} />
            <div className="h-full bg-amber-400 transition-all" style={{ width: '25%' }} />
            <div className="h-full bg-orange-500 transition-all" style={{ width: '25%' }} />
            <div className="h-full bg-red-600 transition-all" style={{ width: '20%' }} />
          </div>
          <div className="flex justify-between text-[9px] font-semibold uppercase text-content-muted">
            <span>Safe (0-30)</span>
            <span>Caution (50)</span>
            <span>High Risk (75)</span>
            <span>Extreme (90+)</span>
          </div>
        </div>

        {/* Contributing Environmental Telemetry Factors */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border-subtle/50">
          <div className="rounded-xl bg-card-subtle p-2 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <div>
              <span className="text-[9px] text-content-muted block uppercase font-medium">Humidity</span>
              <span className="text-xs font-bold text-content-primary">{forecast.current.humidity_pct}%</span>
            </div>
          </div>

          <div className="rounded-xl bg-card-subtle p-2 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-[9px] text-content-muted block uppercase font-medium">UV Index</span>
              <span className="text-xs font-bold text-content-primary">{forecast.current.uv_index} High</span>
            </div>
          </div>

          <div className="rounded-xl bg-card-subtle p-2 flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <div>
              <span className="text-[9px] text-content-muted block uppercase font-medium">Wind Flow</span>
              <span className="text-xs font-bold text-content-primary">{forecast.current.wind_kph} km/h</span>
            </div>
          </div>
        </div>

        {/* Actionable Health Insight */}
        <div className="rounded-xl bg-card-subtle border border-border-subtle p-2.5 flex items-start gap-2">
          <Info className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-content-secondary leading-snug">
            {heatStress.summary || 'Rest in shade every 45 minutes and drink 500ml water per hour.'}
          </p>
        </div>
      </div>
    </CardShell>
  );
};
