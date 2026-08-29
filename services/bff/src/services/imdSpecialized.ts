import {
  IMDActiveCyclone,
  IMDFishermenAreaWarning,
  IMDPortWarningSignal,
  IMDFlashFloodBasin,
  IMDRainfallDepartureDistrict,
  IMDHighwayCorridor,
  IMDPilgrimageYatra,
  IMDAgrometBulletin,
} from '@mausam/shared-types';

// ==========================================
// 1. RSMC Tropical Cyclone Division
// ==========================================

export const ACTIVE_CYCLONES_DATA: IMDActiveCyclone[] = [
  {
    id: 'BOB-04-2026',
    name: 'Cyclonic Disturbance ASNA-02',
    basin: 'Bay of Bengal',
    currentIntensity: 'DD',
    currentIntensityLabel: 'Deep Depression (28–33 knots)',
    currentLat: 19.8,
    currentLon: 86.4,
    currentWindSpeedKph: 55,
    currentPressureHpa: 994,
    landfallForecast: {
      location: 'Between Puri and Chandbali (Odisha Coast)',
      estimatedTimeIST: 'Tomorrow 08:30 IST',
      expectedWindSpeedKph: 65,
      stormSurgeHeightM: 1.2,
    },
    trackHistory: [
      {
        timeIST: 'Yesterday 17:30 IST',
        lat: 18.2,
        lon: 88.5,
        intensity: 'D',
        windSpeedKts: 25,
        windSpeedKph: 45,
        centralPressureHpa: 1000,
        estimatedStatus: 'Depression',
        isForecast: false,
      },
      {
        timeIST: 'Today 08:30 IST',
        lat: 19.1,
        lon: 87.2,
        intensity: 'DD',
        windSpeedKts: 30,
        windSpeedKph: 55,
        centralPressureHpa: 996,
        estimatedStatus: 'Deep Depression',
        isForecast: false,
      },
      {
        timeIST: 'Today 17:30 IST',
        lat: 19.8,
        lon: 86.4,
        intensity: 'DD',
        windSpeedKts: 30,
        windSpeedKph: 55,
        centralPressureHpa: 994,
        estimatedStatus: 'Deep Depression',
        isForecast: false,
        radiiQuadrants: {
          radius28ktKm: 180,
          radius34ktKm: 110,
        },
      },
    ],
    forecastTrack: [
      {
        timeIST: 'Tomorrow 05:30 IST',
        lat: 20.4,
        lon: 85.9,
        intensity: 'DD',
        windSpeedKts: 35,
        windSpeedKph: 65,
        centralPressureHpa: 992,
        estimatedStatus: 'Marginal Cyclonic Storm / Deep Depression',
        isForecast: true,
      },
      {
        timeIST: 'Tomorrow 17:30 IST',
        lat: 21.2,
        lon: 85.0,
        intensity: 'D',
        windSpeedKts: 25,
        windSpeedKph: 45,
        centralPressureHpa: 998,
        estimatedStatus: 'Depression over land',
        isForecast: true,
      },
      {
        timeIST: 'Day+2 05:30 IST',
        lat: 22.0,
        lon: 83.8,
        intensity: 'D',
        windSpeedKts: 20,
        windSpeedKph: 35,
        centralPressureHpa: 1002,
        estimatedStatus: 'Well Marked Low Pressure Area',
        isForecast: true,
      },
    ],
    coneOfUncertaintyPolygon: [
      [19.8, 86.4],
      [20.8, 87.2],
      [21.8, 86.1],
      [22.5, 84.5],
      [22.2, 83.0],
      [21.0, 83.9],
      [20.0, 85.2],
      [19.8, 86.4],
    ],
    bulletinText: 'Deep Depression over Northwest Bay of Bengal moved west-northwestwards with speed of 14 kmph and lay centered near lat 19.8N and long 86.4E. Likely to cross Odisha coast near Puri by early morning tomorrow.',
    lastUpdatedIST: '18:30 IST (Special RSMC Bulletin)',
  },
];

