import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PersonaId, AllergyType } from '@mausam/shared-types';
import { PersonaIcon, Button } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import { getCurrentLocationCoordinates } from '../services/nativeServices';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  MapPin,
  Search,
  Navigation,
  Globe,
} from 'lucide-react';

const POPULAR_INDIAN_CITIES = [
  { name: 'Bengaluru, Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Mumbai, Maharashtra', lat: 18.944, lon: 72.823 },
  { name: 'New Delhi, Delhi NCR', lat: 28.6139, lon: 77.209 },
  { name: 'Chennai, Tamil Nadu', lat: 13.0827, lon: 80.2707 },
  { name: 'Hyderabad, Telangana', lat: 17.385, lon: 78.4867 },
  { name: 'Kolkata, West Bengal', lat: 22.5726, lon: 88.3639 },
  { name: 'Goa Coastal, Goa', lat: 15.2993, lon: 74.124 },
  { name: 'Pune, Maharashtra', lat: 18.5204, lon: 73.8567 },
  { name: 'Jaipur, Rajasthan', lat: 26.9124, lon: 75.7873 },
  { name: 'Kochi, Kerala', lat: 9.9312, lon: 76.2673 },
];

const PERSONA_OPTIONS: Array<{ id: PersonaId; titleKey: string }> = [
  { id: 'health', titleKey: 'persona.health' },
  { id: 'fitness', titleKey: 'persona.fitness' },
  { id: 'beach', titleKey: 'persona.beach' },
  { id: 'traveler', titleKey: 'persona.traveler' },
  { id: 'family', titleKey: 'persona.family' },
  { id: 'agri', titleKey: 'persona.agri' },
  { id: 'commuter', titleKey: 'persona.commuter' },
  { id: 'events', titleKey: 'persona.events' },
];

