import React from 'react';
import { CardProps, PersonaId } from '@mausam/shared-types';
import { AqiCard } from './AqiCard';
import { BestRunningHoursCard } from './BestRunningHoursCard';
import { TideCard } from './TideCard';
import { HeatStressCard } from './HeatStressCard';
import { CommuteRadarCard } from './CommuteRadarCard';
import { AgriSoilCard } from './AgriSoilCard';
import { TravelPackingCard } from './TravelPackingCard';
import { EventPlannerComfortCard } from './EventPlannerComfortCard';

export interface CardRegistryEntry {
  id: string;
  title: string;
  category: string;
  component: React.FC<CardProps>;
  relevantPersonas: PersonaId[];
  defaultRank: number;
  description: string;
}

export const CARD_REGISTRY: Record<string, CardRegistryEntry> = {
  'card-heat-stress': {
    id: 'card-heat-stress',
    title: 'Physiological Heat-Stress Index',
    category: 'thermal_stress',
    component: HeatStressCard,
    relevantPersonas: [
      'health',
      'fitness',
      'agri',
      'family',
      'commuter',
      'events',
    ],
    defaultRank: 1,
    description:
      'Composite thermal strain calculated from ambient temp, humidity, wind, and UV.',
  },

  'card-health-aqi': {
    id: 'card-health-aqi',
    title: 'Air Quality & Pollutant Breakdown',
    category: 'health_aqi',
    component: AqiCard,
    relevantPersonas: ['health', 'family', 'fitness', 'commuter'],
    defaultRank: 2,
    description:
      'Real-time AQI, PM2.5/PM10 concentrations and respiratory safety advice.',
  },

  'card-fitness-running': {
    id: 'card-fitness-running',
    title: 'Optimal Running & Workout Window',
    category: 'outdoor_fitness',
    component: BestRunningHoursCard,
    relevantPersonas: ['fitness', 'health'],
    defaultRank: 3,
    description:
      'Hourly outdoor workout suitability index considering UV and heat load.',
  },

  'card-beach-tide': {
    id: 'card-beach-tide',
    title: 'Tide, Wave & Coastal Marine',
    category: 'beach_marine',
    component: TideCard,
    relevantPersonas: ['beach', 'traveler', 'events'],
    defaultRank: 4,
    description:
      'High/Low tide schedule, swell height, sea water temperature, and surf conditions.',
  },

  'card-commute-radar': {
    id: 'card-commute-radar',
    title: 'Commute Weather & Radar Hazard',
    category: 'commute_radar',
    component: CommuteRadarCard,
    relevantPersonas: ['commuter', 'family', 'traveler'],
    defaultRank: 5,
    description:
      'Precipitation radar, transit delays, and citizen-reported road waterlogging.',
  },

  'card-agri-soil': {
    id: 'card-agri-soil',
    title: 'Soil Moisture & Sowing Window',
    category: 'agri_farming',
    component: AgriSoilCard,
    relevantPersonas: ['agri', 'family'],
    defaultRank: 6,
    description:
      'Topsoil saturation level, evapotranspiration rates, and crop planting advice.',
  },

  'card-travel-packing': {
    id: 'card-travel-packing',
    title: 'Travel Packing & Flight Risk',
    category: 'travel_packing',
    component: TravelPackingCard,
    relevantPersonas: ['traveler', 'family', 'events'],
    defaultRank: 7,
    description:
      'Weather-based packing recommendations, daily travel comfort, and travel risk indicators.',
  },

  'card-event-planner-comfort': {
    id: 'card-event-planner-comfort',
    title: '7-Day Outdoor Event Comfort',
    category: 'event_planning',
    component: EventPlannerComfortCard,
    relevantPersonas: ['events', 'family', 'traveler'],
    defaultRank: 8,
    description:
      'Seven-day outdoor event comfort based on temperature, rain probability, and weather conditions.',
  },
};

/**
 * Computes ranked list of card IDs strictly matching user's selected personas (+ pinned cards)
 */
export function getOptedInCardIds(
  selectedPersonas: PersonaId[],
  customOrder?: string[],
  pinnedCardIds: string[] = []
): string[] {
  const matchingCards = Object.values(CARD_REGISTRY).filter((card) => {
    const isPersonaMatch = card.relevantPersonas.some((p) => selectedPersonas.includes(p));
    const isPinned = pinnedCardIds.includes(card.id);
    return isPersonaMatch || isPinned;
  });

  const matchingIds = matchingCards.map((c) => c.id);

  if (customOrder && customOrder.length > 0) {
    const validCustom = customOrder.filter((id) => matchingIds.includes(id));
    const remaining = matchingIds.filter((id) => !validCustom.includes(id));
    return [...validCustom, ...remaining];
  }

  matchingCards.sort((a, b) => {
    const matchA =
      a.relevantPersonas.filter((p) => selectedPersonas.includes(p)).length +
      (pinnedCardIds.includes(a.id) ? 5 : 0);
    const matchB =
      b.relevantPersonas.filter((p) => selectedPersonas.includes(p)).length +
      (pinnedCardIds.includes(b.id) ? 5 : 0);
    return matchB - matchA;
  });

  return matchingCards.map((c) => c.id);
}

/**
 * Returns cards for personas that the user did NOT select (for collapsible "More categories" section)
 */
export function getUnselectedCardIds(
  selectedPersonas: PersonaId[],
  pinnedCardIds: string[] = []
): string[] {
  const unselectedCards = Object.values(CARD_REGISTRY).filter((card) => {
    const isPersonaMatch = card.relevantPersonas.some((p) => selectedPersonas.includes(p));
    const isPinned = pinnedCardIds.includes(card.id);
    return !isPersonaMatch && !isPinned;
  });

  return unselectedCards.map((c) => c.id);
}

export function getRankedCardIds(
  selectedPersonas: PersonaId[],
  customOrder?: string[],
  hiddenCardIds: string[] = []
): string[] {
  return getOptedInCardIds(selectedPersonas, customOrder, []);
}