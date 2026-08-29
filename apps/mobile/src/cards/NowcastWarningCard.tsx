import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMDNowcastDistrictItem } from '@mausam/shared-types';

interface NowcastWarningCardProps {
  districtName?: string;
  onOpenRadar?: () => void;
}

export const NowcastWarningCard: React.FC<NowcastWarningCardProps> = ({
  districtName = 'Delhi',
  onOpenRadar,
}) => {
  const [nowcasts, setNowcasts] = useState<IMDNowcastDistrictItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const fetchNowcasts = async () => {
      try {
        const res = await fetch('/api/imd/nowcasts');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.data && json.data.length > 0) {
            setNowcasts(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load nowcasts', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNowcasts();
    const interval = setInterval(fetchNowcasts, 60000); // 60s live poll
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading && nowcasts.length === 0) return null;

  const currentItem = nowcasts[currentIndex] || nowcasts[0];
  if (!currentItem) return null;

  const isSevere = currentItem.severityLevel === 'warning' || currentItem.severityLevel === 'alert';
  const severityBadgeColor =
    currentItem.severityLevel === 'warning'
      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
      : currentItem.severityLevel === 'alert'
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 mb-4 border backdrop-blur-md transition-all ${
        isSevere
          ? 'bg-gradient-to-br from-rose-950/40 via-amber-950/20 to-slate-900/80 border-rose-500/30 shadow-lg shadow-rose-950/30'
          : 'bg-slate-900/70 border-slate-800'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {isSevere && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                currentItem.severityLevel === 'warning'
                  ? 'bg-rose-500'
                  : currentItem.severityLevel === 'alert'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            ></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            IMD 3-Hr Live Nowcast
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityBadgeColor}`}>
            {currentItem.severityLevel === 'warning'
              ? 'WARNING'
              : currentItem.severityLevel === 'alert'
              ? 'WATCH / ALERT'
              : 'NORMAL'}
          </span>
          {nowcasts.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : nowcasts.length - 1))}
                className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev < nowcasts.length - 1 ? prev + 1 : 0))}
                className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* District & Timing */}
      <div className="flex items-baseline justify-between mb-2">
        <h4 className="text-base font-bold text-white tracking-tight">
          {currentItem.districtName}
        </h4>
        <span className="text-[11px] text-slate-400 font-mono">
          Valid till {currentItem.validUptoIST}
        </span>
      </div>

      {/* Hazard Description */}
      <div className="space-y-1.5 mb-3">
        {currentItem.activeHazards.map((hazard, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs">
            <span className="text-amber-400 mt-0.5">⚡</span>
            <div>
              <span className="font-semibold text-slate-200">{hazard.title}: </span>
              <span className="text-slate-300">{hazard.description}</span>
            </div>
          </div>
        ))}
        {currentItem.customMessage && (
          <p className="text-xs text-amber-200/90 italic bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
            "{currentItem.customMessage}"
          </p>
        )}
      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
        <span className="text-[11px] text-slate-400">
          Source: IMD Radar-GIS Network
        </span>
        {onOpenRadar && (
          <button
            onClick={onOpenRadar}
            className="flex items-center gap-1 text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
          >
            <span>Live Radar &amp; Cloud Scan</span>
            <span>→</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
