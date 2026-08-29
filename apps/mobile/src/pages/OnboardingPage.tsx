import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PersonaId, AllergyType } from '@mausam/shared-types';
import { PersonaIcon, Button } from '@mausam/design-system';
import {
  Check,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Phone,
  User,
} from 'lucide-react';

interface PersonaOption {
  id: PersonaId;
  title: string;
  tagline: string;
  badge: string;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  {
    id: 'health',
    title: 'Health-Conscious',
    tagline: 'AQI, pollen index & respiratory loads',
    badge: 'AQI & Pollen',
  },
  {
    id: 'fitness',
    title: 'Outdoor Fitness',
    tagline: 'Prime running hours & thermal strain',
    badge: 'Run & Workout',
  },
  {
    id: 'beach',
    title: 'Beachgoers & Surfers',
    tagline: 'Tides, swell & sea water temperature',
    badge: 'Marine & Waves',
  },
  {
    id: 'traveler',
    title: 'Travelers & Nomads',
    tagline: 'Multi-city monitors & severe weather diffs',
    badge: 'Multi-City',
  },
  {
    id: 'family',
    title: 'Parents & Families',
    tagline: 'School commute rain alerts & weekend safety',
    badge: 'Transit & Rain',
  },
  {
    id: 'agri',
    title: 'Agriculture & Gardeners',
    tagline: 'Soil moisture, frost & monsoon tracking',
    badge: 'Crop & Soil',
  },
  {
    id: 'commuter',
    title: 'Daily Commuters',
    tagline: 'Traffic radar, fog & road flooding alerts',
    badge: 'Traffic Radar',
  },
  {
    id: 'events',
    title: 'Event Planners',
    tagline: '7-day comfort matrix & storm probabilities',
    badge: '7-Day Outlook',
  },
];