// ==========================================
// 2. Maritime & Fishermen Warnings
// ==========================================

export const FISHERMEN_WARNINGS_DATA: IMDFishermenAreaWarning[] = [
  {
    coastalZone: 'West Bengal & Odisha Coasts (North Bay of Bengal)',
    statesCovered: ['West Bengal', 'Odisha'],
    warningLevel: 'severe_danger',
    expectedWindSpeedKph: '50-60 kmph gusting to 70 kmph',
    seaCondition: 'Very Rough',
    fishermenAdvisory: 'Fishermen are strictly advised not to venture into deep sea or along the coast during the next 48 hours.',
    validUptoIST: 'Tomorrow 23:59 IST',
  },
  {
    coastalZone: 'Andhra Pradesh & North Tamil Nadu Coasts',
    statesCovered: ['Andhra Pradesh', 'Tamil Nadu'],
    warningLevel: 'caution',
    expectedWindSpeedKph: '40-50 kmph gusting to 60 kmph',
    seaCondition: 'Rough',
    fishermenAdvisory: 'Squally weather with strong winds likely. Advised to stay close to shore.',
    validUptoIST: 'Tomorrow 18:00 IST',
  },
  {
    coastalZone: 'Maharashtra, Goa & Gujarat Coasts (Arabian Sea)',
    statesCovered: ['Maharashtra', 'Goa', 'Gujarat'],
    warningLevel: 'caution',
    expectedWindSpeedKph: '35-45 kmph',
    seaCondition: 'Rough',
    fishermenAdvisory: 'High swell waves and intermittent rain squalls expected.',
    validUptoIST: 'Tomorrow 12:00 IST',
  },
  {
    coastalZone: 'Kerala, Karnataka & Lakshadweep Waters',
    statesCovered: ['Kerala', 'Karnataka', 'Lakshadweep'],
    warningLevel: 'safe',
    expectedWindSpeedKph: '25-35 kmph',
    seaCondition: 'Moderate',
    fishermenAdvisory: 'Standard monsoon precautions apply. No severe weather warning.',
    validUptoIST: 'Tomorrow 18:00 IST',
  },
];

export const PORT_WARNING_SIGNALS: IMDPortWarningSignal[] = [
  {
    portName: 'Paradip Port',
    state: 'Odisha',
    signalNumber: 3,
    signalName: 'Local Cautionary Signal No. III',
    meaning: 'Squally weather likely. Port is threatened by squally weather from a depression.',
    actionRequired: 'Vessels to take precautions and secure berths. Small craft not to leave harbour.',
  },
  {
    portName: 'Dhamra Port',
    state: 'Odisha',
    signalNumber: 3,
    signalName: 'Local Cautionary Signal No. III',
    meaning: 'Port threatened by squalls and gale winds.',
    actionRequired: 'Keep continuous radio watch and secure deck cargo.',
  },
  {
    portName: 'Haldia / Kolkata Port',
    state: 'West Bengal',
    signalNumber: 2,
    signalName: 'Distant Warning Signal No. II',
    meaning: 'Deep depression in open sea. Port may experience heavy wind and swell.',
    actionRequired: 'Monitor RSMC bulletins.',
  },
  {
    portName: 'Visakhapatnam Port',
    state: 'Andhra Pradesh',
    signalNumber: 3,
    signalName: 'Local Cautionary Signal No. III',
    meaning: 'Squally conditions with high swells.',
    actionRequired: 'All outgoing fishing vessels recalled.',
  },
];

// ==========================================
// 3. Hydrology & Flash Flood Guidance System (FFGS)
// ==========================================

