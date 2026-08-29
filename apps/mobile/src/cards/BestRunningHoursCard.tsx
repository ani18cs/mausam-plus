import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import { Activity, Clock, Zap, CheckCircle2 } from 'lucide-react';

export const BestRunningHoursCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const { t } = useTranslation();
  const running = forecast.extras.running_window || {
    score: 84,
    optimal_time_slot: '05:30 AM - 07:15 AM',
    reason: 'Coolest wet-bulb temperature (22°C), zero UV index, and lowest particulate pollution.',
  };

  const getFitnessSeverity = (score: number): { severity: 'safe' | 'caution' | 'warning' | 'severe'; label: string } => {
    if (score >= 80) return { severity: 'safe', label: 'Prime Conditions' };
    if (score >= 60) return { severity: 'caution', label: 'Fair' };
    if (score >= 40) return { severity: 'warning', label: 'Sub-Optimal' };
    return { severity: 'severe', label: 'Unsafe' };
  };

  const timeSlots = [
    { time: '06:00 AM', score: 92, label: 'Prime', color: 'bg-emerald-500 text-white' },
    { time: '09:00 AM', score: 68, label: 'Fair', color: 'bg-teal-500 text-white' },
    { time: '01:00 PM', score: 32, label: 'High Heat', color: 'bg-rose-500 text-white' },
    { time: '06:30 PM', score: 78, label: 'Good', color: 'bg-emerald-500 text-white' },
  ];

  return (
    <CardShell
      id="card-fitness-running"
      title={t('card.running_title')}
      subtitle="Optimal thermal & air comfort"
      icon={<Activity className="h-4 w-4 text-emerald-500" />}
      badge={getFitnessSeverity(running.score)}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button')}
    >
      <div className="space-y-3.5">
        {/* Recommended Golden Slot Banner */}
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 block">
                Recommended Workout Window
              </span>
              <p className="font-heading text-sm font-extrabold text-content-primary">
                {running.optimal_time_slot}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-heading text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {running.score}
            </span>
            <span className="text-[10px] text-content-muted block font-bold">/100 Index</span>
          </div>
        </div>

        {/* 4-Time Slot Timeline Visualizer */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted block">
            Daytime Cardio Feasibility
          </span>
          <div className="grid grid-cols-4 gap-2 text-center">
            {timeSlots.map((slot, idx) => (
              <div key={idx} className="rounded-xl bg-card-subtle p-2 border border-border-subtle/50 space-y-1">
                <span className="text-[10px] font-bold text-content-muted block">{slot.time}</span>
                <div className={`py-0.5 px-1 rounded-md text-[10px] font-bold ${slot.color}`}>
                  {slot.score}/100
                </div>
                <span className="text-[9px] font-medium text-content-secondary block truncate">
                  {slot.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Training Insight */}
        <div className="rounded-xl bg-card-subtle border border-border-subtle/40 p-2.5 text-[11px] font-medium text-content-secondary flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="leading-snug">{running.reason}</span>
        </div>
      </div>
    </CardShell>
  );
};
