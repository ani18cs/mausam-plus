import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import { Wind } from 'lucide-react';

export const AqiCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const { t } = useTranslation();
  const aqi = forecast.current.aqi || 128;
  const breakdown = forecast.extras.aqi_breakdown || {
    pm25: 54.2,
    pm10: 98.6,
    no2: 24.1,
    o3: 38.0,
    primary_pollutant: 'PM2.5',
  };

  const getAqiConfig = (val: number) => {
    if (val <= 50) return { severity: 'safe' as const, label: 'Good (0-50)', color: '#10B981', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
    if (val <= 100) return { severity: 'safe' as const, label: 'Satisfactory (51-100)', color: '#0D9488', bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' };
    if (val <= 200) return { severity: 'caution' as const, label: 'Moderate (101-200)', color: '#F59E0B', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };
    if (val <= 300) return { severity: 'warning' as const, label: 'Poor (201-300)', color: '#EA580C', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' };
    return { severity: 'severe' as const, label: 'Severe (301+)', color: '#EF4444', bg: 'bg-red-500/10 text-red-600 dark:text-red-400' };
  };

  const cfg = getAqiConfig(aqi);
  const aqiPct = Math.min(100, Math.round((aqi / 350) * 100));

  const radius = 34;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (aqiPct / 100) * circumference;

  return (
    <CardShell
      id="card-health-aqi"
      title={t('card.aqi_title') || 'Air Quality'}
      subtitle={`Dominant: ${breakdown.primary_pollutant}`}
      icon={<Wind className="h-4 w-4 text-sky-500" />}
      badge={{ severity: cfg.severity, label: cfg.label.split(' ')[0] }}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button') || 'Why?'}
    >
      <div className="space-y-2.5">
        {/* Main High-Signal Row: Gauge + Primary AQI + Status */}
        <div className="rounded-2xl bg-card-subtle p-3 border border-border-subtle/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
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
                  stroke={cfg.color}
                  strokeWidth="7"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1.5">
                <span className="font-heading text-lg font-extrabold text-content-primary leading-none">
                  {aqi}
                </span>
                <span className="text-[8px] font-bold text-content-muted">AQI</span>
              </div>
            </div>

            <div>
              <p className="font-heading text-sm font-bold text-content-primary leading-tight">
                {cfg.label.split('(')[0].trim()}
              </p>
              <span className="text-[10px] font-medium text-content-muted block mt-0.5">
                Primary: {breakdown.primary_pollutant}
              </span>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-xl text-xs font-bold ${cfg.bg}`}>
            {cfg.label.split(' ')[0]}
          </div>
        </div>

        {/* 4 Micro Pollutants Grid */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="rounded-xl bg-card-subtle py-1.5 px-1 border border-border-subtle/40">
            <span className="text-[8px] font-bold text-content-muted block uppercase">PM2.5</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.pm25}</span>
          </div>
          <div className="rounded-xl bg-card-subtle py-1.5 px-1 border border-border-subtle/40">
            <span className="text-[8px] font-bold text-content-muted block uppercase">PM10</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.pm10}</span>
          </div>
          <div className="rounded-xl bg-card-subtle py-1.5 px-1 border border-border-subtle/40">
            <span className="text-[8px] font-bold text-content-muted block uppercase">NO₂</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.no2}</span>
          </div>
          <div className="rounded-xl bg-card-subtle py-1.5 px-1 border border-border-subtle/40">
            <span className="text-[8px] font-bold text-content-muted block uppercase">O₃</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.o3}</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
};
