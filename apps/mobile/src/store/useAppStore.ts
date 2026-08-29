import { create } from 'zustand';
import {
  PersonaId,
  NormalizedForecast,
  LocationInfo,
  SavedPlace,
  SupportedLanguage,
  TemperatureUnit,
  WindSpeedUnit,
  UserProfile,
  AllergyType,
} from '@mausam/shared-types';

export interface AppState {
  // User Onboarding & Persona Personalization
  selectedPersonas: PersonaId[];
  hasCompletedOnboarding: boolean;
  cardOrder: string[];
  hiddenCardIds: string[];

  // User Profile & Health Sensitivities
  userProfile: UserProfile;
  allergies: AllergyType[];

  // Active Location & Saved Places
  activeLocation: LocationInfo;
  savedPlaces: SavedPlace[];

  // Forecast Data
  forecast: NormalizedForecast | null;
  isLoadingForecast: boolean;
  forecastError: string | null;

  // UI State & Preferences
  theme: 'light' | 'dark';
  language: SupportedLanguage;
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  activeWhyModalCardId: string | null;

  // Actions
  setSelectedPersonas: (personas: PersonaId[]) => void;
  setHasCompletedOnboarding: (status: boolean) => void;
  setCardOrder: (order: string[]) => void;
  reorderCards: (startIndex: number, endIndex: number) => void;
  setActiveLocation: (location: LocationInfo) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  toggleAllergy: (allergy: AllergyType) => void;
  setAllergies: (allergies: AllergyType[]) => void;
  loginWithPhone: (phone: string, name?: string, age?: number, gender?: UserProfile['gender']) => void;
  logout: () => void;
  toggleTheme: () => void;
  setWhyModalCardId: (cardId: string | null) => void;
  fetchForecast: (lat?: number, lon?: number, name?: string) => Promise<void>;
  addSavedPlace: (place: SavedPlace) => void;
  removeSavedPlace: (id: string) => void;
}

const DEFAULT_CARD_ORDER = [
  'card-heat-stress',
  'card-health-aqi',
  'card-fitness-running',
  'card-beach-tide',
  'card-commute-radar',
];