export const FLASH_FLOOD_BASINS_DATA: IMDFlashFloodBasin[] = [
  {
    basinId: 'FFGS-MAHANADI-03',
    basinName: 'Lower Mahanadi & Baitarani Sub-basins',
    state: 'Odisha',
    flashFloodRisk: 'high',
    flashFloodThreatMm: 68.5,
    soilMoistureIndexPct: 92,
    validityIST: 'Next 12 Hours',
    catchmentSummary: 'Heavy surface runoff expected in low-lying riparian tracts. High risk of localized inundation and culvert overflows.',
  },
  {
    basinId: 'FFGS-KONKAN-01',
    basinName: 'Ulhas & Vashishti River Basins',
    state: 'Maharashtra',
    flashFloodRisk: 'moderate',
    flashFloodThreatMm: 42.0,
    soilMoistureIndexPct: 86,
    validityIST: 'Next 24 Hours',
    catchmentSummary: 'Ghat section rainfall contributing to quick runoff into tributary creeks.',
  },
  {
    basinId: 'FFGS-BRAHMAPUTRA-05',
    basinName: 'Barak & Surma River Basins',
    state: 'Assam & Meghalaya',
    flashFloodRisk: 'moderate',
    flashFloodThreatMm: 38.0,
    soilMoistureIndexPct: 88,
    validityIST: 'Next 24 Hours',
    catchmentSummary: 'Sustained monsoon flow; soil saturation near field capacity.',
  },
];

export const RAINFALL_DEPARTURE_DATA: IMDRainfallDepartureDistrict[] = [
  { districtName: 'Puri', stateName: 'Odisha', actualRainMm: 94.2, normalRainMm: 12.5, departurePct: 653, category: 'Large Excess', colorHex: '#0055ff' },
  { districtName: 'Khurda', stateName: 'Odisha', actualRainMm: 68.0, normalRainMm: 11.2, departurePct: 507, category: 'Large Excess', colorHex: '#0055ff' },
  { districtName: 'Mumbai City', stateName: 'Maharashtra', actualRainMm: 42.6, normalRainMm: 24.0, departurePct: 77, category: 'Excess', colorHex: '#00bbff' },
  { districtName: 'Pune', stateName: 'Maharashtra', actualRainMm: 14.8, normalRainMm: 12.0, departurePct: 23, category: 'Excess', colorHex: '#00bbff' },
  { districtName: 'Bengaluru Urban', stateName: 'Karnataka', actualRainMm: 6.4, normalRainMm: 7.1, departurePct: -10, category: 'Normal', colorHex: '#22c55e' },
  { districtName: 'New Delhi', stateName: 'Delhi', actualRainMm: 4.8, normalRainMm: 5.2, departurePct: -8, category: 'Normal', colorHex: '#22c55e' },
  { districtName: 'Jaipur', stateName: 'Rajasthan', actualRainMm: 1.2, normalRainMm: 4.6, departurePct: -74, category: 'Large Deficient', colorHex: '#ef4444' },
];

// ==========================================
// 4. Highway Weather Corridors
// ==========================================

