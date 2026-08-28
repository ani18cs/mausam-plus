import { Router, Request, Response } from 'express';
import { Alert } from '@mausam/shared-types';

export const alertsRouter = Router();

// Explainable Severe Weather Alerts Store
const activeAlerts: Alert[] = [
  {
    id: 'alert-heat-01',
    title: 'Severe Heat-Stress & Thermal Exhaustion Alert',
    severity: 'warning',
    category: 'heat',
    headline: 'High physiological thermal strain predicted between 12:00 PM and 4:30 PM.',
    message:
      'A combination of 33.5°C dry-bulb temperature, 78% relative humidity, and 8.2 UV Index elevates the composite Heat-Stress Index to 76 (Orange Band). Sweating efficiency is severely curtailed.',
    issuedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    affectedRegion: 'Bengaluru Urban & Semi-Arid Plains',
    reasonTrace: {
      ruleName: 'RULE_WBGT_THERMAL_STRAIN_L3',
      summary: 'Composite Apparent Temperature exceeds safety envelope for continuous outdoor exertion.',
      explanation:
        'When relative humidity exceeds 70% at temperatures above 32°C, evaporative skin cooling drops by > 65%. Direct solar radiation (UV 8.2) adds radiant thermal load directly to dermal tissue.',
      recommendation:
        '1. Limit continuous outdoor physical labor to 20-minute intervals.\n2. Hydrate with electrolyte-supplemented water (minimum 600ml/hr).\n3. Wear broad-brimmed hats and lightweight, light-colored breathable cotton.',
      confidencePct: 94,
      steps: [
        {
          factor: 'Ambient Temperature',
          observedValue: '33.5 °C',
          threshold: '> 32.0 °C',
          contribution: 'primary',
        },
        {
          factor: 'Relative Humidity',
          observedValue: '78 %',
          threshold: '> 70 %',
          contribution: 'primary',
        },
        {
          factor: 'Solar UV Index',
          observedValue: '8.2 (Very High)',
          threshold: '> 7.0',
          contribution: 'aggravating',
        },
        {
          factor: 'Surface Wind Speed',
          observedValue: '6.4 km/h (Low)',
          threshold: '< 12 km/h',
          contribution: 'aggravating',
        },
      ],
    },
  },
  {
    id: 'alert-rain-02',
    title: 'Localized Intense Thunderstorm & Waterlogging Warning',
    severity: 'caution',
    category: 'storm',
    headline: 'Convective cloud cells forming to the West; 20-35mm rainfall expected in 45 mins.',
    message:
      'Doppler radar reflectivity indicates active convective cells with cloud tops reaching 11 km. Low-lying arterial roads risk flash waterlogging.',
    issuedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    affectedRegion: 'South & East Bengaluru Corridors',
    reasonTrace: {
      ruleName: 'RULE_RADAR_CONVECTIVE_CELL_BURST',
      summary: 'Doppler radar dBZ reflectivity > 45 dBZ indicates rapid storm intensification.',
      explanation:
        'Moisture convergence from the Bay of Bengal combined with daytime boundary-layer heating triggered rapid vertical convection over urban thermal heat islands.',
      recommendation:
        'Avoid low-lying underpasses (Sony World, Leela Palace, Bellandur junctions). Expect 20-40 minute traffic delays during evening peak commute.',
      confidencePct: 88,
      steps: [
        {
          factor: 'Radar Reflectivity (Z)',
          observedValue: '48.2 dBZ',
          threshold: '> 40.0 dBZ',
          contribution: 'primary',
        },
        {
          factor: 'Convective Available Potential Energy (CAPE)',
          observedValue: '1850 J/kg',
          threshold: '> 1500 J/kg',
          contribution: 'primary',
        },
        {
          factor: 'Urban Drainage Infiltration Rate',
          observedValue: '12 mm/hr capacity',
          threshold: '< 30 mm/hr burst',
          contribution: 'context',
        },
      ],
    },
  },
];

/**
 * GET /api/alerts
 * Returns all active explainable severe weather alerts
 */
alertsRouter.get('/', (_req: Request, res: Response) => {
  return res.json({
    alerts: activeAlerts,
    count: activeAlerts.length,
    meta: {
      generated_at: new Date().toISOString(),
    },
  });
});

/**
 * GET /api/alerts/:id
 * Returns single alert with complete reason trace
 */
alertsRouter.get('/:id', (req: Request, res: Response) => {
  const alert = activeAlerts.find((a) => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: `Alert with id '${req.params.id}' not found` });
  }
  return res.json(alert);
});
