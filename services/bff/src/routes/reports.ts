import { Router, Request, Response } from 'express';
import { CitizenReport } from '@mausam/shared-types';

export const reportsRouter = Router();

// In-memory initial citizen report store
// // TODO: replace with real database persistence (Supabase / Postgres) — see docs/ARCHITECTURE.md
let citizenReports: CitizenReport[] = [
  {
    id: 'rep-001',
    category: 'waterlogging',
    title: 'Severe Waterlogging (1.5 ft depth)',
    description: 'Underpass flooded near Sony World Junction, slow vehicle movement. Two-wheelers advised to divert.',
    lat: 12.9344,
    lon: 77.6288,
    locationName: 'Koramangala 100ft Road, Bengaluru',
    severity: 'high',
    upvotes: 42,
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    verified: true,
  },
  {
    id: 'rep-002',
    category: 'severe_heat',
    title: 'High Surface Heat & Asphalt Softening',
    description: 'Direct sun exposure with no shade along open highway stretch. Surface temp feels > 44°C.',
    lat: 12.9784,
    lon: 77.6408,
    locationName: 'Indiranagar 100ft Rd, Bengaluru',
    severity: 'medium',
    upvotes: 18,
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    verified: true,
  },
  {
    id: 'rep-003',
    category: 'air_pollution',
    title: 'Dense Construction Dust & Smoke',
    description: 'Heavy particulate cloud from metro construction site causing eye irritation.',
    lat: 12.9915,
    lon: 77.5854,
    locationName: 'Hebbal Flyover, Bengaluru',
    severity: 'high',
    upvotes: 27,
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    verified: false,
  },
  {
    id: 'rep-004',
    category: 'fallen_tree',
    title: 'Tree Branch Blocking Left Lane',
    description: 'Wind gust snapped large gulmohar branch during 3 PM squall.',
    lat: 12.9250,
    lon: 77.5938,
    locationName: 'Jayanagar 4th Block, Bengaluru',
    severity: 'medium',
    upvotes: 31,
    timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    verified: true,
  },
];

/**
 * GET /api/reports
 * Returns all active citizen weather reports
 */
reportsRouter.get('/', (_req: Request, res: Response) => {
  return res.json({
    reports: citizenReports,
    count: citizenReports.length,
    meta: {
      fetched_at: new Date().toISOString(),
    },
  });
});

/**
 * POST /api/reports
 * Submit a new citizen report
 */
reportsRouter.post('/', (req: Request, res: Response) => {
  const { category, title, description, lat, lon, locationName, severity } = req.body;

  if (!category || !title || !lat || !lon) {
    return res.status(400).json({ error: 'Missing mandatory fields (category, title, lat, lon)' });
  }

  const newReport: CitizenReport = {
    id: `rep-${Date.now().toString().slice(-6)}`,
    category,
    title,
    description: description || '',
    lat: Number(lat),
    lon: Number(lon),
    locationName: locationName || 'Pinned Location',
    severity: severity || 'medium',
    upvotes: 1,
    timestamp: new Date().toISOString(),
    verified: false, // Community verification pipeline
  };

  citizenReports.unshift(newReport);

  return res.status(201).json({
    message: 'Citizen report submitted successfully and added to verification queue',
    report: newReport,
  });
});
