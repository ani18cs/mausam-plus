import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { Activity, Clock } from 'lucide-react';

export const BestRunningHoursCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const running = forecast.extras.running_window || {
    score: 84,
    optimal_time_slot: '05:30 AM - 07:15 AM',
    reason: 'Coolest wet-bulb temperature (22°C), zero UV index, and lowest particulate pollution.',
  };

  const getFitnessSeverity = (score: number): { severity: 'safe' | 'caution' | 'warning' | 'severe'; label: string } => {
    if (score >= 80) return { severity: 'safe', label: 'Prime' };
    if (score >= 60) return { severity: 'caution', label: 'Fair' };
    if (score >= 40) return { severity: 'warning', label: 'Sub-Optimal' };
    return { severity: 'severe', label: 'Unsafe' };
  };

  return (
    <CardShell
      id="card-fitness-running"
      title="Workout & Running Window"
      subtitle="Optimal thermal & air comfort"
      icon={<Activity className="h-4 w-4" />}
      badge={getFitnessSeverity(running.score)}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this time?"
    >
      <div className="space-y-3">
        {/* Prime Window Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-medium text-content-muted block">Optimal Window</span>
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

        {/* Hourly Feasibility Strip */}
        <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-border-subtle/50 text-center">
          <div className="rounded-lg bg-card-subtle py-1.5 px-1">
            <span className="text-[10px] text-content-muted block font-medium">06:00 AM</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">92/100</span>
          </div>
          <div className="rounded-lg bg-card-subtle py-1.5 px-1">
            <span className="text-[10px] text-content-muted block font-medium">12:00 PM</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">38/100</span>
          </div>
          <div className="rounded-lg bg-card-subtle py-1.5 px-1">
            <span className="text-[10px] text-content-muted block font-medium">06:00 PM</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">58/100</span>
          </div>
          <div className="rounded-lg bg-card-subtle py-1.5 px-1">
            <span className="text-[10px] text-content-muted block font-medium">08:00 PM</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">76/100</span>
          </div>
        </div>

        {/* Insight note */}
        <p className="text-[11px] text-content-secondary font-medium pt-1 border-t border-border-subtle/30">
          {running.reason}
        </p>
      </div>
    </CardShell>
  );
};

