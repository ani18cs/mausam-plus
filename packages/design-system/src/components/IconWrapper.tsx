import React from 'react';
import {
  HeartPulse,
  Activity,
  Waves,
  Plane,
  Users,
  Sprout,
  Car,
  CalendarDays,
  Sun,
  CloudRain,
  CloudLightning,
  CloudFog,
  Cloud,
  ThermometerSun,
  Wind,
} from 'lucide-react';
import { PersonaId } from '@mausam/shared-types';

export interface PersonaIconProps {
  personaId: PersonaId;
  className?: string;
  size?: number;
}

/**
 * Persona Icons with duotone aesthetic warmth
 */
export const PersonaIcon: React.FC<PersonaIconProps> = ({
  personaId,
  className = 'w-6 h-6',
  size,
}) => {
  const iconProps = { className, size };

  switch (personaId) {
    case 'health':
      return <HeartPulse {...iconProps} className={`${className} text-rose-500`} />;
    case 'fitness':
      return <Activity {...iconProps} className={`${className} text-emerald-500`} />;
    case 'beach':
      return <Waves {...iconProps} className={`${className} text-cyan-500`} />;
    case 'traveler':
      return <Plane {...iconProps} className={`${className} text-indigo-500`} />;
    case 'family':
      return <Users {...iconProps} className={`${className} text-amber-500`} />;
    case 'agri':
      return <Sprout {...iconProps} className={`${className} text-green-600`} />;
    case 'commuter':
      return <Car {...iconProps} className={`${className} text-sky-500`} />;
    case 'events':
      return <CalendarDays {...iconProps} className={`${className} text-purple-500`} />;
    default:
      return <Activity {...iconProps} />;
  }
};

export interface WeatherConditionIconProps {
  condition: string;
  isDay?: boolean;
  className?: string;
}

/**
 * Weather condition glyphs with high visual contrast
 */
export const WeatherConditionIcon: React.FC<WeatherConditionIconProps> = ({
  condition,
  className = 'w-8 h-8',
}) => {
  const normalized = condition.toLowerCase();

  if (normalized.includes('rain') || normalized.includes('drizzle') || normalized.includes('shower')) {
    return <CloudRain className={`${className} text-sky-400`} />;
  }
  if (normalized.includes('thunder') || normalized.includes('storm') || normalized.includes('lightning')) {
    return <CloudLightning className={`${className} text-amber-400`} />;
  }
  if (normalized.includes('fog') || normalized.includes('mist') || normalized.includes('haze')) {
    return <CloudFog className={`${className} text-slate-400`} />;
  }
  if (normalized.includes('cloud') || normalized.includes('overcast')) {
    return <Cloud className={`${className} text-slate-300 dark:text-slate-400`} />;
  }
  if (normalized.includes('hot') || normalized.includes('heat')) {
    return <ThermometerSun className={`${className} text-orange-500`} />;
  }
  if (normalized.includes('wind')) {
    return <Wind className={`${className} text-teal-400`} />;
  }

  return <Sun className={`${className} text-amber-400 animate-pulse-subtle`} />;
};
