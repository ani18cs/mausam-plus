/**
 * @mausam/shared-types
 * Canonical data contracts and interfaces shared between Backend (BFF) and Frontend (Mobile PWA).
 */

// ==========================================
// 1. Normalized Weather Forecast Contract
// ==========================================

export interface LocationInfo {
  name: string;
  lat: number;
  lon: number;
  region?: string;
  country?: string;
}

export interface CurrentWeather {
  temp_c: number;
  feels_like_c: number;
  humidity_pct: number;
  wind_kph: number;
  uv_index: number;
  aqi: number;
  condition: string;
  icon?: string;
  is_day?: boolean;
}

export interface HourlyForecastItem {
  time: string;
  temp_c: number;
  rain_prob_pct: number;
  aqi: number;
  uv_index: number;
  condition?: string;
}

export interface DailyForecastItem {
  date: string;
  temp_min_c: number;
  temp_max_c: number;
  rain_prob_pct: number;
  sunrise: string;
  sunset: string;
  condition?: string;
}

export type HeatStressBand = 'green' | 'yellow' | 'orange' | 'red';

export interface TideExtras {
  next_high: string;
  next_low: string;
  wave_height_m: number;
  water_temp_c?: number;
  surf_quality?: 'Poor' | 'Fair' | 'Good' | 'Excellent';
}

export interface HeatStressIndex {
  score: number; // 0 - 100 composite index
  band: HeatStressBand;
  label?: string; // 'Safe' | 'Caution' | 'High Risk' | 'Extreme Danger'
  summary?: string;
}

export interface ForecastExtras {
  tide?: TideExtras;
  heat_stress_index: HeatStressIndex;
  running_window?: {
    score: number; // 0 - 100 suitability score
    optimal_time_slot: string; // e.g. "06:00 AM - 07:30 AM"
    reason: string;
  };
  aqi_breakdown?: {
    pm25: number;
    pm10: number;
    no2: number;
    o3: number;
    primary_pollutant: string;
  };
}

export interface ForecastMeta {
  sources: string[];
  fetched_at: string;
  cached?: boolean;
}

export interface NormalizedForecast {
  location: LocationInfo;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  extras: ForecastExtras;
  meta: ForecastMeta;
}

// ==========================================
// 2. Persona Definitions & Ranking
// ==========================================

export type PersonaId =
  | 'health'
  | 'fitness'
  | 'beach'
  | 'traveler'
  | 'family'
  | 'agri'
  | 'commuter'
  | 'events';

export interface PersonaDefinition {
  id: PersonaId;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  colorAccent: string;
  defaultCardIds: string[];
}

// ==========================================
// 3. Explainable Alert System
// ==========================================

export type AlertSeverity = 'info' | 'caution' | 'warning' | 'severe';

export interface AlertReasonTraceStep {
  factor: string; // e.g., "Relative Humidity"
  observedValue: string; // e.g., "89%"
  threshold: string; // e.g., "> 80%"
  contribution: 'primary' | 'aggravating' | 'context';
}

export interface AlertReasonTrace {
  ruleName: string;
  summary: string;
  explanation: string;
  recommendation: string;
  steps: AlertReasonTraceStep[];
  confidencePct: number;
}

export interface Alert {
  id: string;
  title: string;
  severity: AlertSeverity;
  category: 'heat' | 'rain' | 'storm' | 'aqi' | 'wind' | 'fog' | 'coastal';
  headline: string;
  message: string;
  issuedAt: string;
  expiresAt: string;
  reasonTrace: AlertReasonTrace;
  affectedRegion: string;
}

// ==========================================
// 4. Citizen Weather Reports
// ==========================================

export type CitizenReportCategory =
  | 'waterlogging'
  | 'severe_heat'
  | 'high_wind'
  | 'hail'
  | 'air_pollution'
  | 'dense_fog'
  | 'fallen_tree';

export interface CitizenReport {
  id: string;
  category: CitizenReportCategory;
  title: string;
  description?: string;
  lat: number;
  lon: number;
  locationName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  upvotes: number;
  timestamp: string;
  photoUrl?: string;
  verified: boolean;
}

// ==========================================
// 5. Card Component Manifest & Registry
// ==========================================

export type CardCategory =
  | 'health_aqi'
  | 'outdoor_fitness'
  | 'beach_marine'
  | 'thermal_stress'
  | 'commute_radar'
  | 'agri_farming'
  | 'travel_packing'
  | 'event_planning';

export interface CardDefinition {
  id: string;
  title: string;
  category: CardCategory;
  iconName: string;
  relevantPersonas: PersonaId[];
  defaultRank: number; // Lower rank = higher position in feed
  description: string;
}

export interface CardProps {
  forecast: NormalizedForecast;
  onOpenWhyModal?: (cardId: string) => void;
  className?: string;
}

// ==========================================
// 6. Conversational AI Query Contract
// ==========================================

export interface AIQueryRequest {
  query: string;
  location: { lat: number; lon: number; name: string };
  selectedPersonas?: PersonaId[];
  forecastContext?: Partial<NormalizedForecast>;
}

export interface AIQueryResponse {
  answer: string;
  confidence: number;
  insights: Array<{
    type: 'favorable' | 'caution' | 'critical';
    label: string;
    text: string;
  }>;
  suggestedFollowUps: string[];
  suggestedCardId?: string;
  generatedAt: string;
}

// ==========================================
// 7. User Settings & Preferences
// ==========================================

export interface UserPreferences {
  selectedPersonas: PersonaId[];
  cardOrder: string[];
  hiddenCardIds: string[];
  language: 'en' | 'hi' | 'ta' | 'bn' | 'mr';
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kph' | 'mph';
  theme: 'light' | 'dark' | 'system';
}

export interface SavedPlace {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  isCurrentLocation?: boolean;
}