export const HIGHWAY_CORRIDORS_DATA: IMDHighwayCorridor[] = [
  {
    highwayId: 'NH-48',
    routeName: 'Mumbai - Pune - Bengaluru Corridor',
    originCity: 'Mumbai',
    destinationCity: 'Bengaluru',
    totalDistanceKm: 980,
    overallStatus: 'caution',
    segments: [
      {
        segmentName: 'Mumbai - Panvel - Khopoli',
        visibilityMeters: 3500,
        rainfallStatus: 'Moderate',
        hazardWarning: 'Water accumulation on flyover lanes',
        speedAdvisoryKph: 70,
        currentCondition: 'Cloudy with intermittent rain',
      },
      {
        segmentName: 'Khandala - Lonavala Ghat Section',
        visibilityMeters: 600,
        rainfallStatus: 'Heavy',
        hazardWarning: 'Dense hill fog & slippery tarmac in Bhor Ghat',
        speedAdvisoryKph: 40,
        currentCondition: 'Dense fog and heavy downpours',
      },
      {
        segmentName: 'Pune - Satara - Kolhapur',
        visibilityMeters: 5000,
        rainfallStatus: 'Light',
        speedAdvisoryKph: 80,
        currentCondition: 'Overcast with light drizzle',
      },
      {
        segmentName: 'Belagavi - Hubballi - Bengaluru',
        visibilityMeters: 8000,
        rainfallStatus: 'None',
        speedAdvisoryKph: 90,
        currentCondition: 'Partly cloudy sky, clear driving visibility',
      },
    ],
  },
  {
    highwayId: 'NH-44',
    routeName: 'Delhi - Agra - Gwalior - Nagpur',
    originCity: 'Delhi',
    destinationCity: 'Nagpur',
    totalDistanceKm: 1090,
    overallStatus: 'all_clear',
    segments: [
      {
        segmentName: 'Delhi NCR - Yamuna Expressway - Agra',
        visibilityMeters: 4000,
        rainfallStatus: 'None',
        speedAdvisoryKph: 100,
        currentCondition: 'Hazy sunshine',
      },
      {
        segmentName: 'Gwalior - Jhansi - Sagar',
        visibilityMeters: 7000,
        rainfallStatus: 'None',
        speedAdvisoryKph: 90,
        currentCondition: 'Clear skies',
      },
      {
        segmentName: 'Sagar - Seoni - Nagpur',
        visibilityMeters: 6000,
        rainfallStatus: 'Light',
        hazardWarning: 'Passing convective showers',
        speedAdvisoryKph: 80,
        currentCondition: 'Passing clouds',
      },
    ],
  },
];

// ==========================================
// 5. Sacred Pilgrimage Weather Corridors
// ==========================================

export const PILGRIMAGE_YATRAS_DATA: IMDPilgrimageYatra[] = [
  {
    yatraId: 'chardham',
    yatraName: 'Chardham Yatra (Uttarakhand Himalayas)',
    seasonStatus: 'Active',
    mountainBulletinUrl: 'https://internal.imd.gov.in/section/nhac/dynamic/hmc.pdf',
    camps: [
      {
        campName: 'Kedarnath Dham (Temple Base)',
        altitudeMeters: 3584,
        currentTempC: 8.4,
        feelsLikeC: 5.2,
        rainSnowStatus: 'Light intermittent rain / mist',
        lightningRisk: 'low',
        windChillC: 4.8,
        trackPassability: 'Open',
        forecastSummary: 'Cloudy sky with brief chilly rain showers. Warm clothing and rain gear mandatory.',
      },
      {
        campName: 'Gaurikund (Trek Start Point)',
        altitudeMeters: 1982,
        currentTempC: 17.2,
        feelsLikeC: 17.5,
        rainSnowStatus: 'Partly cloudy with gentle breeze',
        lightningRisk: 'low',
        windChillC: 16.8,
        trackPassability: 'Open',
        forecastSummary: 'Clear trek path with comfortable daytime temperatures.',
      },
      {
        campName: 'Badrinath Dham',
        altitudeMeters: 3133,
        currentTempC: 10.1,
        feelsLikeC: 8.0,
        rainSnowStatus: 'Clear to partly cloudy',
        lightningRisk: 'low',
        windChillC: 7.6,
        trackPassability: 'Open',
        forecastSummary: 'Favorable pilgrimage weather; cool evening breeze.',
      },
      {
        campName: 'Gangotri & Yamunotri High Ridges',
        altitudeMeters: 3100,
        currentTempC: 11.5,
        feelsLikeC: 9.8,
        rainSnowStatus: 'Passing cloud cover',
        lightningRisk: 'low',
        windChillC: 9.2,
        trackPassability: 'Open',
        forecastSummary: 'Dry trails during morning hours.',
      },
    ],
  },
  {
    yatraId: 'amarnath',
    yatraName: 'Shri Amarnath Ji Yatra (Kashmir Himalayas)',
    seasonStatus: 'Active',
    camps: [
      {
        campName: 'Holy Cave Shrine',
        altitudeMeters: 3888,
        currentTempC: 6.2,
        feelsLikeC: 2.8,
        rainSnowStatus: 'Chilly winds & high-altitude fog',
        lightningRisk: 'moderate',
        windChillC: 1.5,
        trackPassability: 'Open',
        forecastSummary: 'Sub-zero temperatures expected post-sunset. Heavy woolens required.',
      },
      {
        campName: 'Panchtarni Camp',
        altitudeMeters: 3657,
        currentTempC: 8.0,
        feelsLikeC: 5.4,
        rainSnowStatus: 'Overcast',
        lightningRisk: 'low',
        windChillC: 4.6,
        trackPassability: 'Open',
        forecastSummary: 'Stable weather for evening camping.',
      },
      {
        campName: 'Sheshnag Lake Base',
        altitudeMeters: 3574,
        currentTempC: 9.4,
        feelsLikeC: 7.2,
        rainSnowStatus: 'Partly cloudy',
        lightningRisk: 'low',
        windChillC: 6.8,
        trackPassability: 'Open',
        forecastSummary: 'Good visibility across high pass.',
      },
      {
        campName: 'Baltal Base Camp',
        altitudeMeters: 2743,
        currentTempC: 15.6,
        feelsLikeC: 15.0,
        rainSnowStatus: 'Clear sky',
        lightningRisk: 'low',
        windChillC: 14.5,
        trackPassability: 'Open',
        forecastSummary: 'Clear departure weather for morning convoys.',
      },
    ],
  },
];

