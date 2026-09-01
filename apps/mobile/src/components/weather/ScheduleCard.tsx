import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, Sparkles, Footprints, Car, Sun, Plane } from 'lucide-react';

export interface ScheduleItem {
  id: string;
  title: string;
  category: 'workout' | 'commute' | 'uv' | 'travel' | 'farming';
  timeSlot: string;
  status: 'optimal' | 'caution' | 'warning';
  summary: string;
}

interface ScheduleCardProps {
  items?: ScheduleItem[];
  className?: string;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  items = [
    {
      id: '1',
      title: 'Morning Cardio & Outdoor Run',
      category: 'workout',
      timeSlot: '05:30 AM - 07:15 AM',
      status: 'optimal',
      summary: 'Lowest wet-bulb temperature (19.8°C) and zero solar UV strain.',
    },
    {
      id: '2',
      title: 'Peak UV Radiation Advisory',
      category: 'uv',
      timeSlot: '11:30 AM - 03:00 PM',
      status: 'caution',
      summary: 'UV Index spikes to 8.2. Apply SPF 50+ and wear sunglasses.',
    },
    {
      id: '3',
      title: 'Evening Transit & Commute Window',
      category: 'commute',
      timeSlot: '05:30 PM - 07:30 PM',
      status: 'warning',
      summary: 'Scattered convective shower expected. Depart before 5 PM or use metro.',
    },
  ],
  className = '',
}) => {
  const getIcon = (cat: ScheduleItem['category']) => {
    switch (cat) {
      case 'workout':
        return <Footprints className="w-4 h-4 text-emerald-500" />;
      case 'commute':
        return <Car className="w-4 h-4 text-amber-500" />;
      case 'uv':
        return <Sun className="w-4 h-4 text-orange-500" />;
      case 'travel':
        return <Plane className="w-4 h-4 text-sky-500" />;
      default:
        return <Clock className="w-4 h-4 text-accent-primary" />;
    }
  };

  return (
    <div className={`rounded-3xl border border-border-subtle bg-card p-4 space-y-3.5 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-xs font-bold text-content-primary">
              Smart Daily Activity Schedule
            </h3>
            <p className="text-[10px] text-content-muted">
              AI-derived circadian & weather windows
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary flex items-center gap-1 border border-accent-primary/20">
          <Sparkles className="w-2.5 h-2.5" /> AI Optimized
        </span>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-2 pt-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-2xl bg-card-subtle/80 border border-border-subtle/70 transition-all hover:bg-card"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-card border border-border-subtle flex-shrink-0 shadow-xs mt-0.5">
              {getIcon(item.category)}
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-heading text-xs font-bold text-content-primary truncate">
                  {item.title}
                </h4>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 flex items-center gap-1 ${
                    item.status === 'optimal'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : item.status === 'caution'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {item.status === 'optimal' ? (
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  ) : (
                    <AlertTriangle className="w-2.5 h-2.5" />
                  )}
                  {item.status.toUpperCase()}
                </span>
              </div>

              <div className="text-[11px] font-semibold text-accent-primary">
                {item.timeSlot}
              </div>

              <p className="text-[10px] text-content-secondary leading-snug">
                {item.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
