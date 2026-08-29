/**
 * IMD Mausam Meteorological Product Contracts
 * Comprehensive types for all services scraped from https://mausam.imd.gov.in
 */

// ==========================================
// 1. IMD Real-Time Ground Station Telemetry
// ==========================================

export interface IMDSunMoonTimes {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
}

export interface IMDStationObservation {
  stationId: string;
  stationName: string;
  stateCode: string;
  stateName: string;
  latitude: number;
  longitude: number;
  currentTempC: number;
  feelsLikeC: number;
  relativeHumidityPct: number;
  windSpeedKph: number;
  windDirection: string;
  weatherMessage: string;
  weatherIconCode: string;
  observationTimeIST: string;
  sunMoon: IMDSunMoonTimes;
  stationType: 'SYNOP' | 'AWS' | 'METAR';
}

// ==========================================
// 2. 0-3 Hour Severe Nowcasts
// ==========================================

export type IMDNowcastCategoryCode =
  | 'cat1'  // No Warning
  | 'cat2'  // Light rain: < 5 mm/hr
  | 'cat3'  // Light snow: < 5 cm/hr
  | 'cat4'  // Light Thunderstorms with surface wind < 40 kmph
  | 'cat5'  // Slight dust storm: wind <= 41 kmph, vis 500-1000m
  | 'cat6'  // Low cloud to ground Lightning probability (< 30%)
  | 'cat7'  // Moderate rain: 5-15 mm/hr
  | 'cat8'  // Moderate snow: 5-15 cm/hr
  | 'cat9'  // Moderate Thunderstorms: wind 41-61 kmph gusts
  | 'cat10' // Moderate dust storm: wind 41-61 kmph, vis 200-500m
  | 'cat11' // Moderate cloud to ground Lightning probability (30-60%)
  | 'cat12' // Heavy rain: > 15 mm/hr
  | 'cat13' // Heavy snow: > 15 cm/hr
  | 'cat14' // Severe Thunderstorms: wind 62-87 kmph gusts
  | 'cat15' // Very Severe Thunderstorms: wind > 87 kmph gusts
  | 'cat16' // Custom special advisory message
  | 'cat17' // Thunderstorms with Hail
  | 'cat18' // Severe dust storm: wind > 61 kmph, vis < 200m
  | 'cat19';// High cloud to ground Lightning probability (> 60%)

export interface IMDNowcastDistrictItem {
  districtName: string;
  stateName: string;
  issueTimeIST: string;
  validUptoIST: string;
  colorHex: string;
  severityLevel: 'no_warning' | 'watch' | 'alert' | 'warning';
  activeHazards: Array<{
    code: IMDNowcastCategoryCode;
    title: string;
    description: string;
  }>;
  customMessage?: string;
}

// ==========================================
// 3. 5-Day District & Subdivision Warning Matrix
// ==========================================

export type IMDWarningColorLevel = 'green' | 'yellow' | 'orange' | 'red';

export interface IMDDayWarning {
  dayIndex: number; // 1 to 5
  dateStr: string; // e.g. "2026-08-29"
  colorLevel: IMDWarningColorLevel;
  colorLabel: 'No Warning' | 'Watch (Be Updated)' | 'Alert (Be Prepared)' | 'Warning (Take Action)';
  hazardTypes: string[]; // e.g. ["Heavy Rain", "Thunderstorms & Lightning", "Heat Wave"]
  warningText: string;
}

export interface IMDDistrictWarningItem {
  districtName: string;
  stateName: string;
  updatedAt: string;
  days: IMDDayWarning[];
}

// ==========================================
// 4. Remote Sensing: Doppler Radar & INSAT-3DS Satellite
// ==========================================

export type IMDRadarProductType =
  | 'MAX_Z'  // Maximum Reflectivity column (dBZ)
  | 'PPI_Z'  // Plan Position Indicator Reflectivity
  | 'SRI'    // Surface Rainfall Intensity (mm/hr)
  | 'PAC'    // Precipitation Accumulation
  | 'PPV'    // Radial Velocity (m/s)
  | 'VVP2';   // Volume Velocity Wind Profile

export interface IMDRadarStation {
  id: string; // e.g. "delhi", "mumbai", "kolkata"
  name: string;
  state: string;
  lat: number;
  lon: number;
  band: 'C-band' | 'S-band' | 'X-band';
  availableProducts: IMDRadarProductType[];
  latestTimestampIST: string;
  productImageUrls: Record<IMDRadarProductType, string>;
  animationGifUrl?: string;
}

export interface IMDSatelliteChannel {
  id: 'ir1' | 'vis' | 'wv' | 'bt' | 'rgb';
  name: string;
  description: string;
  wavelength: string;
  imageUrl: string;
  animationUrl?: string;
  timestampIST: string;
}

export interface IMDRemoteSensingOverview {
  nationalRadarMosaicUrl: string;
  nationalLightningMapUrl: string;
  satelliteChannels: IMDSatelliteChannel[];
  radarStations: IMDRadarStation[];
}

// ==========================================
// 5. RSMC Tropical Cyclone Tracker
// ==========================================

export type IMDCycloneIntensityGrade =
  | 'D'      // Depression (17-27 kt)
  | 'DD'     // Deep Depression (28-33 kt)
  | 'CS'     // Cyclonic Storm (34-47 kt)
  | 'SCS'    // Severe Cyclonic Storm (48-63 kt)
  | 'VSCS'   // Very Severe Cyclonic Storm (64-89 kt)
  | 'ESCS'   // Extremely Severe Cyclonic Storm (90-119 kt)
  | 'SuCS';  // Super Cyclonic Storm (>= 120 kt)

