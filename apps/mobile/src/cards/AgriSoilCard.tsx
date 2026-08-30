import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { Sprout, Droplets, Snowflake } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const soilTrend = [
  { day: 'Today', moisture: 38 },
  { day: 'Tue', moisture: 40 },
  { day: 'Wed', moisture: 42 },
  { day: 'Thu', moisture: 39 },
  { day: 'Fri', moisture: 36 },
  { day: 'Sat', moisture: 34 },
  { day: 'Sun', moisture: 32 },
];

export const AgriSoilCard: React.FC<CardProps> = ({
  forecast,
  onOpenWhyModal,
}) => {
  const moisture = 38;
  const frostRisk = 'Low';
  const sprayingWindow = 'Favorable';

  return (
    <CardShell
      id="card-agri-soil"
      title="Soil Moisture & Sowing Window"
      subtitle="Topsoil moisture & agricultural guide"
      icon={<Sprout className="h-5 w-5 text-green-600" />}
      badge={{
        severity: 'safe',
        label: `Optimal Soil Moisture (${moisture}%)`,
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this guidance?"
    >
      <div className="space-y-3">

        {/* Main moisture value */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-heading text-4xl font-extrabold text-content-primary tracking-tight">
              {moisture}%
            </span>
            <span className="ml-1.5 text-xs font-semibold text-content-muted">
              Field Capacity
            </span>
          </div>

          <span className="text-xs font-bold text-emerald-600">
            Favorable for sowing
          </span>
        </div>

        {/* Soil trend graph */}
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={soilTrend}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[20, 50]}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={25}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="moisture"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Agricultural indicators */}
        <div className="grid grid-cols-2 gap-2">

          <div className="rounded-xl bg-card-subtle p-2">
            <div className="flex items-center gap-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] font-semibold text-content-muted uppercase">
                Spraying
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-content-primary">
              {sprayingWindow}
            </p>
          </div>

          <div className="rounded-xl bg-card-subtle p-2">
            <div className="flex items-center gap-1">
              <Snowflake className="h-4 w-4 text-cyan-500" />
              <span className="text-[10px] font-semibold text-content-muted uppercase">
                Frost Risk
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-content-primary">
              {frostRisk}
            </p>
          </div>

        </div>

        {/* Guidance */}
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5">
          <p className="text-xs text-content-secondary leading-snug">
            Recent rainfall has provided favorable moisture conditions.
            Monitor soil moisture before additional irrigation.
          </p>
        </div>

      </div>
    </CardShell>
  );
};