import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import { CalendarDays } from 'lucide-react';

export const EventPlannerComfortCard: React.FC<CardProps> = ({
  forecast,
  onOpenWhyModal,
}) => {
  const { t } = useTranslation();
  const dailyForecast = forecast.daily.slice(0, 7);

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

  const weekendComfort = getComfort(
    dailyForecast[5]?.temp_min_c ?? 20,
    dailyForecast[5]?.temp_max_c ?? 30,
    dailyForecast[5]?.rain_prob_pct ?? 30
  );

  return (
    <CardShell
      id="card-event-planner-comfort"
      title={t('card.event_title') || 'Outdoor Event Comfort'}
      subtitle="7-Day suitability index"
      icon={<CalendarDays className="h-4 w-4 text-indigo-500" />}
      badge={{
        severity: weekendComfort.severity,
        label: `${weekendComfort.label} Weekend`,
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button')}
    >
      <div className="space-y-2.5">
        {/* 7-Day Mini Tiles Strip */}
        <div className="grid grid-cols-7 gap-1">
          {dailyForecast.map((day) => {
            const comfort = getComfort(
              day.temp_min_c,
              day.temp_max_c,
              day.rain_prob_pct
            );

            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-IN', {
              weekday: 'narrow',
            });

            return (
              <div
                key={day.date}
                className="rounded-xl bg-card-subtle p-1.5 text-center border border-border-subtle/40 space-y-0.5"
              >
                <span className="text-[9px] font-bold text-content-muted block uppercase">
                  {dayName}
                </span>

                <span className="font-heading text-xs font-bold text-content-primary block">
                  {Math.round(day.temp_max_c)}°
                </span>

                <span
                  className={`text-[8px] font-extrabold px-1 py-0.2 rounded block ${
                    comfort.severity === 'safe'
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                      : comfort.severity === 'caution'
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                      : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                  }`}
                >
                  {comfort.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </CardShell>
  );
};