import { Router, Request, Response } from 'express';
import { fetchOpenMeteoForecast, getMockForecast } from '../services/openMeteo';

export const forecastRouter = Router();

// In-memory cache map to respect rate limits and reduce latency
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * GET /api/forecast?lat=12.9716&lon=77.5946&name=Bengaluru
 * Returns normalized forecast object
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
    // Graceful fallback to mock forecast
    const fallback = getMockForecast(12.9716, 77.5946, 'Bengaluru, Karnataka');
    return res.json(fallback);
  }
});
