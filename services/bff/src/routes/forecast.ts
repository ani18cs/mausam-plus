import { Router, Request, Response } from 'express';
import { fetchOpenMeteoForecast, getMockForecast } from '../services/openMeteo';
import { searchLocations } from '../services/geocoding';

export const forecastRouter = Router();

// In-memory cache map to respect rate limits and reduce latency
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 8 * 60 * 1000; // 8 minutes

/**
 * GET /api/forecast/search?q=Mumbai
 * Multi-location geocoding search for Indian & global cities
 */
forecastRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    const results = await searchLocations(query);
    return res.json({
      query,
      count: results.length,
      results,
    });
  } catch (err: any) {
    console.error('[Geocoding Route Error]', err);
    return res.status(500).json({ error: 'Geocoding search failed', details: err?.message });
  }
});

/**
 * GET /api/forecast/diff?lat=12.9716&lon=77.5946
 * Direct access to the "What Changed?" forecast delta comparison
 */
forecastRouter.get('/diff', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 12.9716;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : 77.5946;
    const name = (req.query.name as string) || 'Bengaluru, Karnataka';

    const forecast = await fetchOpenMeteoForecast(lat, lon, name);
    return res.json({
      location: forecast.location,
      forecast_diff: forecast.extras.forecast_diff,
      fetched_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Forecast Diff Error]', err);
    return res.status(500).json({ error: 'Forecast diff calculation failed' });
  }
});

/**
 * GET /api/forecast?lat=12.9716&lon=77.5946&name=Bengaluru
 * Returns normalized forecast object with live weather, AQI, Heat-Stress, and Diff
 */
forecastRouter.get('/', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 12.9716; // Default to Bengaluru
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : 77.5946;
    const name = (req.query.name as string) || (lat === 12.9716 ? 'Bengaluru, Karnataka' : `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`);

    const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
    const cachedEntry = cache.get(cacheKey);

    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
      return res.json({
        ...cachedEntry.data,
        meta: {
          ...cachedEntry.data.meta,
          cached: true,
        },
      });
    }

    const forecast = await fetchOpenMeteoForecast(lat, lon, name);
    cache.set(cacheKey, { data: forecast, timestamp: Date.now() });

    return res.json(forecast);
  } catch (err: any) {
    console.error('[Forecast Route Error]', err);
    const fallback = getMockForecast(12.9716, 77.5946, 'Bengaluru, Karnataka');
    return res.json(fallback);
  }
});
