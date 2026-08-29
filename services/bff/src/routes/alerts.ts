import { Router, Request, Response } from 'express';
import { Alert } from '@mausam/shared-types';
import { fetchOpenMeteoForecast } from '../services/openMeteo';

export const alertsRouter = Router();

/**
 * Base alert templates.
 * Live values are injected at request time.
 */
const baseAlerts: Alert[] = [
  {
    id: 'alert-heat-01',
    title: 'Heat Stress Alert',
    severity: 'warning',
    category: 'heat',
    headline: 'Elevated heat-stress conditions detected.',
    message: 'Heat-stress conditions require attention.',
    issuedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    affectedRegion: 'Current Location',
    reasonTrace: {
      ruleName: 'RULE_HEAT_STRESS_INDEX',
      summary: 'Heat-stress index crossed the configured alert threshold.',
      explanation: 'Current temperature, humidity, UV and wind conditions contribute to thermal strain.',
      recommendation:
        'Stay hydrated, reduce strenuous outdoor activity if symptoms of heat strain appear, and prefer shaded or cooler periods for prolonged activity.',
      confidencePct: 90,
      steps: [],
    },
  },
  {
    id: 'alert-rain-02',
    title: 'High Rain Probability Alert',
    severity: 'caution',
    category: 'storm',
    headline: 'Elevated rain probability detected.',
    message: 'Rain-prone conditions are expected today.',
    issuedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    affectedRegion: 'Current Location',
    reasonTrace: {
      ruleName: 'RULE_HIGH_RAIN_PROBABILITY',
      summary: 'Rain probability crossed the configured alert threshold.',
      explanation: 'The current daily forecast indicates elevated rain probability.',
      recommendation:
        'Carry rain protection, avoid waterlogged roads and low-lying areas, and allow extra travel time if conditions worsen.',
      confidencePct: 88,
      steps: [],
    },
  },
];

/**
 * Builds the current dynamic alerts using live forecast data.
 */
async function buildDynamicAlerts(req: Request): Promise<Alert[]> {
  const lat = req.query.lat ? Number(req.query.lat) : 12.9716;
  const lon = req.query.lon ? Number(req.query.lon) : 77.5946;
  const name = (req.query.name as string) || 'Bengaluru, Karnataka';

  const forecast = await fetchOpenMeteoForecast(lat, lon, name);

  const current = forecast.current;
  const heatStress = forecast.extras.heat_stress_index;
  const today = forecast.daily[0];

  const shouldShowHeatAlert = heatStress.score >= 48;
  const shouldShowRainAlert = today.rain_prob_pct >= 60;

  const dynamicHeatAlert: Alert = {
    ...baseAlerts[0],

    title: `Heat Stress ${heatStress.band.toUpperCase()} Alert`,

    headline: `${heatStress.label} in ${forecast.location.name}.`,

    message:
      `Current conditions are ${current.temp_c}°C with ` +
      `${current.humidity_pct}% humidity, UV Index ${current.uv_index}, ` +
      `and wind speed ${current.wind_kph} km/h. ` +
      `The calculated heat-stress score is ${heatStress.score}.`,

    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),

    affectedRegion: forecast.location.name,

    reasonTrace: {
      ...baseAlerts[0].reasonTrace,

      ruleName: 'RULE_HEAT_STRESS_INDEX',

      summary: heatStress.summary ||  'Heat-stress conditions have crossed the configured safety threshold.',

      explanation:
        `WBGT is ${heatStress.wbgt_c}°C, apparent temperature is ` +
        `${heatStress.apparent_temp_c}°C, and evaporative cooling efficiency ` +
        `is ${heatStress.evaporative_cooling_efficiency_pct}%.`,

      recommendation:
        'Stay hydrated, reduce strenuous outdoor activity if symptoms of heat strain appear, and prefer shaded or cooler periods for prolonged activity.',

      confidencePct: 90,

      steps: [
        {
          factor: 'Heat Stress Score',
          observedValue: `${heatStress.score}`,
          threshold: '>= 48',
          contribution: 'primary',
        },
        {
          factor: 'Ambient Temperature',
          observedValue: `${current.temp_c} °C`,
          threshold: 'Context factor',
          contribution: 'context',
        },
        {
          factor: 'Relative Humidity',
          observedValue: `${current.humidity_pct}%`,
          threshold: 'Context factor',
          contribution: 'context',
        },
        {
          factor: 'UV Index',
          observedValue: `${current.uv_index}`,
          threshold: 'Context factor',
          contribution: 'context',
        },
        {
          factor: 'Wind Speed',
          observedValue: `${current.wind_kph} km/h`,
          threshold: 'Context factor',
          contribution: 'context',
        },
      ],
    },
  };

  const dynamicStormAlert: Alert = {
    ...baseAlerts[1],

    title: 'High Rain Probability Alert',

    headline: `${today.rain_prob_pct}% chance of rain today in ${forecast.location.name}.`,

    message:
      `Today's forecast indicates ${today.rain_prob_pct}% rain probability ` +
      `with ${today.condition} conditions.`,

    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),

    affectedRegion: forecast.location.name,

    reasonTrace: {
      ...baseAlerts[1].reasonTrace,

      ruleName: 'RULE_HIGH_RAIN_PROBABILITY',

      summary: 'Rain probability has crossed the 60% alert threshold.',

      explanation:
        `The daily forecast reports a ${today.rain_prob_pct}% probability ` +
        `of rain for ${forecast.location.name}.`,

      recommendation:
        'Carry rain protection, avoid waterlogged roads and low-lying areas, and allow extra travel time if conditions worsen.',

      confidencePct: 88,

      steps: [
        {
          factor: 'Rain Probability',
          observedValue: `${today.rain_prob_pct}%`,
          threshold: '>= 60%',
          contribution: 'primary',
        },
        {
          factor: 'Forecast Condition',
          observedValue: today.condition || 'Condition unavailable',
          threshold: 'Rain-prone conditions',
          contribution: 'context',
        },
      ],
    },
  };

  const alerts: Alert[] = [];

  if (shouldShowHeatAlert) {
    alerts.push(dynamicHeatAlert);
  }

  if (shouldShowRainAlert) {
    alerts.push(dynamicStormAlert);
  }

  return alerts;
}

/**
 * GET /api/alerts
 * Returns active explainable alerts based on current forecast data.
 */
alertsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const alerts = await buildDynamicAlerts(req);

    return res.json({
      alerts,
      count: alerts.length,
      meta: {
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to generate alerts:', error);

    return res.status(500).json({
      error: 'Failed to generate weather alerts',
    });
  }
});

/**
 * GET /api/alerts/:id
 * Returns one dynamically generated alert with its complete reason trace.
 */
alertsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const alerts = await buildDynamicAlerts(req);

    const alert = alerts.find((item) => item.id === req.params.id);

    if (!alert) {
      return res.status(404).json({
        error: `Alert with id '${req.params.id}' is not currently active`,
      });
    }

    return res.json(alert);
  } catch (error) {
    console.error('Failed to generate alert detail:', error);

    return res.status(500).json({
      error: 'Failed to generate weather alert',
    });
  }
});