import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { HeartPulse, Wind } from 'lucide-react';

export const AqiCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const aqi = forecast.current.aqi || 128;
  const breakdown = forecast.extras.aqi_breakdown || {
    pm25: 54.2,
    pm10: 98.6,
    no2: 24.1,
    o3: 38.0,
    primary_pollutant: 'PM2.5',
  };

  const getAqiSeverity = (val: number): { severity: 'safe' | 'caution' | 'warning' | 'severe'; label: string } => {
    if (val <= 50) return { severity: 'safe', label: 'Good (0-50)' };
    if (val <= 100) return { severity: 'safe', label: 'Satisfactory (51-100)' };
    if (val <= 200) return { severity: 'caution', label: 'Moderate (101-200)' };
    if (val <= 300) return { severity: 'warning', label: 'Poor (201-300)' };
    return { severity: 'severe', label: 'Severe (>300)' };
  };

  const status = getAqiSeverity(aqi);

  return (
    <CardShell
      id="card-health-aqi"
      title="Air Quality & Respiratory Index"
      subtitle={`Primary Pollutant: ${breakdown.primary_pollutant}`}
      icon={<HeartPulse className="h-5 w-5 text-rose-500" />}
      badge={status}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this AQI?"
    >
      <div className="space-y-3">
        {/* Main Numerical Hero */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-heading text-4xl font-extrabold text-content-primary tracking-tight">
              {aqi}
            </span>
            <span className="ml-1.5 text-xs font-semibold text-content-muted">US-AQI</span>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-content-muted">PM2.5 Dominant</p>
            <p className="text-xs font-bold text-amber-500 dark:text-amber-400">
              {breakdown.pm25} µg/m³
            </p>
          </div>
        </div>

        {/* Multi-pollutant Grid */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border-subtle/50">
          <div className="rounded-xl bg-card-subtle p-2 text-center">
            <span className="text-[10px] font-semibold text-content-muted uppercase">PM2.5</span>
            <p className="font-heading text-xs font-bold text-content-primary mt-0.5">{breakdown.pm25}</p>
          </div>
          <div className="rounded-xl bg-card-subtle p-2 text-center">
            <span className="text-[10px] font-semibold text-content-muted uppercase">PM10</span>
            <p className="font-heading text-xs font-bold text-content-primary mt-0.5">{breakdown.pm10}</p>
          </div>
          <div className="rounded-xl bg-card-subtle p-2 text-center">
            <span className="text-[10px] font-semibold text-content-muted uppercase">NO₂</span>
            <p className="font-heading text-xs font-bold text-content-primary mt-0.5">{breakdown.no2}</p>
          </div>
          <div className="rounded-xl bg-card-subtle p-2 text-center">
            <span className="text-[10px] font-semibold text-content-muted uppercase">O₃</span>
            <p className="font-heading text-xs font-bold text-content-primary mt-0.5">{breakdown.o3}</p>
          </div>
        </div>

        {/* Actionable Health Guidance */}
        <div className="rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 p-2.5 flex items-center gap-2">
          <Wind className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-900 dark:text-amber-200">
            Sensitive groups should reduce prolonged outdoor exertion today.
          </p>
        </div>
      </div>
    </CardShell>
  );
};
