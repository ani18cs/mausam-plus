import { Router, Request, Response } from 'express';
import { fetchOpenMeteoForecast } from '../services/openMeteo';
import { searchLocations } from '../services/geocoding';
import { cacheService } from '../services/cache';

export const forecastRouter = Router();

const FORECAST_CACHE_TTL_SEC = 12 * 60; // 12 minutes TTL

/**
 * GET /api/forecast/search?q=Mumbai
 * Multi-location geocoding search for Indian & global cities
 */
forecastRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const query = ((req.query.q as string) || '').trim();
    if (!query) {
      return res.json({ query: '', count: 0, results: [] });
    }

    const cacheKey = `geo:${query.toLowerCase()}`;
    const cached = await cacheService.get<any[]>(cacheKey);
    if (cached) {
      return res.json({ query, count: cached.length, results: cached, cached: true });
    }

    const results = await searchLocations(query);
    await cacheService.set(cacheKey, results, 3600); // 1 hour for geocoding

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

    const cacheKey = `forecast:${lat.toFixed(3)}_${lon.toFixed(3)}`;
    let forecast = await cacheService.get<any>(cacheKey);

    if (!forecast) {
      forecast = await fetchOpenMeteoForecast(lat, lon, name);
      await cacheService.set(cacheKey, forecast, FORECAST_CACHE_TTL_SEC);
    }

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
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 12.9716;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : 77.5946;
    const name = (req.query.name as string) || (lat === 12.9716 ? 'Bengaluru, Karnataka' : `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`);

    const cacheKey = `forecast:${lat.toFixed(3)}_${lon.toFixed(3)}`;
    const cachedEntry = await cacheService.get<any>(cacheKey);

    if (cachedEntry) {
      return res.json({
        ...cachedEntry,
        meta: {
          ...cachedEntry.meta,
          cached: true,
        },
      });
    }

    const forecast = await fetchOpenMeteoForecast(lat, lon, name);
    await cacheService.set(cacheKey, forecast, FORECAST_CACHE_TTL_SEC);

    return res.json(forecast);
  } catch (err: any) {
    console.error('[Forecast Route Error]', err);
    return res.status(502).json({
      error: 'Upstream meteorological data service currently unavailable',
      details: err?.message,
    });
  }
});
