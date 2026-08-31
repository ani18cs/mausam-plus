export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'heatwave' | 'flood_rain' | 'cyclone_marine' | 'air_quality' | 'lightning_storm' | 'city_seasonal' | 'agri_farming';
  source: string;
  content: string;
}

export const KNOWLEDGE_BASE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'imd-heat-01',
    title: 'IMD National Heatwave Action Plan & WBGT Thermal Strain Guidelines',
    category: 'heatwave',
    source: 'India Meteorological Department & NDMA Guidelines',
    content: `Heatwave conditions in India are declared when maximum temperature reaches >=40°C in plains or >=30°C in hills, with deviation >=4.5°C above normal.
Wet-Bulb Globe Temperature (WBGT) and Apparent Temperature dictate physiological strain:
- WBGT < 26°C (Green/Safe): Normal outdoor activities permitted. Hydration rate: 250ml/hr.
- WBGT 26°C - 28°C (Yellow/Caution): Increased fatigue during prolonged outdoor exercise. Hydration rate: 500-600ml/hr.
- WBGT 28°C - 31°C (Orange/Warning): High risk of heat exhaustion and heat cramps. Limit strenuous outdoor work between 11:30 AM and 4:00 PM. Hydrate every 20-30 minutes with ORS, coconut water, or salted butter-milk.
- WBGT > 31°C (Red/Extreme Danger): Imminent risk of heat stroke. All non-essential outdoor work and cardio workouts must be suspended. Emergency cooling protocols required for vulnerable elders and children.`,
  },
  {
    id: 'imd-rain-02',
    title: 'Monsoon Flooding, Urban Inundation & Heavy Rainfall Safety Standard',
    category: 'flood_rain',
    source: 'MoES / IMD Urban Hydrological Advisory',
    content: `IMD Rainfall Intensity Categories:
- Light Rain: 2.5 - 15.5 mm/day
- Moderate Rain: 15.6 - 64.4 mm/day
- Heavy Rain (Yellow/Orange Alert): 64.5 - 115.5 mm/day
- Very Heavy Rain (Orange/Red Alert): 115.6 - 204.4 mm/day
- Extremely Heavy Rain (Red Alert): >= 204.5 mm/day

Urban Waterlogging & Transit Safety:
1. When rainfall probability exceeds 65% with localized downpours, avoid underpasses, low-lying arterial roads, and basement parkings.
2. Vehicle safety: Do not attempt to drive through moving water deeper than 6 inches (15 cm) as steering control is lost; 12 inches (30 cm) of water can float most passenger cars.
3. Electrical safety: Stay clear of downed electric poles, open feeder pillars, and submerged transformers. Report sparking to municipal helpline.`,
  },
  {
    id: 'imd-cyclone-03',
    title: 'RSMC New Delhi Tropical Cyclone Standard Operating Procedures & Port Signals',
    category: 'cyclone_marine',
    source: 'RSMC New Delhi / IMD Cyclone Warning Division',
    content: `Cyclonic Disturbance Classification:
- Low Pressure Area: Wind speed < 31 km/h (17 knots)
- Depression: Wind speed 31-49 km/h (17-27 knots)
- Deep Depression: Wind speed 50-61 km/h (28-33 knots)
- Cyclonic Storm: Wind speed 62-88 km/h (34-47 knots)
- Severe Cyclonic Storm: Wind speed 89-117 km/h (48-63 knots)
- Very Severe Cyclonic Storm: Wind speed 118-165 km/h (64-89 knots)
- Extremely Severe Cyclonic Storm: Wind speed 166-220 km/h (90-119 knots)
- Super Cyclonic Storm: Wind speed >= 221 km/h (>= 120 knots)

Fishermen & Coastal Advisories:
- Fishermen must suspend all deep sea fishing operations when squally winds exceed 45 km/h within 75 nautical miles.
- Port Signal 1 & 2: Cautionary / Squally weather offshore.
- Port Signal 3 & 4: Local cautionary / Port threatened by squalls.
- Port Signal 5, 6, 7: Danger signals / Cyclone expected to cross near port.
- Port Signal 8, 9, 10: Great Danger signals / Severe storm expected to cross directly over port.`,
  },
  {
    id: 'imd-aqi-04',
    title: 'CPCB / MoES Air Quality Index & Health Protection Protocols',
    category: 'air_quality',
    source: 'Central Pollution Control Board (CPCB) & SAFAR India',
    content: `National Air Quality Index (AQI) Health Bands:
- 0-50 (Good): Minimal impact.
- 51-100 (Satisfactory): Minor breathing discomfort to sensitive people.
- 101-200 (Moderate): Breathing discomfort to people with asthma, heart disease, and children.
- 201-300 (Poor): Breathing discomfort to most people on prolonged exposure.
- 301-400 (Very Poor): Respiratory illness on prolonged exposure.
- 401-500 (Severe): Affects healthy people and seriously impacts those with existing diseases.

Protective Actions:
1. When AQI exceeds 150 (PM2.5 > 60 µg/m³), outdoor cardiovascular workouts (running, cycling) should be shifted to early morning or indoor facilities with HEPA filtration.
2. Sensitive individuals, asthmatics, and children must wear certified N95 / FFP2 respirators during transit along heavy traffic corridors.
3. Keep windows and air dampers closed during nocturnal thermal inversion hours (8:00 PM - 8:00 AM).`,
  },
  {
    id: 'imd-lightning-05',
    title: 'Damini Lightning Nowcast & Severe Thunderstorm Safety Protocol',
    category: 'lightning_storm',
    source: 'IITM Pune / IMD Damini Lightning System',
    content: `Lightning safety rules (National Disaster Management Authority):
- 30/30 Rule: If the time between seeing lightning and hearing thunder is less than 30 seconds, the storm is within 10 km. Immediately seek substantial enclosed shelter. Stay inside for 30 minutes after the last thunderclap.
- Open Areas: Never shelter under isolated trees, metal sheds, or open bus stops.
- If caught in open terrain with no shelter: Crouch down low on the balls of your feet with hands over ears and head between knees (minimize ground contact footprint). Never lie flat on the ground.
- Indoors: Avoid using corded electronics, plumbing fixtures, and stay away from balconies and metal window frames during active nowcast warnings.`,
  },
  {
    id: 'city-bengaluru-06',
    title: 'Bengaluru Seasonal Microclimate & Monsoon Inundation Patterns',
    category: 'city_seasonal',
    source: 'IMD Bengaluru Met Centre',
    content: `Bengaluru (Elevation ~920m) Meteorological Characteristics:
- Southwest Monsoon (June - September): Frequent evening convective thunderstorms and steady light-to-moderate showers. Key waterlogging corridors include Silk Board Junction, Outer Ring Road (Bellandur-Marathahalli), Hebbal underpass, and Electronic City flyover approaches.
- Pre-monsoon (April - May): Sudden high-velocity squalls (40-60 km/h) with localized hailstorms and tree falls.
- Thermal Comfort: Generally temperate, but April heat spikes can push WBGT into caution bands during midday (12:00 PM - 3:30 PM).`,
  },
  {
    id: 'city-mumbai-07',
    title: 'Mumbai Coastal Meteorology, Tides & High Rainfall Convergence',
    category: 'city_seasonal',
    source: 'IMD Regional Meteorological Centre Mumbai',
    content: `Mumbai Weather Dynamics:
- High Tide + Heavy Rainfall Risk: If rainfall exceeding 50 mm/day coincides with spring high tides exceeding 4.5 meters, sluice gates cannot discharge storm runoff into the Arabian Sea, causing rapid urban flooding across Hindmata, Milan Subway, Kurla, and King's Circle.
- Coastal Wave Swells: Southwest monsoon generates heavy wave action (2.5m - 4.5m) along Marine Drive, Bandra Bandstand, and Juhu. Beach access is restricted during active high-swell advisories.`,
  },
  {
    id: 'city-delhi-08',
    title: 'Delhi NCR Extremes: Winter Fog Inversion & Summer Loo Heatwaves',
    category: 'city_seasonal',
    source: 'IMD Regional Meteorological Centre New Delhi',
    content: `Delhi NCR Extremes:
- Summer (May - June): Intense "Loo" winds (hot, dry westerly winds with temperatures reaching 44-48°C). Extreme dehydration risk; apparent temperature can exceed 50°C.
- Winter & Post-Monsoon (November - January): Dense radiation fog and severe planetary boundary layer inversion. Visibility frequently drops below 50m at IGI Airport. AQI routinely surges into 'Very Poor' and 'Severe' categories due to calm surface winds (< 5 km/h).`,
  },
  {
    id: 'agri-kisan-09',
    title: 'Kisan Agromet Advisories & Farm Field Management Guidelines',
    category: 'agri_farming',
    source: 'Gramin Krishi Mausam Seva (GKMS) / IMD Agromet Division',
    content: `Agromet Advisory Operational Rules:
- Pesticide & Fertilizer Spraying: Do not spray chemical fertilizers or pesticides if rainfall probability > 50% within next 24 hours, or if surface wind speed exceeds 15 km/h (causes spray drift).
- Sowing & Transplanting: Kharif paddy transplanting requires standing water of 2-5 cm; ensure field bunds are repaired before forecasted heavy spells.
- Irrigation Scheduling: Postpone scheduled canal or tubewell irrigation if rainfall forecast exceeds 25 mm over the next 48 hours.`,
  },
];
