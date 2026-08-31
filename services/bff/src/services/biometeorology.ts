import { BiometeorologyData } from '@mausam/shared-types';

/**
 * Calculates Wet-Bulb Temperature (°C) using Stull's empirical formula (2011).
 * Accurate within 0.3°C for RH 5% - 99% and T -20°C to 50°C.
 */
export function calculateStullWetBulb(T: number, RH: number): number {
  const Tw =
    T * Math.atan(0.151977 * Math.pow(RH + 8.313659, 0.5)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035;
  return Math.round(Tw * 10) / 10;
}

/**
 * Calculates Globe Temperature proxy (°C) accounting for ambient temperature,
 * solar shortwave irradiance (W/m²), and wind convective cooling.
 */
export function calculateGlobeTemperature(
  tempC: number,
  solarRadiationWm2: number,
  windKph: number
): number {
  const windMs = Math.max(0.2, windKph / 3.6);
  // Energy balance approximation: Tg = Ta + radiant_gain - convective_loss
  const radiantGain = Math.max(0, solarRadiationWm2 * 0.0128);
  const convectiveLoss = 0.28 * Math.sqrt(windMs);
  const tg = tempC + radiantGain - convectiveLoss;
  return Math.round(tg * 10) / 10;
}

/**
 * Computes Outdoor Wet-Bulb Globe Temperature (WBGT) and maps to MoES/NDMA Heatwave hazard thresholds.
 * Thresholds (MoES / NDMA):
 *  - Normal: < 28°C (#10B981)
 *  - Caution: 28 - 30°C (#F59E0B)
 *  - Extreme Caution: 30 - 32°C (#F97316)
 *  - Danger / Heatstroke Risk: > 32°C (#EF4444)
 */
export function calculateWBGTAndHeatLoad(
  tempC: number,
  humidityPct: number,
  windKph: number,
  solarRadiationWm2: number
): {
  value: number;
  unit: '°C';
  category: string;
  flagColor: string;
} {
  const rh = Math.max(1, Math.min(100, humidityPct));
  const tw = calculateStullWetBulb(tempC, rh);
  const tg = calculateGlobeTemperature(tempC, solarRadiationWm2, windKph);

  // Standard Outdoor WBGT equation: WBGT = 0.7*Tw + 0.2*Tg + 0.1*Ta
  const wbgt = 0.7 * tw + 0.2 * tg + 0.1 * tempC;
  const roundedWbgt = Math.round(wbgt * 10) / 10;

  let category = 'Normal';
  let flagColor = '#10B981'; // Green

  if (roundedWbgt > 32) {
    category = 'Danger / Heatstroke Risk';
    flagColor = '#EF4444'; // Red
  } else if (roundedWbgt >= 30) {
    category = 'Extreme Caution';
    flagColor = '#F97316'; // Orange
  } else if (roundedWbgt >= 28) {
    category = 'Caution';
    flagColor = '#F59E0B'; // Yellow
  }

  return {
    value: roundedWbgt,
    unit: '°C',
    category,
    flagColor,
  };
}

/**
 * Computes Reference Evapotranspiration (ET0 in mm/day) using FAO-56 Penman-Monteith approximation
 * and topsoil moisture retention score (0 - 100) for agricultural sowing comfort.
 */
export function calculateEvapotranspiration(
  tempC: number,
  humidityPct: number,
  solarRadiationWm2: number,
  windKph: number
): {
  et0: number;
  soilMoistureScore: number;
} {
  const rh = Math.max(1, Math.min(100, humidityPct));
  const windMs = Math.max(0.1, windKph / 3.6);

  // Saturated vapor pressure (kPa)
  const es = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  // Actual vapor pressure (kPa)
  const ea = es * (rh / 100);
  // Slope of vapor pressure curve (kPa/°C)
  const delta = (4098 * es) / Math.pow(tempC + 237.3, 2);
  // Psychrometric constant (kPa/°C)
  const gamma = 0.066;

  // Net solar radiation equivalent (MJ/m²/day): 1 W/m² = 0.0864 MJ/m²/day
  // Albedo for green reference crop = 0.23
  const rn = Math.max(0, solarRadiationWm2 * 0.0864 * (1 - 0.23));

  // FAO-56 Penman-Monteith simplified formula
  const numerator = 0.408 * delta * rn + gamma * (900 / (tempC + 273)) * windMs * (es - ea);
  const denominator = delta + gamma * (1 + 0.34 * windMs);
  const et0 = Math.max(0.5, Math.min(14.0, numerator / denominator));
  const roundedEt0 = Math.round(et0 * 10) / 10;

  // Topsoil moisture retention score (0 - 100)
  // Optimal sowing comfort occurs with moderate RH and low-to-moderate ET0 loss rate
  const moistureRetention = Math.round(
    Math.max(10, Math.min(95, rh * 0.75 + (10 - Math.min(10, roundedEt0)) * 2.5))
  );

  return {
    et0: roundedEt0,
    soilMoistureScore: moistureRetention,
  };
}

/**
 * Computes Marine Coastal Swell and Wave Energy according to INCOIS ocean protocols.
 */
export function calculateMarineCoastalSwell(
  swellHeightM: number,
  wavePeriodSec: number,
  windKph: number,
  isCoastal: boolean
): {
  swellHeight: number;
  hazardLevel: string;
} {
  if (!isCoastal) {
    return {
      swellHeight: 0,
      hazardLevel: 'Not Applicable (Inland Region)',
    };
  }

  const hs = Math.max(0.1, swellHeightM);
  const tp = Math.max(2, wavePeriodSec);
  // Swell wave energy flux per meter of wave crest (kW/m): P ~ 0.49 * Hs^2 * Tp
  const waveEnergyFlux = 0.49 * Math.pow(hs, 2) * tp;

  let hazardLevel = 'Safe / Favorable Coastal Waters';
  if (hs >= 2.5 || waveEnergyFlux >= 15 || windKph >= 45) {
    hazardLevel = 'Rough Seas / Severe Marine Warning';
  } else if (hs >= 1.4 || waveEnergyFlux >= 6 || windKph >= 25) {
    hazardLevel = 'Moderate Swell / Caution Advised';
  }

  return {
    swellHeight: Math.round(hs * 10) / 10,
    hazardLevel,
  };
}

export interface BiometeorologyPipelineParams {
  tempC: number;
  humidityPct: number;
  windKph: number;
  solarRadiationWm2?: number;
  uvIndex?: number;
  swellHeightM?: number;
  wavePeriodSec?: number;
  isCoastal?: boolean;
}

/**
 * Executes the complete Step 3 Biometeorological Computing Pipeline
 * producing WBGT, Evapotranspiration, Marine Swell, and Explainability Trace.
 */
export function computeBiometeorologyPipeline(
  params: BiometeorologyPipelineParams
): BiometeorologyData {
  const {
    tempC,
    humidityPct,
    windKph,
    uvIndex = 6,
    swellHeightM = 1.2,
    wavePeriodSec = 8,
    isCoastal = false,
  } = params;

  // Approximate solar radiation (W/m²) if not directly provided: UV index * 100 W/m² baseline
  const solarRadiationWm2 =
    params.solarRadiationWm2 ?? Math.max(0, Math.min(1100, uvIndex * 95));

  const wbgt = calculateWBGTAndHeatLoad(tempC, humidityPct, windKph, solarRadiationWm2);
  const evapotranspiration = calculateEvapotranspiration(
    tempC,
    humidityPct,
    solarRadiationWm2,
    windKph
  );
  const marineSwell = calculateMarineCoastalSwell(
    swellHeightM,
    wavePeriodSec,
    windKph,
    isCoastal
  );

  return {
    wbgt,
    evapotranspiration,
    marineSwell,
    explainabilityTrace: {
      inputs: {
        temp: Math.round(tempC * 10) / 10,
        humidity: Math.round(humidityPct * 10) / 10,
        windSpeed: Math.round(windKph * 10) / 10,
        radiation: Math.round(solarRadiationWm2 * 10) / 10,
      },
      formulaUsed:
        'WBGT = 0.7*Tw + 0.2*Tg + 0.1*Ta | FAO-56 Penman-Monteith ET0 | INCOIS Wave Energy Flux (Hs²·Tp)',
      standardCitation: 'MoES/NDMA Heatwave SOP & INCOIS Ocean Protocol',
    },
  };
}
