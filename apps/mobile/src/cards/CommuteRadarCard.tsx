import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import { Car, CloudRain, AlertCircle, Eye, ShieldAlert } from 'lucide-react';

export const CommuteRadarCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const { t } = useTranslation();

  return (
    <CardShell
      id="card-commute-radar"
      title={t('card.commute_title')}
      subtitle="Evening transit & road friction"
      icon={<Car className="h-4 w-4 text-amber-500" />}
      badge={{
        severity: 'caution',
        label: 'Rain Expected (5-7 PM)',
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button')}
    >
      <div className="space-y-3.5">
        {/* Transit Window Row */}
        <div className="rounded-2xl bg-sky-500/10 border border-sky-500/25 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm flex-shrink-0">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 block">
                Peak Commute (5:00 - 7:30 PM)
              </span>
              <p className="font-heading text-sm font-extrabold text-content-primary">
                65% Convective Showers
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-400 px-2 py-1 text-xs font-extrabold block">
              +25 min Delay
            </span>
          </div>
        </div>

        {/* 2-Column Metrics */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <div className="flex items-center justify-center gap-1 text-[10px] text-content-muted uppercase font-bold">
              <Eye className="w-3.5 h-3.5 text-content-muted" /> Road Visibility
            </div>
            <span className="font-heading text-xs font-bold text-content-primary mt-0.5 block">
              6.5 km (Clear)
            </span>
          </div>

          <div className="rounded-xl bg-card-subtle p-2 border border-border-subtle/40">
            <div className="flex items-center justify-center gap-1 text-[10px] text-amber-500 uppercase font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Active Hazards
            </div>
            <span className="font-heading text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
              2 Waterlogged Areas
            </span>
          </div>
        </div>
      </div>
    </CardShell>
  );
};
