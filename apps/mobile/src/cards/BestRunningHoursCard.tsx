import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { Activity, Clock, SunDim, Sparkles } from 'lucide-react';

export const BestRunningHoursCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const running = forecast.extras.running_window || {
    score: 84,
    optimal_time_slot: '05:30 AM - 07:15 AM',
    reason: 'Coolest wet-bulb temperature (22°C), zero UV index, and lowest particulate pollution.',
  };

  const getFitnessSeverity = (score: number): { severity: 'safe' | 'caution' | 'warning' | 'severe'; label: string } => {
    if (score >= 80) return { severity: 'safe', label: 'Prime Conditions' };
    if (score >= 60) return { severity: 'caution', label: 'Fair' };
    if (score >= 40) return { severity: 'warning', label: 'Sub-Optimal' };
    return { severity: 'severe', label: 'Unsafe for Running' };
  };

  return (
    <CardShell
      id="card-fitness-running"
      title="Optimal Running & Workout Window"
      subtitle="Physiological strain & weather index"
      icon={<Activity className="h-5 w-5 text-emerald-500" />}
      badge={getFitnessSeverity(running.score)}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this time?"
    >
      <div className="space-y-3">
        {/* Prime Window Banner */}
        <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/25 p-3">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Recommended Window
              </span>
              <p className="font-heading text-sm font-bold text-content-primary">
                {running.optimal_time_slot}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-heading text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {running.score}
            </span>
            <span className="text-[10px] text-content-muted block font-medium">/100 Score</span>
          </div>
        </div>

        {/* Hourly Suitability Pill Strip */}
        <div className="pt-1">
          <p className="text-[11px] font-semibold text-content-muted mb-1.5 flex items-center gap-1">
            <SunDim className="w-3.5 h-3.5" /> Hourly Workout Feasibility
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-1.5 text-center">
              <span className="text-[10px] text-content-muted block font-medium">06:00 AM</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">92 / 100</span>
            </div>
            <div className="rounded-lg bg-amber-500/15 border border-amber-500/30 p-1.5 text-center">
              <span className="text-[10px] text-content-muted block font-medium">12:00 PM</span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">38 / 100</span>
            </div>
            <div className="rounded-lg bg-amber-500/15 border border-amber-500/30 p-1.5 text-center">
              <span className="text-[10px] text-content-muted block font-medium">06:00 PM</span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">58 / 100</span>
            </div>
            <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-1.5 text-center">
              <span className="text-[10px] text-content-muted block font-medium">08:00 PM</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">76 / 100</span>
            </div>
          </div>
        </div>

        {/* Insight note */}
        <p className="text-xs text-content-secondary flex items-start gap-1.5 pt-1">
          <Sparkles className="w-3.5 h-3.5 text-accent-primary flex-shrink-0 mt-0.5" />
          <span>{running.reason}</span>
        </p>
      </div>
    </CardShell>
  );
};
