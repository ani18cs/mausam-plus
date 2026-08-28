import { HeatStressBand, HeatStressIndex } from '@mausam/shared-types';

/**
 * Calculates a composite Heat-Stress Index (0 - 100) based on:
 * - Ambient Dry Bulb Temperature (°C)
 * - Relative Humidity (%)
 * - Wind Speed (km/h)
 * - UV Index
 *
 * Implements simplified Wet-Bulb Globe Temperature (WBGT) / Australian Apparent Temperature approximation.
 */
export function calculateHeatStressIndex(
  tempC: number,
  humidityPct: number,
  windKph: number,
  uvIndex: number
): HeatStressIndex {
  // Vapor pressure approximation (hPa)
  const e = (humidityPct / 100) * 6.105 * Math.exp((17.27 * tempC) / (237.7 + tempC));
  
  // Apparent Temperature equation (Bureau of Meteorology / Steadman model)
  // AT = Ta + 0.33 * e - 0.70 * ws - 4.00 (where ws is m/s)
  const windMs = windKph / 3.6;
  const apparentTemp = tempC + 0.33 * e - 0.7 * windMs - 4.0;
  
  // Solar radiation adjustment via UV index
  const solarStrainBonus = Math.max(0, uvIndex * 0.8);
  const compositeTemp = apparentTemp + solarStrainBonus;

  // Map composite temperature to 0 - 100 score
  // Below 20°C -> < 30 (Green/Safe)
  // 21 - 29°C -> 30 - 55 (Green/Moderate)
  // 30 - 37°C -> 56 - 74 (Yellow/Caution)
  // 38 - 45°C -> 75 - 89 (Orange/High Risk)
  // > 45°C -> >= 90 (Red/Extreme Danger)
  let score = Math.round(((compositeTemp - 15) / (52 - 15)) * 100);
  score = Math.max(5, Math.min(99, score));

  let band: HeatStressBand = 'green';
  let label = 'Safe / Minimal Stress';
  let summary = 'Ideal outdoor conditions with minimal physiological thermal load.';

  if (score >= 88) {
    band = 'red';
    label = 'Extreme Danger / Heat Stroke Hazard';
    summary = 'Dangerous thermal strain. Avoid strenuous outdoor activity. High risk of heat stroke within 20 mins.';
  } else if (score >= 70) {
    band = 'orange';
    label = 'High Risk / Severe Thermal Strain';
    summary = 'Significant thermal load. Intense physical activity will lead to rapid exhaustion and cramps.';
  } else if (score >= 50) {
    band = 'yellow';
    label = 'Caution / Moderate Heat Load';
    summary = 'Moderate thermal strain. Stay well hydrated and take regular shade breaks during prolonged outdoor work.';
  }

  return {
    score,
    band,
    label,
    summary,
  };
}
