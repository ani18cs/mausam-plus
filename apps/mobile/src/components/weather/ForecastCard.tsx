import React from 'react';
import { formatTemp } from '../../utils/units';
import { TemperatureUnit } from '@mausam/shared-types';
import { get3DWeatherIcon } from './weatherIconMap';

interface ForecastCardProps {
  time: string;
  condition: string;
  tempC: number;
  temperatureUnit: TemperatureUnit;
  isCurrent?: boolean;
  rainProbPct?: number;
  className?: string;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  time,
  condition,
  tempC,
  temperatureUnit,
  isCurrent = false,
  rainProbPct,
  className = '',
}) => {
  const iconSrc = get3DWeatherIcon(condition);

  return (
    <div
      className={`flex flex-col items-center justify-between gap-1.5 p-3 rounded-2xl min-w-[72px] transition-all border ${
        isCurrent
          ? 'bg-accent-primary/15 border-accent-primary shadow-sm font-bold ring-1 ring-accent-primary/30'
          : 'bg-card-subtle/80 hover:bg-card border-border-subtle/80 text-content-secondary'
      } ${className}`}
    >
      <span className="text-[11px] font-semibold text-content-muted">{time}</span>
      <div className="w-9 h-9 flex items-center justify-center my-1 drop-shadow-md">
        <img
          src={iconSrc}
          alt={condition}
          className="w-full h-full object-contain filter drop-shadow-sm transition-transform hover:scale-110"
          loading="lazy"
        />
      </div>
      <span className="font-heading text-xs font-bold text-content-primary">
        {formatTemp(tempC, temperatureUnit, false)}°
      </span>
      {rainProbPct !== undefined && rainProbPct > 20 && (
        <span className="text-[9px] font-bold text-sky-500 mt-0.5">
          {rainProbPct}%
        </span>
      )}
    </div>
  );
};
