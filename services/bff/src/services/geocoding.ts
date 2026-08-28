import { GeocodingLocation } from '@mausam/shared-types';

// Fallback top Indian cities in case of network issues
const DEFAULT_INDIAN_CITIES: GeocodingLocation[] = [
  { id: 1277333, name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, admin1: 'Karnataka', country: 'India', country_code: 'IN' },
  { id: 1275339, name: 'Mumbai', latitude: 18.944, longitude: 72.823, admin1: 'Maharashtra', country: 'India', country_code: 'IN' },
  { id: 1273294, name: 'New Delhi', latitude: 28.6139, longitude: 77.209, admin1: 'Delhi', country: 'India', country_code: 'IN' },
  { id: 1264527, name: 'Chennai', latitude: 13.0827, longitude: 80.2707, admin1: 'Tamil Nadu', country: 'India', country_code: 'IN' },
  { id: 1275004, name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, admin1: 'West Bengal', country: 'India', country_code: 'IN' },
  { id: 1269843, name: 'Hyderabad', latitude: 17.385, longitude: 78.4867, admin1: 'Telangana', country: 'India', country_code: 'IN' },
  { id: 1270583, name: 'Goa (Panaji)', latitude: 15.4909, longitude: 73.8278, admin1: 'Goa', country: 'India', country_code: 'IN' },
  { id: 1259229, name: 'Pune', latitude: 18.5204, longitude: 73.8567, admin1: 'Maharashtra', country: 'India', country_code: 'IN' },
  { id: 1271715, name: 'Jaipur', latitude: 26.9124, longitude: 75.7873, admin1: 'Rajasthan', country: 'India', country_code: 'IN' },
  { id: 1271252, name: 'Kochi', latitude: 9.9312, longitude: 76.2673, admin1: 'Kerala', country: 'India', country_code: 'IN' },
];

/**
 * Searches for global and Indian locations with high-resolution coordinates using Open-Meteo Geocoding API
 */
export async function searchLocations(query: string): Promise<GeocodingLocation[]> {
  const q = query.trim();
  if (!q) return DEFAULT_INDIAN_CITIES.slice(0, 5);

  try {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('name', q);
    url.searchParams.set('count', '8');
    url.searchParams.set('language', 'en');
    url.searchParams.set('format', 'json');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Geocoding search failed with HTTP status ${res.status}`);
    }

    const data = (await res.json()) as any;
    if (!data.results || data.results.length === 0) {
      // Local filter fallback
      return DEFAULT_INDIAN_CITIES.filter(
        (c) =>
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          (c.admin1 && c.admin1.toLowerCase().includes(q.toLowerCase()))
      );
    }

    return data.results.map((r: any) => ({
      id: r.id,
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      elevation: r.elevation,
      admin1: r.admin1,
      country: r.country,
      country_code: r.country_code,
    }));
  } catch (error) {
    console.warn(`[Geocoding] Search query '${q}' failed. Falling back to local catalog.`, error);
    return DEFAULT_INDIAN_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        (c.admin1 && c.admin1.toLowerCase().includes(q.toLowerCase()))
    );
  }
}