// ==========================================
// 6. Kisan Agromet Advisory (GKMS / Meghdoot)
// ==========================================

export const AGROMET_BULLETINS_DATA: Record<string, IMDAgrometBulletin> = {
  default: {
    districtName: 'National Agromet Advisory',
    stateName: 'India',
    issuedDateIST: 'Tuesday & Friday GKMS Release',
    validUptoIST: 'Next 5 Days',
    weatherSummary: 'Monsoon rainfall distribution favorable for Kharif crops across Central & Northern plains.',
    cropAdvisories: [
      {
        cropName: 'Paddy (Rice)',
        growthStage: 'Tillering & Vegetative Growth',
        advisoryText: 'Maintain 3-5 cm standing water in paddy fields. Ensure proper drainage in fields experiencing continuous heavy showers.',
        irrigationGuidance: 'Postpone scheduled irrigation if rainfall exceeds 25 mm in past 24 hours.',
        pestDiseaseAlert: 'Monitor for Stem Borer and Leaf Folder pests during high humidity (>80%) conditions.',
        fertilizerSprayingWindow: 'favorable',
      },
      {
        cropName: 'Cotton',
        growthStage: 'Square & Boll Formation',
        advisoryText: 'Avoid water stagnation around root zones. Construct cross-drains between furrow beds.',
        irrigationGuidance: 'Drain excess runoff immediately to prevent square shedding.',
        pestDiseaseAlert: 'Inspect leaf underside for Whitefly and Pink Bollworm infestation.',
        fertilizerSprayingWindow: 'unfavorable',
      },
      {
        cropName: 'Pulses (Arhar / Moong / Urad)',
        growthStage: 'Vegetative & Branching',
        advisoryText: 'Perform weeding and inter-culture operations during sunny morning breaks.',
        irrigationGuidance: 'Light irrigation only if dry spell exceeds 7 consecutive days.',
        fertilizerSprayingWindow: 'favorable',
      },
    ],
    livestockCare: 'Vaccinate cattle against Foot and Mouth Disease (FMD) and Hemorrhagic Septicemia (HS). Keep animal sheds dry and ventilated.',
  },
};
