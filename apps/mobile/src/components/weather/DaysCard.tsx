import React, { useState } from 'react';
import { DailyForecastItem, TemperatureUnit } from '@mausam/shared-types';
import { formatTemp } from '../../utils/units';
import { get3DWeatherIcon } from './weatherIconMap';
import { ChevronDown, CloudRain, Sunrise, Sunset } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DaysCardProps {
  day: DailyForecastItem;
  dayIndex: number;
  temperatureUnit: TemperatureUnit;
  isToday?: boolean;
  className?: string;
}

export const DaysCard: React.FC<DaysCardProps> = ({
  day,
  dayIndex,
  temperatureUnit,
  isToday = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dDate = new Date(day.date);
  const dayName = isToday
    ? 'Today'
    : dDate.toLocaleDateString('en-US', { weekday: 'short' });
  const dateFormatted = dDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const iconSrc = get3DWeatherIcon(day.condition);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`cursor-pointer rounded-2xl border transition-all p-3.5 ${
        isToday
          ? 'bg-accent-primary/10 border-accent-primary/40 shadow-sm'
          : 'bg-card hover:bg-card-subtle/80 border-border-subtle'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Day Name & Condition */}
        <div className="space-y-0.5 min-w-[90px]">
          <div className="flex items-center gap-1.5">
            <span className="font-heading text-xs font-bold text-content-primary">
              {dayName}
            </span>
            <span className="text-[10px] text-content-muted">{dateFormatted}</span>
          </div>
          <p className="text-[11px] text-content-secondary truncate max-w-[130px]">
            {day.condition || 'Mainly Clear'}
          </p>
        </div>

        {/* Right: Temperatures & 3D Glyph */}
        <div className="flex items-center gap-3">
          {/* Highest / Lowest Numbers with Divider */}
          <div className="flex items-center gap-2 text-right">
            <div className="text-right">
              <span className="block font-heading text-xs font-extrabold text-content-primary leading-tight">
                {formatTemp(day.temp_max_c, temperatureUnit, false)}°
              </span>
              <span className="block font-heading text-[10px] font-semibold text-content-muted leading-tight">
                {formatTemp(day.temp_min_c, temperatureUnit, false)}°
              </span>
            </div>

            {/* Vertical Divider */}
            <div className="h-6 w-[1px] bg-border-subtle" />
          </div>

          {/* 3D Weather Icon */}
          <div className="w-10 h-10 flex items-center justify-center drop-shadow-md">
            <img
              src={iconSrc}
              alt={day.condition || 'Weather'}
              className="w-full h-full object-contain filter drop-shadow"
              loading="lazy"
            />
          </div>

          {/* Expand Chevron */}
          <div className="w-5 h-5 rounded-full bg-card-subtle flex items-center justify-center text-content-muted">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3 h-3" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expandable Extended Details Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-3 mt-2 border-t border-border-subtle/60 text-xs space-y-2"
          >
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-card-subtle">
                <span className="text-content-muted flex items-center justify-center gap-1">
                  <CloudRain className="w-3 h-3 text-sky-400" /> Rain Risk
                </span>
                <span className="font-bold text-content-primary mt-0.5 block">
                  {day.rain_prob_pct}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-card-subtle">
                <span className="text-content-muted flex items-center justify-center gap-1">
                  <Sunrise className="w-3 h-3 text-amber-400" /> Sunrise
                </span>
                <span className="font-bold text-content-primary mt-0.5 block">
                  {day.sunrise || '06:00'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-card-subtle">
                <span className="text-content-muted flex items-center justify-center gap-1">
                  <Sunset className="w-3 h-3 text-orange-400" /> Sunset
                </span>
                <span className="font-bold text-content-primary mt-0.5 block">
                  {day.sunset || '18:30'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
