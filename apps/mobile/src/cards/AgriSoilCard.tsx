import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
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
  onOpenWhyModal,
}) => {
  const { t } = useTranslation();
  const moisture = 38;

  return (
    <CardShell
      id="card-agri-soil"
      title={t('card.agri_title') || 'Soil Moisture'}
      subtitle="Topsoil & sowing window"
      icon={<Sprout className="h-4 w-4 text-emerald-600" />}
      badge={{
        severity: 'safe',
        label: `Optimal (${moisture}%)`,
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button')}
    >
      <div className="space-y-2.5">
        {/* Main moisture value banner */}
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm flex-shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <p className="font-heading text-sm font-extrabold text-content-primary">
                Favorable Sowing Window
              </p>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 block">
                Field Capacity: {moisture}%
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="font-heading text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {moisture}%
            </span>
          </div>
        </div>

        {/* Soil trend graph */}
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={soilTrend} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <XAxis dataKey="day" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={[20, 50]} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="moisture" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Agricultural indicators */}
        <div className="grid grid-cols-2 gap-1.5 text-center text-[10px] font-medium">
          <div className="rounded-xl bg-card-subtle py-1.5 px-2 border border-border-subtle/40 flex items-center justify-center gap-1.5">
            <Droplets className="h-3.5 w-3.5 text-sky-500" />
            <span className="text-content-muted">Spraying:</span>
            <strong className="text-content-primary">Favorable</strong>
          </div>

          <div className="rounded-xl bg-card-subtle py-1.5 px-2 border border-border-subtle/40 flex items-center justify-center gap-1.5">
            <Snowflake className="h-3.5 w-3.5 text-cyan-500" />
            <span className="text-content-muted">Frost Risk:</span>
            <strong className="text-emerald-600 dark:text-emerald-400">Low</strong>
          </div>
        </div>
      </div>
    </CardShell>
  );
};