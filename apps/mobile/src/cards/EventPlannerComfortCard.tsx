import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { CalendarDays } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const EventPlannerComfortCard: React.FC<CardProps> = ({
  forecast,
  onOpenWhyModal,
}) => {
  const dailyForecast = forecast.daily.slice(0, 7);

  const trendData = dailyForecast.map((day) => ({
    day: new Date(day.date).toLocaleDateString('en-IN', {
      weekday: 'short',
    }),
    maxTemp: day.temp_max_c,
    rain: day.rain_prob_pct,
  }));

  const getComfort = (
    minTemp: number,
    maxTemp: number,
    rainProb: number
  ): {
    label: string;
    severity: 'safe' | 'caution' | 'warning' | 'severe';
  } => {
    if (rainProb >= 70 || maxTemp >= 40) {
      return { label: 'Poor', severity: 'warning' };
    }

    if (rainProb >= 40 || maxTemp >= 35 || minTemp <= 10) {
      return { label: 'Fair', severity: 'caution' };
    }

    return { label: 'Good', severity: 'safe' };
  };

  return (
    <CardShell
      id="card-event-planner-comfort"
      title="7-Day Outdoor Event Comfort"
      subtitle="Plan outdoor events around temperature and rain risk."
      icon={<CalendarDays className="h-5 w-5 text-indigo-500" />}
      onWhyClick={onOpenWhyModal}
      whyLabel="Why this comfort?"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-7 gap-1.5">
          {dailyForecast.map((day) => {
            const comfort = getComfort(
              day.temp_min_c,
              day.temp_max_c,
              day.rain_prob_pct
            );

            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-IN', {
              weekday: 'short',
            });

            return (
              <div
                key={day.date}
                className="rounded-xl bg-card-subtle p-2 text-center"
              >
                <p className="text-[10px] font-semibold text-content-muted">
                  {dayName}
                </p>

                <p className="mt-1 font-heading text-xs font-bold text-content-primary">
                  {Math.round(day.temp_max_c)}°
                </p>

                <p className="text-[10px] text-content-muted">
                  {Math.round(day.temp_min_c)}°
                </p>

                <div className="mt-2">
                  <span className="text-[10px] font-semibold text-content-primary">
                    {comfort.label}
                  </span>
                </div>

                <p className="mt-1 text-[10px] text-content-muted">
                  Rain {day.rain_prob_pct}%
                </p>
              </div>
            );
          })}
        </div>

        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis
                dataKey="day"
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
                dataKey="maxTemp"
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

        <div className="rounded-xl border border-border-subtle/50 bg-card-subtle p-3">
          <p className="text-xs font-semibold text-content-primary">
            Event planning guidance
          </p>

          <p className="mt-1 text-xs text-content-muted">
            Prefer days with lower rain probability and moderate temperatures
            for outdoor events.
          </p>
        </div>
      </div>
    </CardShell>
  );
};