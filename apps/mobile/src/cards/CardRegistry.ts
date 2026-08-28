import React from 'react';
import { CardProps, PersonaId } from '@mausam/shared-types';
import { AqiCard } from './AqiCard';
import { BestRunningHoursCard } from './BestRunningHoursCard';
import { TideCard } from './TideCard';
import { HeatStressCard } from './HeatStressCard';
import { CommuteRadarCard } from './CommuteRadarCard';

export interface CardRegistryEntry {
  id: string;
  title: string;
  category: string;
  component: React.FC<CardProps>;
  relevantPersonas: PersonaId[];
  defaultRank: number; // 1 = highest default priority
  description: string;
}

/**
 * =========================================================================
 * 🛠️ HOW TEAMMATES ADD A NEW CARD:
 * 1. Build your Card component in `apps/mobile/src/cards/MyNewCard.tsx`
 *    using the `<CardShell>` wrapper from `@mausam/design-system`.
 * 2. Register it below in `CARD_REGISTRY`.
 * 3. Assign relevant personas in `relevantPersonas`.
 * 4. See docs/CARDS.md for detailed props & ranking documentation.
 * =========================================================================
 */
export const CARD_REGISTRY: Record<string, CardRegistryEntry> = {
  'card-heat-stress': {
    id: 'card-heat-stress',
    title: 'Physiological Heat-Stress Index',
    category: 'thermal_stress',
    component: HeatStressCard,
    relevantPersonas: ['health', 'fitness', 'agri', 'family', 'commuter', 'events'],
    defaultRank: 1,
    description: 'Composite thermal strain calculated from ambient temp, humidity, wind, and UV.',
  },
  'card-health-aqi': {
    id: 'card-health-aqi',
    title: 'Air Quality & Pollutant Breakdown',
    category: 'health_aqi',
    component: AqiCard,
    relevantPersonas: ['health', 'family', 'fitness', 'commuter'],
    defaultRank: 2,
    description: 'Real-time AQI, PM2.5/PM10 concentrations and respiratory safety advice.',
  },
  'card-fitness-running': {
    id: 'card-fitness-running',
    title: 'Optimal Running & Workout Window',
    category: 'outdoor_fitness',
    component: BestRunningHoursCard,
    relevantPersonas: ['fitness', 'health'],
    defaultRank: 3,
    description: 'Hourly outdoor workout suitability index considering UV and heat load.',
  },
  'card-beach-tide': {
    id: 'card-beach-tide',
    title: 'Tide, Wave & Coastal Marine',
    category: 'beach_marine',
    component: TideCard,
    relevantPersonas: ['beach', 'traveler', 'events'],
    defaultRank: 4,
    description: 'High/Low tide schedule, swell height, sea water temperature, and surf conditions.',
  },
  'card-commute-radar': {
    id: 'card-commute-radar',
    title: 'Commute Weather & Radar Hazard',
    category: 'commute_radar',
    component: CommuteRadarCard,
    relevantPersonas: ['commuter', 'family', 'traveler'],
    defaultRank: 5,
    description: 'Precipitation radar, transit delays, and citizen-reported road waterlogging.',
  },
  // TODO [Teammate 3 & 4]: Add Farmer/Agri Soil Moisture Card here
  // TODO [Teammate 3 & 4]: Add Traveler Packing & Severe Alerts Card here
  // TODO [Teammate 3 & 4]: Add Event Planner 7-Day Comfort Matrix Card here
};

/**
 * Computes ranked list of card IDs based on user's active personas and optional custom order
 */
export function getRankedCardIds(
  selectedPersonas: PersonaId[],
  customOrder?: string[],
  hiddenCardIds: string[] = []
): string[] {
  // If user has a saved custom order, honor it first, then append any missing registered cards
  if (customOrder && customOrder.length > 0) {
    const validCustom = customOrder.filter((id) => CARD_REGISTRY[id] && !hiddenCardIds.includes(id));
    const remaining = Object.keys(CARD_REGISTRY).filter(
      (id) => !validCustom.includes(id) && !hiddenCardIds.includes(id)
    );
    return [...validCustom, ...remaining];
  }

  // Otherwise calculate dynamic score based on persona relevance
  const scored = Object.values(CARD_REGISTRY)
    .filter((entry) => !hiddenCardIds.includes(entry.id))
    .map((entry) => {
      let score = entry.defaultRank;
      const matches = entry.relevantPersonas.filter((p) => selectedPersonas.includes(p)).length;
      if (matches > 0) {
        // Boost priority if card directly matches selected personas
        score -= matches * 10;
      }
      return { id: entry.id, score };
    });

  scored.sort((a, b) => a.score - b.score);
  return scored.map((item) => item.id);
}
