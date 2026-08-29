import { NewsArticle } from '@mausam/shared-types';

export const WEATHER_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'IMD Issues Yellow Alert: Southwest Monsoon Intensifies Over Coastal Karnataka & Western Ghats',
    summary: 'Heavy to very heavy rainfall expected across coastal belts with wind gusts reaching 55 km/h. Fishermen advised not to venture into deep sea.',
    content: `The India Meteorological Department (IMD) has issued a comprehensive advisory as the monsoon trough shifts southwards. An offshore trough extending from the Maharashtra coast to the Kerala coast is actively pumping tropical moisture into the Western Ghats.

Key Highlights:
1. Rainfall Expectation: Widespread 70-110 mm daily rainfall across Mangaluru, Udupi, and surrounding Ghat areas.
2. Urban Advisory: Local authorities in Bengaluru and Coastal Karnataka have deployed emergency dewatering teams in low-lying pockets.
3. Marine Caution: Sea surface swell elevated up to 2.8m. Small craft advisory remains active for the next 48 hours.

Stay tuned to real-time Doppler radar updates in Mausam+ for localized convective cloud tracking.`,
    source: 'IMD National Weather Bulletin',
    author: 'Senior Meteorologist Dr. R. S. Sharma',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
    readTimeMinutes: 3,
    category: 'monsoon',
    verifiedIMD: true,
    relatedLocation: 'Bengaluru & Coastal Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-2',
    title: 'Heat Dome & High Humidity: Explaining the Elevated Thermal Strain Index in Northern Plains',
    summary: 'A combination of 36°C dry bulb temperatures and 72% relative humidity is driving wet-bulb temperatures into the danger zone.',
    content: `Meteorological stations in Delhi NCR, Lucknow, and Jaipur report persistent high humidity combined with radiant solar insolence, creating a classic "muggy heat dome".

Why Humidity Multiplies Heat Stress:
- Normal human perspiration relies on atmospheric vapor pressure differentials to evaporate and cool the epidermis.
- When relative humidity exceeds 65% at 34°C, evaporative cooling efficiency drops below 30%, triggering elevated biometeorological stress.

Medical Recommendations:
- Avoid intense cardiovascular outdoor running between 11:30 AM and 4:30 PM.
- Consume ORS or electrolyte-enriched water every 30-45 minutes.`,
    source: 'Centre for Atmospheric Sciences',
    author: 'Dr. Ananya Sen',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3h ago
    readTimeMinutes: 4,
    category: 'heatwave',
    verifiedIMD: true,
    relatedLocation: 'Northern Plains & Delhi NCR',
    imageUrl: 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-3',
    title: 'Seasonal Pollen & Particulate Spike: What Sensitive Groups Need to Know This Week',
    summary: 'Elevated anemophilous pollen counts combined with nocturnal inversion layers are causing sudden respiratory discomfort in urban metros.',
    content: `Bio-aerosol monitoring in urban centers has detected an early surge in grass and weed pollen grains, coinciding with moderate PM2.5 particulate entrapment.

Protective Measures for Asthma & Allergy Sufferers:
1. Peak Pollen Windows: Pollen dispersion is highest between 6:00 AM and 10:00 AM. Schedule outdoor jogging in late evenings when ambient pollen settles.
2. Barrier Protection: Wear an N95 or well-fitted mask during transit near unpaved roads and urban parks.
3. Air Purification: Use HEPA filtration indoors during morning peak circulation hours.`,
    source: 'National Aerobiology Council',
    author: 'Dr. K. Ramanathan',
    publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6h ago
    readTimeMinutes: 2,
    category: 'aqi',
    verifiedIMD: false,
    relatedLocation: 'Urban Metros',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-4',
    title: 'Arabian Sea Cyclone Watch: Depression Monitored Near Lakshadweep Coast',
    summary: 'Low-pressure system over southeast Arabian Sea likely to intensify into a deep depression over the next 36 hours.',
    content: `Satellite imagery from INSAT-3DR indicates deep convective clouds banding together approximately 380 km southwest of Lakshadweep islands.

Current Trajectory:
- Movement: West-northwestwards away from the Indian mainland.
- Wind Speeds: Squally winds reaching 45-55 km/h gusting to 65 km/h over the open sea.
- IMD Action: Coastal radar stations at Thiruvananthapuram and Goa are tracking wind shear and sea surface temperature anomalies.`,
    source: 'IMD Cyclone Warning Division',
    author: 'Disaster Management Cell',
    publishedAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12h ago
    readTimeMinutes: 3,
    category: 'cyclone',
    verifiedIMD: true,
    relatedLocation: 'Arabian Sea & Lakshadweep',
    imageUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop&q=80',
  },
];