const ALLERGY_OPTIONS: Array<{ id: AllergyType; title: string; desc: string; icon: string }> = [
  {
    id: 'pollen',
    title: 'Pollen Allergy (Hay Fever)',
    desc: 'Alerts when anemophilous grass & weed counts spike',
    icon: '🌸',
  },
  {
    id: 'dust_aqi',
    title: 'Dust & PM2.5 Sensitivity',
    desc: 'Alerts when particulate matter exceeds safe thresholds',
    icon: '💨',
  },
  {
    id: 'asthma',
    title: 'Asthma & Bronchial Load',
    desc: 'Early warning for combined humidity + temperature inversions',
    icon: '🫁',
  },
  {
    id: 'heat_sensitive',
    title: 'Extreme Heat & Sun Strain',
    desc: 'Flags high wet-bulb temperatures and excessive UV radiation',
    icon: '☀️',
  },
  {
    id: 'migraine',
    title: 'Barometric Migraines',
    desc: 'Alerts for sudden atmospheric pressure swings and incoming storms',
    icon: '⚡',
  },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedPersonas,
    setSelectedPersonas,
    allergies,
    setAllergies,
    loginWithPhone,
    setHasCompletedOnboarding,
    fetchForecast,
  } = useAppStore();

  const [step, setStep] = useState<'personas' | 'allergies' | 'profile'>('personas');
  const [selected, setSelected] = useState<PersonaId[]>(
    selectedPersonas.length > 0 ? selectedPersonas : ['fitness', 'health']
  );
  const [chosenAllergies, setChosenAllergies] = useState<AllergyType[]>(allergies);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAge, setUserAge] = useState('24');
  const [userGender, setUserGender] = useState<'male' | 'female' | 'other'>('male');

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

  const handleFinish = () => {
    setSelectedPersonas(selected);
    setAllergies(chosenAllergies);
    if (userPhone.trim()) {
      loginWithPhone(
        userPhone.startsWith('+91') ? userPhone : `+91 ${userPhone}`,
        userName || 'Weather Citizen',
        Number(userAge) || 24,
        userGender
      );
    }
    setHasCompletedOnboarding(true);
    fetchForecast();
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-5 pt-8 bg-app text-content-primary max-w-lg mx-auto">
      {/* Top Brand Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-sm tracking-wider uppercase text-accent-primary">
              Mausam+ Setup
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-content-muted">
            <span className={step === 'personas' ? 'text-accent-primary font-extrabold' : ''}>1</span>
            <span>•</span>
            <span className={step === 'allergies' ? 'text-accent-primary font-extrabold' : ''}>2</span>
            <span>•</span>
            <span className={step === 'profile' ? 'text-accent-primary font-extrabold' : ''}>3</span>
          </div>
        </div>

        {/* Step 1: Personas */}
        {step === 'personas' && (
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-content-primary tracking-tight">
              Select Your Weather Personas
            </h1>
            <p className="text-xs text-content-secondary mt-1">
              Pick 1 or more personas. Your homepage will rank the most actionable metrics first.
            </p>

            <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[58vh] overflow-y-auto pr-1">
              {PERSONA_OPTIONS.map((item) => {
                const isChosen = selected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePersona(item.id)}
                    className={`flex items-center gap-3.5 rounded-2xl p-4 text-left border transition-all duration-150 active:scale-[0.98] ${
                      isChosen
                        ? 'border-accent-primary bg-accent-primary/10 shadow-sm ring-1 ring-accent-primary/40 dark:bg-sky-950/40'
                        : 'border-border-subtle bg-card/90 hover:bg-card-subtle'
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl transition-colors ${
                        isChosen ? 'bg-accent-primary text-white shadow-md' : 'bg-card-subtle'
                      }`}
                    >
                      <PersonaIcon personaId={item.id} className="w-6 h-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-sm font-bold text-content-primary truncate">
                          {item.title}
                        </h3>
                        {isChosen && (
                          <div className="h-4 w-4 rounded-full bg-accent-primary flex items-center justify-center text-white flex-shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-content-secondary mt-0.5 leading-snug">
                        {item.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Allergies & Health Sensitivities */}
        {step === 'allergies' && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 mb-1">
              <HeartPulse className="w-4 h-4" />
              <span>Intelligent Health AI Setup</span>
            </div>
            <h1 className="font-heading text-2xl font-extrabold text-content-primary tracking-tight">
              Any Weather Sensitivities?
            </h1>
            <p className="text-xs text-content-secondary mt-1">
              Mausam+ AI warns you ahead of time when local pollen, dust, or humidity spikes.
            </p>

            <div className="my-5 space-y-2.5 max-h-[58vh] overflow-y-auto pr-1">
              {ALLERGY_OPTIONS.map((allergy) => {
                const isChosen = chosenAllergies.includes(allergy.id);
                return (
                  <button
                    key={allergy.id}
                    type="button"
                    onClick={() => toggleAllergy(allergy.id)}
                    className={`flex items-center gap-3.5 w-full rounded-2xl p-3.5 text-left border transition-all ${
                      isChosen
                        ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                        : 'border-border-subtle bg-card hover:bg-card-subtle'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{allergy.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-xs font-bold text-content-primary">
                          {allergy.title}
                        </h3>
                        {isChosen && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />}
                      </div>
                      <p className="text-[11px] text-content-secondary mt-0.5">{allergy.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Quick Profile & Phone Login */}
        {step === 'profile' && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent-primary mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Account & Personalization</span>
            </div>
            <h1 className="font-heading text-2xl font-extrabold text-content-primary tracking-tight">
              Personalize Your Profile
            </h1>
            <p className="text-xs text-content-secondary mt-1">
              Calibrate physiological heat indexes and sync multi-city weather alerts.
            </p>

            <div className="my-5 space-y-3 bg-card border border-border-subtle rounded-3xl p-4 shadow-sm">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-content-muted">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Aniket Singh"
                  className="w-full rounded-xl border border-border-subtle bg-input px-3 py-2 text-xs text-content-primary focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-content-muted">Mobile Number (Optional)</label>
                <div className="flex rounded-xl border border-border-subtle bg-input overflow-hidden focus-within:border-accent-primary">
                  <span className="flex items-center px-3 text-xs font-bold text-content-secondary border-r border-border-subtle bg-card-subtle">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="flex-1 bg-transparent px-3 py-2 text-xs text-content-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-content-muted">Age</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={userAge}
                    onChange={(e) => setUserAge(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-input px-3 py-2 text-xs text-content-primary focus:border-accent-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-content-muted">Gender</label>
                  <select
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value as any)}
                    className="w-full rounded-xl border border-border-subtle bg-input px-2.5 py-2 text-xs text-content-primary focus:border-accent-primary focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="border-t border-border-subtle pt-4">
        {step === 'personas' && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setStep('allergies')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Health Setup ({selected.length} Personas)
          </Button>
        )}

        {step === 'allergies' && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="lg" onClick={() => setStep('personas')}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep('profile')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 'profile' && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="lg" onClick={() => setStep('allergies')}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleFinish}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Enter Mausam+
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