export const useAppStore = create<AppState>((set, get) => ({
  selectedPersonas: ['fitness', 'health'],
  hasCompletedOnboarding: true,
  cardOrder: DEFAULT_CARD_ORDER,
  hiddenCardIds: [],

  userProfile: {
    id: 'user-01',
    name: 'Aniket Singh',
    phone: '+91 98765 43210',
    age: 24,
    gender: 'male',
    allergies: ['pollen', 'dust_aqi'],
    isLoggedIn: true,
    city: 'Bengaluru',
  },
  allergies: ['pollen', 'dust_aqi'],

  activeLocation: {
    name: 'Bengaluru, Karnataka',
    lat: 12.9716,
    lon: 77.5946,
    region: 'Karnataka',
    country: 'India',
  },

  savedPlaces: [
    {
      id: 'place-1',
      name: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      lat: 12.9716,
      lon: 77.5946,
      isCurrentLocation: true,
    },
    {
      id: 'place-2',
      name: 'Mumbai Marine Drive',
      state: 'Maharashtra',
      country: 'India',
      lat: 18.944,
      lon: 72.823,
    },
    {
      id: 'place-3',
      name: 'New Delhi',
      state: 'Delhi NCR',
      country: 'India',
      lat: 28.6139,
      lon: 77.209,
    },
    {
      id: 'place-4',
      name: 'Goa Coastal Beach',
      state: 'Goa',
      country: 'India',
      lat: 15.2993,
      lon: 74.124,
    },
  ],

  forecast: null,
  isLoadingForecast: false,
  forecastError: null,

  theme: 'dark',
  language: 'en',
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kph',
  activeWhyModalCardId: null,

  setSelectedPersonas: (personas) => set({ selectedPersonas: personas }),
  setHasCompletedOnboarding: (status) => set({ hasCompletedOnboarding: status }),
  setCardOrder: (order) => set({ cardOrder: order }),

  reorderCards: (startIndex, endIndex) => {
    const currentOrder = [...get().cardOrder];
    const [movedItem] = currentOrder.splice(startIndex, 1);
    currentOrder.splice(endIndex, 0, movedItem);
    set({ cardOrder: currentOrder });
  },

  setActiveLocation: (location) => {
    set({ activeLocation: location });
    get().fetchForecast(location.lat, location.lon, location.name);
  },

  setLanguage: (language) => set({ language }),
  setTemperatureUnit: (temperatureUnit) => set({ temperatureUnit }),
  setWindSpeedUnit: (windSpeedUnit) => set({ windSpeedUnit }),

  setUserProfile: (profileUpdates) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...profileUpdates },
    })),

  toggleAllergy: (allergy) => {
    const current = get().allergies;
    const next = current.includes(allergy)
      ? current.filter((a) => a !== allergy)
      : [...current, allergy];
    set((state) => ({
      allergies: next,
      userProfile: { ...state.userProfile, allergies: next },
    }));
  },

  setAllergies: (allergies) =>
    set((state) => ({
      allergies,
      userProfile: { ...state.userProfile, allergies },
    })),

  loginWithPhone: (phone, name = 'Weather Citizen', age = 25, gender = 'male') => {
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      phone,
      age,
      gender,
      allergies: get().allergies,
      isLoggedIn: true,
      city: get().activeLocation.name,
    };
    set({ userProfile: profile });
  },

  logout: () => {
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        isLoggedIn: false,
      },
    }));
  },


  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: next });
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setWhyModalCardId: (activeWhyModalCardId) => set({ activeWhyModalCardId }),

  fetchForecast: async (latParam, lonParam, nameParam) => {
    const state = get();
    const lat = latParam !== undefined ? latParam : state.activeLocation.lat;
    const lon = lonParam !== undefined ? lonParam : state.activeLocation.lon;
    const name = nameParam || state.activeLocation.name;

    set({ isLoadingForecast: true, forecastError: null });

    try {
      const response = await fetch(`/api/forecast?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error(`BFF forecast error: ${response.statusText}`);
      }
      const data = (await response.json()) as NormalizedForecast;
      set({ forecast: data, isLoadingForecast: false });
    } catch (err: any) {
      console.warn('[Forecast Store] Live BFF fetch failed, using internal fallback dataset.', err);
      // Construct fallback mock data on frontend if offline
      set({
        forecast: {
          location: { name, lat, lon, country: 'India' },
          current: {
            temp_c: 28.5,
            feels_like_c: 31.0,
            humidity_pct: 68,
            wind_kph: 14.2,
            uv_index: 7.4,
            aqi: 128,
            condition: 'Partly Cloudy',
            is_day: true,
          },
          hourly: Array.from({ length: 24 }).map((_, i) => ({
            time: new Date(Date.now() + i * 3600000).toISOString(),
            temp_c: 24 + (i % 6),
            rain_prob_pct: i > 15 && i < 20 ? 65 : 10,
            aqi: 110 + (i % 20),
            uv_index: i > 8 && i < 16 ? 7 : 0,
            condition: i > 15 && i < 20 ? 'Rain' : 'Partly Cloudy',
          })),
          daily: Array.from({ length: 7 }).map((_, i) => ({
            date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
            temp_min_c: 21,
            temp_max_c: 31,
            rain_prob_pct: i === 1 ? 75 : 20,
            sunrise: '06:08 AM',
            sunset: '06:44 PM',
            condition: i === 1 ? 'Rain' : 'Clear',
          })),
          extras: {
            tide: {
              next_high: '03:45 PM (+1.8m)',
              next_low: '09:20 PM (+0.4m)',
              wave_height_m: 1.2,
              water_temp_c: 27.5,
              surf_quality: 'Fair',
            },
            heat_stress_index: {
              score: 72,
              band: 'orange',
              label: 'High Risk / Severe Thermal Strain',
              summary: 'Elevated humidity curtailing sweat evaporation. Hydrate frequently.',
            },
            running_window: {
              score: 84,
              optimal_time_slot: '05:30 AM - 07:00 AM',
              reason: 'Zero UV radiation, cooler ambient temperature (22°C), and low air pollution.',
            },
            aqi_breakdown: {
              pm25: 54.2,
              pm10: 98.6,
              no2: 24.1,
              o3: 38.0,
              primary_pollutant: 'PM2.5',
            },
          },
          meta: {
            sources: ['IMD Regional Hub', 'Open-Meteo System'],
            fetched_at: new Date().toISOString(),
          },
        },
        isLoadingForecast: false,
      });
    }
  },

  addSavedPlace: (place) => {
    set((s) => ({ savedPlaces: [...s.savedPlaces, place] }));
  },

  removeSavedPlace: (id) => {
    set((s) => ({ savedPlaces: s.savedPlaces.filter((p) => p.id !== id) }));
  },
}));