const ALLERGY_OPTIONS: Array<{ id: AllergyType; titleKey: string; icon: string }> = [
  { id: 'pollen', titleKey: 'allergy.pollen', icon: '🌸' },
  { id: 'dust_aqi', titleKey: 'allergy.dust_aqi', icon: '💨' },
  { id: 'asthma', titleKey: 'allergy.asthma', icon: '🫁' },
  { id: 'heat_sensitive', titleKey: 'allergy.heat_sensitive', icon: '☀️' },
  { id: 'migraine', titleKey: 'allergy.migraine', icon: '⚡' },
  { id: 'cold_joint_pain', titleKey: 'allergy.cold_joint_pain', icon: '❄️' },
  { id: 'eye_irritation', titleKey: 'allergy.eye_irritation', icon: '👁️' },
  { id: 'elder_infant_care', titleKey: 'allergy.elder_infant_care', icon: '👶' },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    selectedPersonas,
    setSelectedPersonas,
    allergies,
    setAllergies,
    loginWithPhone,
    setHasCompletedOnboarding,
    fetchForecast,
    setActiveLocation,
  } = useAppStore();

  const [step, setStep] = useState<'personas' | 'allergies' | 'location'>('personas');
  const [selected, setSelected] = useState<PersonaId[]>(
    selectedPersonas.length > 0 ? selectedPersonas : ['fitness', 'health']
  );
  const [chosenAllergies, setChosenAllergies] = useState<AllergyType[]>(allergies);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [pickedCity, setPickedCity] = useState(POPULAR_INDIAN_CITIES[0]);

  const togglePersona = (id: PersonaId) => {
    if (selected.includes(id)) {
      if (selected.length > 1) {
        setSelected(selected.filter((p) => p !== id));
      }
    } else {
      setSelected([...selected, id]);
    }
  };

  const toggleAllergy = (id: AllergyType) => {
    if (chosenAllergies.includes(id)) {
      setChosenAllergies(chosenAllergies.filter((a) => a !== id));
    } else {
      setChosenAllergies([...chosenAllergies, id]);
    }
  };

  const handleGpsLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const coords = await getCurrentLocationCoordinates();
      const gpsLocation = {
        name: `Current Location (${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)})`,
        lat: coords.lat,
        lon: coords.lon,
      };
      setPickedCity(gpsLocation);
      setActiveLocation({
        name: gpsLocation.name,
        lat: coords.lat,
        lon: coords.lon,
        country: 'India',
      });
      await fetchForecast(coords.lat, coords.lon);
    } catch (e) {
      console.warn('GPS fallback:', e);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleFinish = () => {
    setSelectedPersonas(selected);
    setAllergies(chosenAllergies);
    setActiveLocation({
      name: pickedCity.name,
      lat: pickedCity.lat,
      lon: pickedCity.lon,
      country: 'India',
    });
    fetchForecast(pickedCity.lat, pickedCity.lon, pickedCity.name);
    loginWithPhone('+91 98765 43210', 'Weather Citizen', 24, 'male');
    setHasCompletedOnboarding(true);
    navigate('/home');
  };

  const filteredCities = POPULAR_INDIAN_CITIES.filter((c) =>
    c.name.toLowerCase().includes(locationQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen justify-between p-6 max-w-md mx-auto bg-app">
      {/* Top Progress & Header */}
      <div className="space-y-5">
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent-primary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {step === 'personas' ? 'Step 1 of 3: Personas' : step === 'allergies' ? 'Step 2 of 3: Sensitivities' : 'Step 3 of 3: Location Scope'}
          </span>
          <div className="flex gap-1.5">
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 'personas' ? 'w-6 bg-accent-primary' : 'w-2 bg-border-strong'
              }`}
            />
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 'allergies' ? 'w-6 bg-rose-500' : 'w-2 bg-border-strong'
              }`}
            />
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 'location' ? 'w-6 bg-emerald-500' : 'w-2 bg-border-strong'
              }`}
            />
          </div>
        </div>

        {/* Step 1: Personas Selection */}
        {step === 'personas' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <h1 className="font-heading text-xl font-bold text-content-primary">
                {t('onboarding.step2_title')}
              </h1>
              <p className="text-xs text-content-secondary leading-relaxed">
                {t('onboarding.step2_subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {PERSONA_OPTIONS.map((p) => {
                const isSelected = selected.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePersona(p.id)}
                    className={`flex items-center gap-2.5 rounded-2xl p-3.5 border text-left transition-all ${
                      isSelected
                        ? 'border-accent-primary bg-accent-primary/15 text-content-primary font-bold shadow-sm ring-1 ring-accent-primary/30 scale-[1.02]'
                        : 'border-border-subtle bg-card hover:bg-card-subtle text-content-secondary'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                        isSelected ? 'bg-accent-primary text-white' : 'bg-card-subtle text-content-muted'
                      }`}
                    >
                      <PersonaIcon personaId={p.id} className="w-4 h-4" />
                    </div>
                    <span className="text-xs">{t(p.titleKey)}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-accent-primary ml-auto stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Health & Weather Sensitivities */}
        {step === 'allergies' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h1 className="font-heading text-xl font-bold text-content-primary flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-rose-500" />
                  {t('onboarding.step3_title')}
                </h1>
                <span className="text-[11px] font-bold text-rose-500">
                  {chosenAllergies.length} Selected
                </span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                {t('onboarding.step3_subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {ALLERGY_OPTIONS.map((a) => {
                const isSelected = chosenAllergies.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAllergy(a.id)}
                    className={`flex items-center gap-2 rounded-2xl p-3 border text-left transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold shadow-sm ring-1 ring-rose-500/30 scale-[1.02]'
                        : 'border-border-subtle bg-card hover:bg-card-subtle text-content-secondary'
                    }`}
                  >
                    <span className="text-base">{a.icon}</span>
                    <span className="text-xs truncate">{t(a.titleKey)}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-500 ml-auto stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Location Scope & GPS */}
        {step === 'location' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <h1 className="font-heading text-xl font-bold text-content-primary flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-500" />
                Select Your Home Location
              </h1>
              <p className="text-xs text-content-secondary leading-relaxed">
                Scopes real-time IMD nowcasts, Doppler radar telemetry, and severe alerts directly to your region.
              </p>
            </div>

            {/* GPS Instant Locate Button */}
            <button
              type="button"
              onClick={handleGpsLocation}
              disabled={isDetectingLocation}
              className="flex w-full items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 hover:bg-emerald-500/20 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm flex-shrink-0">
                  <Navigation className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : 'fill-white'}`} />
                </div>
                <div>
                  <span className="font-heading text-xs font-bold text-content-primary block">
                    Use My Current Location (GPS)
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Auto-detects nearest IMD radar station
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {isDetectingLocation ? 'Detecting...' : 'Detect'}
              </span>
            </button>

            {/* City Search Bar */}
            <div className="space-y-2 pt-1">
              <div className="relative">
                <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Search Indian cities (e.g. Pune, Goa, Jaipur)..."
                  className="w-full min-h-[44px] rounded-2xl border border-border-subtle bg-input pl-10 pr-4 text-xs text-content-primary placeholder-content-muted focus:border-accent-primary focus:outline-none"
                />
              </div>

              {/* City Suggestions Grid */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {filteredCities.map((city) => {
                  const isCurrent = pickedCity.name === city.name;
                  return (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => setPickedCity(city)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-left transition-all ${
                        isCurrent
                          ? 'border border-emerald-500 bg-emerald-500/10 text-content-primary font-bold shadow-sm'
                          : 'border border-border-subtle bg-card hover:bg-card-subtle text-content-secondary'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-content-muted" />
                        <span>{city.name}</span>
                      </span>
                      {isCurrent && <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="pt-6 space-y-2">
        {step === 'personas' && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setStep('allergies')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {t('onboarding.next')} ({selected.length} Personas Selected)
          </Button>
        )}

        {step === 'allergies' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setStep('personas')}
            >
              {t('onboarding.back')}
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={() => setStep('location')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t('onboarding.next')}
            </Button>
          </div>
        )}

        {step === 'location' && (
          <div className="space-y-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleFinish}
              rightIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Finish Setup &amp; Enter Mausam+ ({pickedCity.name.split(',')[0]})
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => setStep('allergies')}
            >
              {t('onboarding.back')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
