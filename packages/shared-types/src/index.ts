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
  wind_dir_deg?: number;
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
  apparent_temp_c?: number;
  wet_bulb_temp_c?: number;
  wbgt_c?: number;
  discomfort_index?: number;
  evaporative_cooling_efficiency_pct?: number;
  hydration_loss_ml_per_hr?: number;
}

export interface ForecastDiff {
  temp_diff_c: number; // e.g. +3.2 (today vs yesterday)
  humidity_diff_pct: number; // e.g. +14
  rain_risk_changed: boolean;
  summary: string;
  trend: 'warmer' | 'cooler' | 'wetter' | 'drier' | 'stable';
  yesterday_temp_c: number;
  yesterday_condition: string;
}

export interface AirQualityPollutants {
  us_aqi: number;
  european_aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  primary_pollutant: string;
  health_category: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  health_implication?: string;
}

export interface ForecastExtras {
  tide?: TideExtras;
  heat_stress_index: HeatStressIndex;
  forecast_diff?: ForecastDiff;
  air_quality?: AirQualityPollutants;
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

export interface BiometeorologyData {
  wbgt: {
    value: number;
    unit: '°C';
    category: string;
    flagColor: string;
  };
  evapotranspiration: {
    et0: number;
    soilMoistureScore: number;
  };
  marineSwell: {
    swellHeight: number;
    hazardLevel: string;
  };
  explainabilityTrace: {
    inputs: {
      temp: number;
      humidity: number;
      windSpeed: number;
      radiation: number;
    };
    formulaUsed: string;
    standardCitation: 'MoES/NDMA Heatwave SOP & INCOIS Ocean Protocol';
  };
}

export interface NormalizedForecast {
  location: LocationInfo;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  extras: ForecastExtras;
  meta: ForecastMeta;
  biometeorology: BiometeorologyData;
}

// ==========================================
// 2. Geocoding Search Contract
// ==========================================

export interface GeocodingLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  admin1?: string; // State / Province
  country: string;
  country_code: string;
}

// ==========================================
// 3. Persona Definitions & Ranking
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
// 4. Explainable Alert System
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
// 5. Citizen Weather Reports
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
// 6. Card Component Manifest & Registry
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
// 7. Conversational AI Query Contract
// ==========================================

export interface AIQueryRequest {
  query: string;
  location: { lat: number; lon: number; name: string };
  selectedPersonas?: PersonaId[];
  forecastContext?: Partial<NormalizedForecast>;
}

export interface AIAuditChunk {
  id: string;
  title: string;
  source: string;
  snippet: string;
  score?: number;
}

export interface AIAuditToolExecution {
  toolName: string;
  params: Record<string, any>;
  resultSummary: string;
}

export interface AIAuditTrail {
  query: string;
  language: SupportedLanguage;
  structuredToolsExecuted: AIAuditToolExecution[];
  retrievedChunks: AIAuditChunk[];
  generatedAt: string;
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
  auditTrail?: AIAuditTrail;
}

// ==========================================
// 8. User Settings, Profile & Personalization
// ==========================================

export type SupportedLanguage = 'en' | 'hi' | 'kn';
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kph' | 'mph' | 'mps' | 'knots';

export type AllergyType =
  | 'pollen'
  | 'dust_aqi'
  | 'asthma'
  | 'heat_sensitive'
  | 'migraine'
  | 'cold_joint_pain'
  | 'eye_irritation'
  | 'elder_infant_care';


export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  allergies: AllergyType[];
  isLoggedIn: boolean;
  city?: string;
}

export interface UserPreferences {
  selectedPersonas: PersonaId[];
  cardOrder: string[];
  hiddenCardIds: string[];
  language: SupportedLanguage;
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
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

// ==========================================
// 9. Weather & Climate News Contracts
// ==========================================

export type NewsCategory =
  | 'imd_advisory'
  | 'monsoon'
  | 'heatwave'
  | 'aqi'
  | 'cyclone'
  | 'climate_science';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author?: string;
  publishedAt: string;
  readTimeMinutes: number;
  category: NewsCategory;
  imageUrl?: string;
  relatedLocation?: string;
  verifiedIMD?: boolean;
}

// ==========================================
// 10. IMD Mausam Meteorological Contracts
// ==========================================
export * from './imd';
export * from './i18n';

