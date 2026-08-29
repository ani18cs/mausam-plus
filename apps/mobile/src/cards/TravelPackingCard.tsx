import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const TravelPackingCard: React.FC<CardProps> = ({
  forecast,
  onOpenWhyModal,
}) => {
  const temperature = forecast.current.temp_c;
  const precipitationChance = forecast.hourly[0]?.rain_prob_pct ?? 30;
  const windSpeed = forecast.current.wind_kph;

  const trendData = forecast.hourly.slice(0, 12).map((h) => ({
    time: new Date(h.time).toLocaleTimeString('en-IN', {
      hour: 'numeric',
    }),
    temp: h.temp_c,
    rain: h.rain_prob_pct,
  }));

  const packingItems: string[] = [];

  if (temperature >= 30) {
    packingItems.push('Light cotton clothes');
    packingItems.push('Sunscreen');
    packingItems.push('Water bottle');
  } else if (temperature <= 20) {
    packingItems.push('Light jacket');
    packingItems.push('Comfortable layers');
  } else {
    packingItems.push('Light comfortable clothes');
  }

  if (precipitationChance >= 40) {
    packingItems.push('Umbrella / rain jacket');
  }

  if (windSpeed >= 25) {
    packingItems.push('Windproof outer layer');
  }

  const flightDelayRisk =
    precipitationChance >= 60
      ? 'High'
      : precipitationChance >= 30
        ? 'Moderate'
        : 'Low';

  return (
    <CardShell
      id="card-travel-packing"
      title="Travel Packing & Flight Risk"
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this travel guidance?"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              TRAVELER
            </p>

            <h3 className="text-lg font-semibold text-white">
              Travel & Packing
            </h3>
          </div>

          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
            {flightDelayRisk} delay risk
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-800 p-3">
            <p className="text-xs text-slate-400">Temp</p>
            <p className="font-semibold text-white">
              {temperature}°C
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-3">
            <p className="text-xs text-slate-400">Rain</p>
            <p className="font-semibold text-white">
              {precipitationChance}%
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-3">
            <p className="text-xs text-slate-400">Wind</p>
            <p className="font-semibold text-white">
              {windSpeed} km/h
            </p>
          </div>
        </div>

        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={25}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temp"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="rain"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-white">
            Recommended packing
          </p>

          <div className="flex flex-wrap gap-2">
            {packingItems.map((item) => (
              <span
                key={item}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 p-3 text-sm text-slate-300">
          Packing recommendations are based on current weather conditions.
        </div>
      </div>
    </CardShell>
  );
};