export interface IMDCycloneTrackPoint {
  timeIST: string;
  lat: number;
  lon: number;
  intensity: IMDCycloneIntensityGrade;
  windSpeedKts: number;
  windSpeedKph: number;
  centralPressureHpa: number;
  estimatedStatus: string;
  isForecast: boolean;
  radiiQuadrants?: {
    radius28ktKm?: number;
    radius34ktKm?: number;
    radius50ktKm?: number;
    radius64ktKm?: number;
  };
}

export interface IMDActiveCyclone {
  id: string;
  name: string;
  basin: 'Bay of Bengal' | 'Arabian Sea';
  currentIntensity: IMDCycloneIntensityGrade;
  currentIntensityLabel: string;
  currentLat: number;
  currentLon: number;
  currentWindSpeedKph: number;
  currentPressureHpa: number;
  landfallForecast?: {
    location: string;
    estimatedTimeIST: string;
    expectedWindSpeedKph: number;
    stormSurgeHeightM: number;
  };
  trackHistory: IMDCycloneTrackPoint[];
  forecastTrack: IMDCycloneTrackPoint[];
  coneOfUncertaintyPolygon: Array<[number, number]>;
  bulletinText: string;
  lastUpdatedIST: string;
}

// ==========================================
// 6. Maritime & Fishermen Warnings
// ==========================================

export interface IMDFishermenAreaWarning {
  coastalZone: string; // e.g. "West Bengal & North Bay of Bengal"
  statesCovered: string[];
  warningLevel: 'safe' | 'caution' | 'danger' | 'severe_danger';
  expectedWindSpeedKph: string;
  seaCondition: 'Smooth' | 'Slight' | 'Moderate' | 'Rough' | 'Very Rough' | 'High' | 'Phenomenal';
  fishermenAdvisory: string;
  validUptoIST: string;
}

export interface IMDPortWarningSignal {
  portName: string;
  state: string;
  signalNumber: number; // 1 to 11
  signalName: string; // e.g., "Local Cautionary Signal No. III"
  meaning: string;
  actionRequired: string;
}

// ==========================================
// 7. Hydrology & Flash Flood Guidance System (FFGS)
// ==========================================

export interface IMDFlashFloodBasin {
  basinId: string;
  basinName: string;
  state: string;
  flashFloodRisk: 'low' | 'moderate' | 'high' | 'very_high';
  flashFloodThreatMm: number;
  soilMoistureIndexPct: number;
  validityIST: string;
  catchmentSummary: string;
}

export interface IMDRainfallDepartureDistrict {
  districtName: string;
  stateName: string;
  actualRainMm: number;
  normalRainMm: number;
  departurePct: number;
  category: 'Large Excess' | 'Excess' | 'Normal' | 'Deficient' | 'Large Deficient' | 'No Rain';
  colorHex: string;
}

// ==========================================
// 8. Highway Weather Corridors
// ==========================================

export interface IMDHighwaySegment {
  segmentName: string; // e.g. "Mumbai - Lonavala Ghat"
  mileMarkerRange?: string;
  currentCondition: string;
  visibilityMeters: number;
  rainfallStatus: 'None' | 'Light' | 'Moderate' | 'Heavy';
  hazardWarning?: string; // e.g., "Dense Fog / Landslide Risk"
  speedAdvisoryKph: number;
}

export interface IMDHighwayCorridor {
  highwayId: string; // e.g. "NH-48"
  routeName: string; // e.g. "Delhi - Jaipur - Mumbai"
  originCity: string;
  destinationCity: string;
  totalDistanceKm: number;
  overallStatus: 'all_clear' | 'caution' | 'hazardous';
  segments: IMDHighwaySegment[];
}

// ==========================================
// 9. High-Altitude Pilgrimage Corridors
// ==========================================

export interface IMDPilgrimageCamp {
  campName: string; // e.g. "Kedarnath Base", "Baltal", "Holy Cave"
  altitudeMeters: number;
  currentTempC: number;
  feelsLikeC: number;
  rainSnowStatus: string;
  lightningRisk: 'low' | 'moderate' | 'high';
  windChillC: number;
  trackPassability: 'Open' | 'Caution' | 'Suspended';
  forecastSummary: string;
}

export interface IMDPilgrimageYatra {
  yatraId: string; // e.g. "chardham", "amarnath", "vaishnodevi"
  yatraName: string;
  seasonStatus: 'Active' | 'Closed' | 'Alert';
  camps: IMDPilgrimageCamp[];
  mountainBulletinUrl?: string;
}

// ==========================================
// 10. Kisan Agromet Advisory (GKMS / Meghdoot)
// ==========================================

export interface IMDCropAdvisory {
  cropName: string; // e.g. "Paddy", "Cotton", "Wheat", "Mustard"
  growthStage: string; // e.g. "Tillering / Flowering"
  advisoryText: string;
  irrigationGuidance: string;
  pestDiseaseAlert?: string;
  fertilizerSprayingWindow: 'favorable' | 'unfavorable';
}

export interface IMDAgrometBulletin {
  districtName: string;
  stateName: string;
  issuedDateIST: string;
  validUptoIST: string;
  weatherSummary: string;
  cropAdvisories: IMDCropAdvisory[];
  livestockCare?: string;
}
