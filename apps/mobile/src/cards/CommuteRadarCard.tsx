import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import { Car, CloudRain, Eye, AlertCircle } from 'lucide-react';

export const CommuteRadarCard: React.FC<CardProps> = ({ forecast, onOpenWhyModal }) => {
  const { t } = useTranslation();
  const rainProb = forecast.hourly?.[17]?.rain_prob_pct ?? 65;

  return (
    <CardShell
      id="card-commute-radar"
      title={t('card.commute_title')}
      subtitle="Road & transit friction"
      icon={<Car className="h-4 w-4 text-amber-500" />}
      badge={{
        severity: rainProb > 50 ? 'caution' : 'safe',
        label: rainProb > 50 ? 'Rain (5-7 PM)' : 'Clear Roads',
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button')}
    >
      <div className="space-y-2.5">
        {/* Transit Window Banner */}
        <div className="rounded-2xl bg-sky-500/10 border border-sky-500/25 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm flex-shrink-0">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <p className="font-heading text-sm font-extrabold text-content-primary">
                {rainProb > 40 ? `${rainProb}% Shower Risk` : 'Clear Transit Conditions'}
              </p>
              <span className="text-[10px] font-medium text-sky-600 dark:text-sky-400 block">
                Peak Commute: 5:00 - 7:30 PM
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-400 px-2 py-1 text-[11px] font-extrabold block">
              {rainProb > 50 ? '+20m Delay' : 'Normal'}
            </span>
          </div>
        </div>

        {/* 2-Column Metrics */}
        <div className="grid grid-cols-2 gap-1.5 text-center text-[10px] font-medium">
          <div className="rounded-xl bg-card-subtle py-1.5 px-2 border border-border-subtle/40">
            <span className="text-content-muted block">Visibility</span>
            <span className="font-heading text-xs font-bold text-content-primary">
              6.5 km (Clear)
            </span>
          </div>

          <div className="rounded-xl bg-card-subtle py-1.5 px-2 border border-border-subtle/40">
            <span className="text-content-muted block">Road Obstacles</span>
            <span className="font-heading text-xs font-bold text-amber-600 dark:text-amber-400">
              2 Waterlogged Spots
            </span>
          </div>
        </div>
      </div>
    </CardShell>
  );
};
