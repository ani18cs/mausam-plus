import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import { Activity, Clock } from 'lucide-react';

export const BestRunningHoursCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const { t } = useTranslation();
  const running = forecast.extras.running_window || {
    score: 92,
    optimal_time_slot: '05:30 AM - 07:15 AM',
    reason: 'Coolest wet-bulb temperature, zero UV index, and lowest particulate pollution.',
  };

  const getFitnessSeverity = (score: number): { severity: 'safe' | 'caution' | 'warning' | 'severe'; label: string } => {
    if (score >= 80) return { severity: 'safe', label: 'Prime' };
    if (score >= 60) return { severity: 'caution', label: 'Fair' };
    if (score >= 40) return { severity: 'warning', label: 'Sub-Optimal' };
    return { severity: 'severe', label: 'Unsafe' };
  };

  const timeSlots = [
    { time: '06:00 AM', score: 92, label: 'Prime', color: 'bg-emerald-500 text-white' },
    { time: '09:00 AM', score: 68, label: 'Fair', color: 'bg-teal-500 text-white' },
    { time: '01:00 PM', score: 32, label: 'Heat', color: 'bg-rose-500 text-white' },
    { time: '06:30 PM', score: 78, label: 'Good', color: 'bg-emerald-500 text-white' },
  ];

  return (
    <CardShell
      id="card-fitness-running"
      title={t('card.running_title')}
      subtitle="Optimal workout window"
      icon={<Activity className="h-4 w-4 text-emerald-500" />}
      badge={getFitnessSeverity(running.score)}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button')}
    >
      <div className="space-y-2.5">
        {/* Recommended Golden Slot Banner */}
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-heading text-sm font-extrabold text-content-primary">
                {running.optimal_time_slot}
              </p>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 block">
                Lowest thermal strain &amp; UV
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="font-heading text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {running.score}
            </span>
            <span className="text-[8px] text-content-muted block font-bold">/100 Index</span>
          </div>
        </div>

        {/* 4-Time Slot Timeline Visualizer */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {timeSlots.map((slot, idx) => (
            <div key={idx} className="rounded-xl bg-card-subtle py-1.5 px-1 border border-border-subtle/40 space-y-0.5">
              <span className="text-[9px] font-bold text-content-muted block">{slot.time}</span>
              <div className={`py-0.5 px-1 rounded-md text-[9px] font-bold ${slot.color}`}>
                {slot.score}
              </div>
              <span className="text-[8px] font-semibold text-content-secondary block truncate">
                {slot.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
};
