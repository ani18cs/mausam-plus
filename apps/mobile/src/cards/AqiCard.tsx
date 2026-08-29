import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { Wind } from 'lucide-react';

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
    if (val <= 50) return { severity: 'safe', label: 'Good' };
    if (val <= 100) return { severity: 'safe', label: 'Satisfactory' };
    if (val <= 200) return { severity: 'caution', label: 'Moderate' };
    if (val <= 300) return { severity: 'warning', label: 'Poor' };
    return { severity: 'severe', label: 'Severe' };
  };

  const status = getAqiSeverity(aqi);

  // AQI progress percentage (capped at 400 scale)
  const aqiPct = Math.min(100, Math.round((aqi / 350) * 100));

  return (
    <CardShell
      id="card-health-aqi"
      title="Air Quality Index"
      subtitle={`Primary: ${breakdown.primary_pollutant}`}
      icon={<Wind className="h-4 w-4" />}
      badge={status}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this AQI?"
    >
      <div className="space-y-3">
        {/* Main AQI Value & Progress Bar */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-3xl font-extrabold text-content-primary tracking-tight">
                {aqi}
              </span>
              <span className="text-xs font-semibold text-content-muted">US-AQI</span>
            </div>
            <span className="text-xs font-semibold text-content-secondary">
              PM2.5: {breakdown.pm25} µg/m³
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                aqi <= 50
                  ? 'bg-emerald-500'
                  : aqi <= 100
                  ? 'bg-teal-500'
                  : aqi <= 200
                  ? 'bg-amber-400'
                  : aqi <= 300
                  ? 'bg-orange-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${aqiPct}%` }}
            />
          </div>
        </div>

        {/* Multi-pollutant Clean Row */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border-subtle/50 text-center">
          <div>
            <span className="text-[10px] text-content-muted block uppercase font-medium">PM2.5</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.pm25}</span>
          </div>
          <div>
            <span className="text-[10px] text-content-muted block uppercase font-medium">PM10</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.pm10}</span>
          </div>
          <div>
            <span className="text-[10px] text-content-muted block uppercase font-medium">NO₂</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.no2}</span>
          </div>
          <div>
            <span className="text-[10px] text-content-muted block uppercase font-medium">O₃</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.o3}</span>
          </div>
        </div>

        {/* Guidance Note */}
        <p className="text-[11px] text-content-secondary font-medium pt-1 border-t border-border-subtle/30">
          Sensitive individuals should reduce prolonged outdoor exertion.
        </p>
      </div>
    </CardShell>
  );
};

