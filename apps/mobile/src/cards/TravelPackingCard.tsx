import React from 'react';
import { CardProps } from '@mausam/shared-types';
import { CardShell } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import { Plane, Luggage } from 'lucide-react';

export const TravelPackingCard: React.FC<CardProps> = ({
  forecast,
  onOpenWhyModal,
}) => {
  const { t } = useTranslation();
  const precipitationChance = forecast.hourly[0]?.rain_prob_pct ?? 30;

  const packingItems: string[] = ['Light cotton', 'Sunscreen', 'Umbrella'];

  const flightDelayRisk =
    precipitationChance >= 60
      ? 'High'
      : precipitationChance >= 30
        ? 'Moderate'
        : 'Low';

  const severity = flightDelayRisk === 'Low' ? 'safe' : flightDelayRisk === 'Moderate' ? 'caution' : 'warning';

  return (
    <CardShell
      id="card-travel-packing"
      title={t('card.travel_title') || 'Travel & Packing'}
      subtitle="Transit risk & essentials"
      icon={<Plane className="h-4 w-4 text-indigo-500" />}
      badge={{
        severity,
        label: `${flightDelayRisk} Delay Risk`,
      }}
      onWhyClick={onOpenWhyModal}
      whyLabel={t('card.why_button')}
    >
      <div className="space-y-2.5">
        {/* Main Travel Risk Banner */}
        <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/25 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-sm flex-shrink-0">
              <Luggage className="w-4 h-4" />
            </div>
            <div>
              <p className="font-heading text-sm font-extrabold text-content-primary">
                {flightDelayRisk} Flight Delay Risk
              </p>
              <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 block">
                Rain probability: {precipitationChance}%
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="rounded-lg bg-card px-2 py-1 text-[11px] font-bold text-content-primary border border-border-subtle">
              {precipitationChance < 40 ? 'On-Time' : 'Weather Delays'}
            </span>
          </div>
        </div>

        {/* Packing Item Chips */}
        <div className="flex flex-wrap gap-1.5">
          {packingItems.map((item) => (
            <span
              key={item}
              className="rounded-xl bg-card-subtle px-2.5 py-1 text-[10px] font-semibold text-content-secondary border border-border-subtle/50"
            >
              ✓ {item}
            </span>
          ))}
        </div>
      </div>
    </CardShell>
  );
};