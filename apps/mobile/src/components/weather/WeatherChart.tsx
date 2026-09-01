import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Clock, TrendingUp } from 'lucide-react';
import { TemperatureUnit } from '@mausam/shared-types';

interface ChartPoint {
  time: string;
  temp: number;
  rain: number;
  humidity?: number;
}

interface WeatherChartProps {
  data: ChartPoint[];
  temperatureUnit: TemperatureUnit;
  className?: string;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({
  data,
  temperatureUnit,
  className = '',
}) => {
  const [activeMetric, setActiveMetric] = useState<'both' | 'temp' | 'rain'>('both');

  if (!data || data.length === 0) return null;

  return (
    <div className={`rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-xs font-bold text-content-primary">
              12-Hour Telemetry Curve
            </h3>
            <p className="text-[10px] text-content-muted">
              Diurnal temperature & precipitation trend
            </p>
          </div>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex bg-card-subtle p-0.5 rounded-xl border border-border-subtle text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveMetric('both')}
            className={`px-2 py-0.5 rounded-lg transition-all ${
              activeMetric === 'both'
                ? 'bg-accent-primary text-white shadow-xs'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('temp')}
            className={`px-2 py-0.5 rounded-lg transition-all ${
              activeMetric === 'temp'
                ? 'bg-accent-primary text-white shadow-xs'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            Temp
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('rain')}
            className={`px-2 py-0.5 rounded-lg transition-all ${
              activeMetric === 'rain'
                ? 'bg-accent-primary text-white shadow-xs'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            Rain
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-40 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="weatherTempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="weatherRainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: '11px',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
              formatter={(value: any, name: any) => {
                if (name === 'Temp') {
                  return [`${value}°${temperatureUnit === 'fahrenheit' ? 'F' : 'C'}`, 'Temperature'];
                }
                if (name === 'Rain') {
                  return [`${value}%`, 'Precipitation'];
                }
                return [value, name];
              }}
            />
            {(activeMetric === 'both' || activeMetric === 'temp') && (
              <Area
                type="monotone"
                dataKey="temp"
                name="Temp"
                stroke="#38bdf8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#weatherTempGrad)"
              />
            )}
            {(activeMetric === 'both' || activeMetric === 'rain') && (
              <Area
                type="monotone"
                dataKey="rain"
                name="Rain"
                stroke="#0284c7"
                strokeWidth={1.75}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#weatherRainGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
