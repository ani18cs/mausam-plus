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
import { setAppLanguage } from '../utils/i18n';

export interface AppState {
  // User Onboarding & Persona Personalization
  selectedPersonas: PersonaId[];
  hasCompletedOnboarding: boolean;
  cardOrder: string[];
  hiddenCardIds: string[];
  pinnedCardIds: string[];

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
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  startOnboardingDemo: () => void;

  // Actions
  setSelectedPersonas: (personas: PersonaId[]) => void;
  setHasCompletedOnboarding: (status: boolean) => void;
  setCardOrder: (order: string[]) => void;
  pinCardToHome: (cardId: string) => void;
  unpinCardFromHome: (cardId: string) => void;
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

const getInitialLang = (): SupportedLanguage => {
  try {
    const saved = localStorage.getItem('mausam_language');
    if (saved === 'en' || saved === 'hi' || saved === 'kn') return saved as SupportedLanguage;
  } catch (e) {}
  return 'en';
};

export const useAppStore = create<AppState>((set, get) => ({
  selectedPersonas: ['fitness', 'health'],
  showSplash: true,
  hasCompletedOnboarding: false,
  cardOrder: DEFAULT_CARD_ORDER,
  hiddenCardIds: [],
  pinnedCardIds: [],

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
  language: getInitialLang(),
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kph',
  activeWhyModalCardId: null,

  setShowSplash: (showSplash) => set({ showSplash }),
  startOnboardingDemo: () =>
    set({
      showSplash: true,
      hasCompletedOnboarding: false,
      selectedPersonas: ['fitness', 'health'],
      allergies: ['pollen', 'dust_aqi'],
    }),

  setSelectedPersonas: (personas) => set({ selectedPersonas: personas }),
  setHasCompletedOnboarding: (status) => set({ hasCompletedOnboarding: status }),
  setCardOrder: (order) => set({ cardOrder: order }),

  pinCardToHome: (cardId) => {
    const current = get().pinnedCardIds;
    if (!current.includes(cardId)) {
      set({ pinnedCardIds: [...current, cardId] });
    }
  },

  unpinCardFromHome: (cardId) => {
    set({ pinnedCardIds: get().pinnedCardIds.filter((id) => id !== cardId) });
  },

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

  setLanguage: (language) => {
    set({ language });
    setAppLanguage(language);
  },
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
      set({ forecast: data, isLoadingForecast: false, forecastError: null });
    } catch (err: any) {
      console.error('[Forecast Store] Live BFF fetch failed:', err);
      set({
        isLoadingForecast: false,
        forecastError: err?.message || 'Failed to fetch live weather data',
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
