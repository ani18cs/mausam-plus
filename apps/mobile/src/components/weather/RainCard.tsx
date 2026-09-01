import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Droplets } from 'lucide-react';

interface RainCardProps {
  hourly: Array<{
    time: string;
    rain_prob_pct: number;
    temp_c?: number;
  }>;
  className?: string;
}

export const RainCard: React.FC<RainCardProps> = ({ hourly, className = '' }) => {
  // Take next 5 key hours
  const displayHours = hourly.slice(0, 6);

  return (
    <div className={`rounded-3xl border border-border-subtle bg-card p-4 space-y-3.5 shadow-sm ${className}`}>
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-xs font-bold text-content-primary">
              Precipitation Probability Timeline
            </h3>
            <p className="text-[10px] text-content-muted">
              Hourly rainfall risk radar
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center gap-1 border border-sky-500/20">
          <Droplets className="w-2.5 h-2.5" /> Live Radar
        </span>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-2.5 pt-1">
        {displayHours.map((h, idx) => {
          const rawTime = h.time.split('T')[1] || h.time;
          const [hourStr] = rawTime.split(':');
          const hourNum = parseInt(hourStr, 10);
          const isPm = hourNum >= 12;
          const display12H = `${hourNum % 12 === 0 ? 12 : hourNum % 12}:00 ${isPm ? 'PM' : 'AM'}`;
          const pct = Math.max(0, Math.min(100, h.rain_prob_pct || 0));

          return (
            <div key={h.time || idx} className="flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-content-muted w-16 text-[11px] flex-shrink-0">
                {idx === 0 ? 'Now' : display12H}
              </span>

              {/* Progress Track */}
              <div className="flex-1 h-5 rounded-full bg-card-subtle overflow-hidden relative p-0.5 border border-border-subtle/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    pct >= 60
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 shadow-sm'
                      : pct >= 30
                      ? 'bg-gradient-to-r from-teal-400 to-sky-500'
                      : 'bg-gradient-to-r from-slate-300 to-sky-300 dark:from-slate-700 dark:to-sky-900'
                  }`}
                />
              </div>

              {/* Percentage Tag */}
              <span
                className={`w-10 text-right font-heading text-xs font-bold ${
                  pct >= 60
                    ? 'text-sky-600 dark:text-sky-400'
                    : pct >= 30
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-content-muted'
                }`}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
