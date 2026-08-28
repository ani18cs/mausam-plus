import { HeatStressBand, HeatStressIndex } from '@mausam/shared-types';

/**
 * Calculates Wet-Bulb Temperature (°C) using Stull's empirical formula (2011).
 * Accurate within 0.3°C for RH 5% - 99% and T -20°C to 50°C.
 */
export function calculateWetBulbTemperature(T: number, RH: number): number {
  const Tw =
    T * Math.atan(0.151977 * Math.pow(RH + 8.313659, 0.5)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035;
  return Math.round(Tw * 10) / 10;
}

/**
 * Calculates Thom's Discomfort Index (DI).
 * DI = T - 0.55 * (1 - 0.01 * RH) * (T - 14.5)
 */
export function calculateDiscomfortIndex(T: number, RH: number): number {
  const di = T - 0.55 * (1 - 0.01 * RH) * (T - 14.5);
  return Math.round(di * 10) / 10;
}

/**
 * Calculates a rigorous composite Heat-Stress Index (0 - 100) based on:
 * - Ambient Dry Bulb Temperature (°C)
 * - Relative Humidity (%)
 * - Wind Speed (km/h)
 * - UV Index
 */
export function calculateHeatStressIndex(
  tempC: number,
  humidityPct: number,
  windKph: number,
  uvIndex: number
): HeatStressIndex {
  const RH = Math.max(1, Math.min(100, humidityPct));
  const T = tempC;
  const windMs = Math.max(0.1, windKph / 3.6);

  // 1. Vapor pressure approximation (hPa)
  const e = (RH / 100) * 6.105 * Math.exp((17.27 * T) / (237.7 + T));

  // 2. Steadman Apparent Temperature
  const apparentTemp = T + 0.33 * e - 0.7 * windMs - 4.0;

  // 3. Stull Wet-Bulb Temperature
  const wetBulb = calculateWetBulbTemperature(T, RH);

  // 4. Thom's Discomfort Index
  const discomfort = calculateDiscomfortIndex(T, RH);

  // 5. Globe temperature proxy with direct solar UV radiation
  const solarRadiantGain = Math.max(0, uvIndex * 1.1);
  const globeTempProxy = T + solarRadiantGain - 0.3 * windMs;

  // 6. Simplified Outdoor WBGT (Wet Bulb Globe Temperature)
  // WBGT_outdoor = 0.7 * Tw + 0.2 * Tg + 0.1 * Td
  const wbgt = 0.7 * wetBulb + 0.2 * globeTempProxy + 0.1 * T;

  // 7. Evaporative cooling efficiency (sweat cooling drops as vapor pressure approaches saturation)
  const maxVaporPressure = 6.105 * Math.exp((17.27 * 35) / (237.7 + 35)); // Skin temp approx 35°C
  const evaporativeEfficiency = Math.max(10, Math.min(100, Math.round((1 - e / maxVaporPressure) * 100)));

  // 8. Hydration loss estimate (ml/hr) during moderate outdoor activity
  const baseHydrationLoss = 350; // ml/hr baseline
  const heatHydrationBonus = Math.max(0, (wbgt - 22) * 55);
  const estimatedHydrationLoss = Math.round(baseHydrationLoss + heatHydrationBonus);

  // Map composite WBGT & Apparent Temp into normalized 0 - 100 Score
  // WBGT < 21 -> Safe (0 - 45)
  // WBGT 21 - 27 -> Caution (46 - 69)
  // WBGT 28 - 31 -> High Risk (70 - 87)
  // WBGT > 32 -> Extreme Danger (88 - 100)
  let score = Math.round(((wbgt - 14) / (36 - 14)) * 100);
  score = Math.max(5, Math.min(99, score));

  let band: HeatStressBand = 'green';
  let label = 'Safe / Minimal Thermal Strain';
  let summary = 'Ideal biometeorological conditions with uninhibited evaporative sweat cooling.';

  if (score >= 88 || wbgt >= 32) {
    band = 'red';
    label = 'Extreme Danger / Heat Stroke Hazard';
    summary = `Critical thermal strain (WBGT ${wbgt.toFixed(1)}°C). Evaporative sweat efficiency is only ${evaporativeEfficiency}%. Stop strenuous activity to prevent clinical heat illness.`;
  } else if (score >= 70 || wbgt >= 28) {
    band = 'orange';
    label = 'High Risk / Severe Thermal Strain';
    summary = `Significant physiological heat load (Perceived ${apparentTemp.toFixed(1)}°C). Perspiration cooling is impaired by ${100 - evaporativeEfficiency}%. Drink ${estimatedHydrationLoss}ml/hr.`;
  } else if (score >= 48 || wbgt >= 24) {
    band = 'yellow';
    label = 'Caution / Moderate Thermal Load';
    summary = `Moderate thermal strain during peak daytime hours. Hydration replenishment rate: ${estimatedHydrationLoss}ml water per hour outdoors.`;
  }

  return {
    score,
    band,
    label,
    summary,
    apparent_temp_c: Math.round(apparentTemp * 10) / 10,
    wet_bulb_temp_c: Math.round(wetBulb * 10) / 10,
    wbgt_c: Math.round(wbgt * 10) / 10,
    discomfort_index: Math.round(discomfort * 10) / 10,
    evaporative_cooling_efficiency_pct: evaporativeEfficiency,
    hydration_loss_ml_per_hr: estimatedHydrationLoss,
  };
}
