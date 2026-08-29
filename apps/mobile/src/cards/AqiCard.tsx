import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import { Wind, ShieldAlert, Sparkles, Activity } from 'lucide-react';

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
    if (val <= 50) return { severity: 'safe' as const, label: 'Good (0-50)', color: '#10B981', verdict: '✅ Clean Air: Safe for all outdoor activities', bg: 'bg-emerald-500/10 text-emerald-600' };
    if (val <= 100) return { severity: 'safe' as const, label: 'Satisfactory (51-100)', color: '#0D9488', verdict: '🌱 Moderate: Acceptable air quality', bg: 'bg-teal-500/10 text-teal-600' };
    if (val <= 200) return { severity: 'caution' as const, label: 'Moderate (101-200)', color: '#F59E0B', verdict: '⚠️ Sensitive groups reduce prolonged outdoor cardio', bg: 'bg-amber-500/10 text-amber-600' };
    if (val <= 300) return { severity: 'warning' as const, label: 'Poor (201-300)', color: '#EA580C', verdict: '😷 Wear an N95 mask outdoors. High PM2.5', bg: 'bg-orange-500/10 text-orange-600' };
    return { severity: 'severe' as const, label: 'Severe (301+)', color: '#EF4444', verdict: '🛑 Health Hazard: Stay indoors with air purifiers on', bg: 'bg-red-500/10 text-red-600' };
  };

  const cfg = getAqiConfig(aqi);
  const aqiPct = Math.min(100, Math.round((aqi / 350) * 100));

  return (
    <CardShell
      id="card-health-aqi"
      title={t('card.aqi_title')}
      subtitle={`Primary: ${breakdown.primary_pollutant}`}
      icon={<Wind className="h-4 w-4 text-sky-500" />}
      badge={{ severity: cfg.severity, label: cfg.label }}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button')}
    >
      <div className="space-y-3.5">
        {/* Main AQI Value & Visual Arc/Bar Meter */}
        <div className="rounded-2xl bg-card-subtle p-3 space-y-2 border border-border-subtle/60">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-content-muted block">
                Air Quality Index
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-heading text-3xl font-extrabold text-content-primary tracking-tight">
                  {aqi}
                </span>
                <span className="text-[11px] font-bold text-content-muted">AQI</span>
              </div>
            </div>

            <div className={`px-2.5 py-1 rounded-xl text-xs font-bold ${cfg.bg}`}>
              {cfg.label.split(' ')[0]}
            </div>
          </div>

          {/* Continuous Multi-Color Spectrum Bar with Position Indicator */}
          <div className="space-y-1">
            <div className="relative h-2.5 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 to-rose-600 shadow-inner overflow-visible">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900 shadow-md transition-all duration-300"
                style={{ left: `calc(${aqiPct}% - 8px)` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-content-muted pt-0.5">
              <span className="text-emerald-500">0 Good</span>
              <span className="text-amber-500">100 Mod</span>
              <span className="text-orange-500">200 Poor</span>
              <span className="text-rose-500">300+ Severe</span>
            </div>
          </div>
        </div>

        {/* 4 Micro Pollutants Grid with Clean Badges */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <span className="text-[9px] font-bold text-content-muted block uppercase">PM2.5</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.pm25}</span>
          </div>
          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <span className="text-[9px] font-bold text-content-muted block uppercase">PM10</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.pm10}</span>
          </div>
          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <span className="text-[9px] font-bold text-content-muted block uppercase">NO₂</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.no2}</span>
          </div>
          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <span className="text-[9px] font-bold text-content-muted block uppercase">O₃</span>
            <span className="font-heading text-xs font-bold text-content-primary">{breakdown.o3}</span>
          </div>
        </div>

        {/* Actionable Health Verdict in Plain Language */}
        <div className="rounded-xl bg-accent-primary/10 border border-accent-primary/20 p-2.5 text-[11px] font-semibold text-accent-primary flex items-center gap-2">
          <Activity className="w-4 h-4 flex-shrink-0" />
          <span className="leading-snug">{cfg.verdict}</span>
        </div>
      </div>
    </CardShell>
  );
};
