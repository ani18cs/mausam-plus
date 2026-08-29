import { TemperatureUnit, WindSpeedUnit } from '@mausam/shared-types';

/**
 * Converts temperature in Celsius to specified unit
 */
export const convertTemp = (tempC: number, unit: TemperatureUnit): number => {
  if (unit === 'fahrenheit') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC * 10) / 10;
};

/**
 * Formats temperature with symbol
 */
export const formatTemp = (tempC: number, unit: TemperatureUnit, showUnit = true): string => {
  const val = convertTemp(tempC, unit);
  const rounded = Math.round(val);
  return showUnit ? `${rounded}°${unit === 'fahrenheit' ? 'F' : 'C'}` : `${rounded}°`;
};

/**
 * Converts wind speed in km/h to specified unit
 */
export const convertWind = (windKph: number, unit: WindSpeedUnit): number => {
  switch (unit) {
    case 'mph':
      return Math.round(windKph * 0.621371 * 10) / 10;
    case 'mps':
      return Math.round((windKph / 3.6) * 10) / 10;
    case 'knots':
      return Math.round(windKph * 0.539957 * 10) / 10;
    case 'kph':
    default:
      return Math.round(windKph * 10) / 10;
  }
};

/**
 * Formats wind speed with unit label
 */
export const formatWind = (windKph: number, unit: WindSpeedUnit): string => {
  const val = convertWind(windKph, unit);
  const unitLabel = unit === 'mps' ? 'm/s' : unit === 'mph' ? 'mph' : unit === 'knots' ? 'kts' : 'km/h';
  return `${val} ${unitLabel}`;
};
