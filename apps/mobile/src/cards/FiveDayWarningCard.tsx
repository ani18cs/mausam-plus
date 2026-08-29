import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMDDistrictWarningItem, IMDDayWarning } from '@mausam/shared-types';

interface FiveDayWarningCardProps {
  districtName?: string;
}

export const FiveDayWarningCard: React.FC<FiveDayWarningCardProps> = ({
  districtName = 'New Delhi',
}) => {
  const [warnings, setWarnings] = useState<IMDDistrictWarningItem[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchWarnings = async () => {
      try {
        const res = await fetch('/api/imd/warnings');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.data && json.data.length > 0) {
            setWarnings(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load district warnings', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWarnings();
  }, []);

  if (loading && warnings.length === 0) return null;

  const districtData = warnings[0] || null;
  if (!districtData || !districtData.days || districtData.days.length === 0) return null;

  const activeDay: IMDDayWarning = districtData.days[selectedDayIndex] || districtData.days[0];

  const getColorConfig = (level: string) => {
    switch (level) {
      case 'red':
        return {
          pill: 'bg-rose-500 text-white shadow-rose-500/50',
          border: 'border-rose-500/40',
          bg: 'from-rose-950/40 to-slate-900',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          icon: '🔴',
        };
      case 'orange':
        return {
          pill: 'bg-amber-500 text-black shadow-amber-500/50',
          border: 'border-amber-500/40',
          bg: 'from-amber-950/40 to-slate-900',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          icon: '🟠',
        };
      case 'yellow':
        return {
          pill: 'bg-yellow-400 text-black shadow-yellow-400/50',
          border: 'border-yellow-500/30',
          bg: 'from-yellow-950/20 to-slate-900',
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
          icon: '🟡',
        };
      default:
        return {
          pill: 'bg-emerald-500 text-white shadow-emerald-500/50',
          border: 'border-emerald-500/30',
          bg: 'from-emerald-950/20 to-slate-900',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          icon: '🟢',
        };
    }
  };

  const activeConfig = getColorConfig(activeDay.colorLevel);

  return (
    <div className="rounded-2xl p-4 mb-4 bg-slate-900/80 border border-slate-800 backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">🗓️</span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              5-Day Outlook &amp; Warning Matrix
            </h4>
            <p className="text-[11px] text-slate-400">
              {districtData.districtName}, {districtData.stateName}
            </p>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
          IMD NWFC Protocol
        </span>
      </div>

      {/* 5-Day Interactive Pills */}
      <div className="grid grid-cols-5 gap-1.5 mb-3.5">
        {districtData.days.map((day, idx) => {
          const cfg = getColorConfig(day.colorLevel);
          const isSelected = selectedDayIndex === idx;
          const dayDate = new Date(day.dateStr);
          const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tmrw' : dayDate.toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all border ${
                isSelected
                  ? `${cfg.border} bg-slate-800/90 shadow-md ring-1 ring-white/20`
                  : 'border-slate-800/60 bg-slate-950/40 hover:bg-slate-800/40'
              }`}
            >
              <span className="text-[10px] font-medium text-slate-400 mb-1">
                {dayName}
              </span>
              <span className="text-xs mb-1.5">{cfg.icon}</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  day.colorLevel === 'red'
                    ? 'bg-rose-500'
                    : day.colorLevel === 'orange'
                    ? 'bg-amber-500'
                    : day.colorLevel === 'yellow'
                    ? 'bg-yellow-400'
                    : 'bg-emerald-500'
                }`}
              ></div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Expanded Detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDayIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className={`p-3 rounded-xl border ${activeConfig.border} bg-gradient-to-br ${activeConfig.bg}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                Day {activeDay.dayIndex} ({activeDay.dateStr})
              </span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeConfig.badge}`}>
              {activeDay.colorLabel}
            </span>
          </div>

          {/* Active Hazards */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {activeDay.hazardTypes.map((h, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-900/60 text-slate-200 border border-slate-700/60"
              >
                ⚠️ {h}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {activeDay.warningText}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
