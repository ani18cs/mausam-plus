import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PersonaId, SupportedLanguage, TemperatureUnit, WindSpeedUnit, AllergyType } from '@mausam/shared-types';
import { PersonaIcon, Button } from '@mausam/design-system';
import { LoginModal } from '../components/auth/LoginModal';
import { LanguageConfirmModal } from '../components/layout/LanguageConfirmModal';
import { useTranslation, LANGUAGE_METADATA } from '../utils/i18n';
import {
  User,
  Globe,
  Sliders,
  Moon,
  Sun,
  RotateCcw,
  Compass,
  Check,
  ShieldCheck,
  Phone,
  HeartPulse,
  LogOut,
  Edit3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ALL_PERSONAS: Array<{ id: PersonaId; label: string }> = [
  { id: 'health', label: 'Health-Conscious' },
  { id: 'fitness', label: 'Outdoor Fitness' },
  { id: 'beach', label: 'Beachgoers & Surfers' },
  { id: 'traveler', label: 'Travelers' },
  { id: 'family', label: 'Parents & Families' },
  { id: 'agri', label: 'Agriculture & Gardeners' },
  { id: 'commuter', label: 'Commuters' },
  { id: 'events', label: 'Event Planners' },
];

const ALLERGIES: Array<{ id: AllergyType; label: string; icon: string }> = [
  { id: 'pollen', label: 'Pollen Allergy', icon: '🌸' },
  { id: 'dust_aqi', label: 'PM2.5 & Dust', icon: '💨' },
  { id: 'asthma', label: 'Asthma / Bronchial', icon: '🫁' },
  { id: 'heat_sensitive', label: 'Extreme Heat', icon: '☀️' },
  { id: 'migraine', label: 'Barometric Migraine', icon: '⚡' },
  { id: 'cold_joint_pain', label: 'Cold Joint Pain', icon: '❄️' },
  { id: 'eye_irritation', label: 'Eye Irritation & Smog', icon: '👁️' },
  { id: 'elder_infant_care', label: 'Elder / Infant Care', icon: '👶' },
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    userProfile,
    allergies,
    toggleAllergy,
    selectedPersonas,
    setSelectedPersonas,
    language,
    setLanguage,
    theme,
    toggleTheme,
    temperatureUnit,
    setTemperatureUnit,
    windSpeedUnit,
    setWindSpeedUnit,
    setHasCompletedOnboarding,
    logout,
  } = useAppStore();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<SupportedLanguage | null>(null);

  const togglePersona = (id: PersonaId) => {
    if (selectedPersonas.includes(id)) {
      if (selectedPersonas.length > 1) {
        setSelectedPersonas(selectedPersonas.filter((p) => p !== id));
      }
    } else {
      setSelectedPersonas([...selectedPersonas, id]);
    }
  };

  const handleLanguageClick = (langCode: SupportedLanguage) => {
    if (langCode === language) return;
    setPendingLanguage(langCode);
  };

  const handleConfirmLanguage = () => {
    if (pendingLanguage) {
      setLanguage(pendingLanguage);
      setPendingLanguage(null);
    }
  };

  const handleResetOnboarding = () => {
    setHasCompletedOnboarding(false);
    navigate('/onboarding');
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 text-xs">
      {/* 1. Header & User Profile Demographics Card */}
      <div className="rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md font-heading font-bold text-lg">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-heading text-sm font-bold text-content-primary">
                  {userProfile.name || 'Citizen User'}
                </h1>
                {userProfile.isLoggedIn && (
                  <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-2.5 h-2.5" /> Verified
                  </span>
                )}
              </div>
              <p className="text-[11px] text-content-muted flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" /> {userProfile.phone}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1 rounded-xl bg-card-subtle px-2.5 py-1.5 text-xs font-semibold text-content-primary hover:bg-card border border-border-subtle"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        {/* Demographic Badges */}
        <div className="flex items-center gap-2 pt-2 border-t border-border-subtle/50 text-[11px]">
          <span className="rounded-lg bg-card-subtle px-2.5 py-1 font-medium text-content-secondary">
            {t('profile.age')}: <strong className="text-content-primary">{userProfile.age || 24} yrs</strong>
          </span>
          <span className="rounded-lg bg-card-subtle px-2.5 py-1 font-medium text-content-secondary capitalize">
            {t('profile.gender')}: <strong className="text-content-primary">{userProfile.gender || 'male'}</strong>
          </span>
          <span className="rounded-lg bg-card-subtle px-2.5 py-1 font-medium text-content-secondary">
            City: <strong className="text-content-primary">{userProfile.city || 'Bengaluru'}</strong>
          </span>
        </div>
      </div>

      {/* 2. Health & Weather Sensitivities Manager */}
      <div className="rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold text-content-primary flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-500" /> {t('profile.allergies_title')}
          </h3>
          <span className="text-[10px] font-bold text-rose-500">
            {allergies.length} Selected
          </span>
        </div>
        <p className="text-[11px] text-content-muted">
          Toggle sensitivities to activate custom AI warnings when local environmental indices spike.
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {ALLERGIES.map((a) => {
            const isSelected = allergies.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleAllergy(a.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 border transition-all ${
                  isSelected
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40 shadow-sm font-semibold'
                    : 'bg-card-subtle text-content-secondary border-border-subtle hover:bg-card'
                }`}
              >
                <span>{a.icon}</span>
                <span>{a.label}</span>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Persona Configuration Manager */}
      <div className="rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold text-content-primary flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-accent-primary" /> {t('profile.active_personas')}
          </h3>
          <span className="text-[10px] font-bold text-accent-primary">
            {selectedPersonas.length} {t('profile.personas_active')}
          </span>
        </div>
        <p className="text-[11px] text-content-muted">
          {t('profile.personas_hint')}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {ALL_PERSONAS.map((p) => {
            const isSelected = selectedPersonas.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePersona(p.id)}
                className={`flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 border transition-all ${
                  isSelected
                    ? 'bg-accent-primary text-white border-accent-primary shadow-sm font-semibold'
                    : 'bg-card-subtle text-content-secondary border-border-subtle hover:bg-card'
                }`}
              >
                <PersonaIcon personaId={p.id} className="w-3.5 h-3.5" />
                <span>{p.label}</span>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Language & Regional Localization (With Confirmation Modal) */}
      <div className="rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-card">
        <h3 className="font-heading text-xs font-bold text-content-primary flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-emerald-500" /> {t('profile.language_title')}
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(LANGUAGE_METADATA) as SupportedLanguage[]).map((code) => {
            const meta = LANGUAGE_METADATA[code];
            const isCurrent = language === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleLanguageClick(code)}
                className={`rounded-xl p-2.5 text-left border transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-500/10 font-bold text-content-primary ring-1 ring-emerald-500/30'
                    : 'border-border-subtle bg-card-subtle text-content-secondary hover:bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>{meta.flag}</span>
                    <span>{meta.nativeName}</span>
                  </span>
                  {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <span className="text-[10px] text-content-muted block mt-0.5">{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Units of Measurement Switcher */}
      <div className="rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-card">
        <h3 className="font-heading text-xs font-bold text-content-primary flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-orange-500" /> {t('profile.units_title')}
        </h3>

        <div className="space-y-2.5">
          {/* Temperature Units */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-card-subtle">
            <span className="font-semibold text-content-primary">{t('profile.temp_unit')}</span>
            <div className="flex rounded-xl bg-card p-0.5 border border-border-subtle">
              <button
                type="button"
                onClick={() => setTemperatureUnit('celsius')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  temperatureUnit === 'celsius'
                    ? 'bg-accent-primary text-white shadow-sm'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                onClick={() => setTemperatureUnit('fahrenheit')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  temperatureUnit === 'fahrenheit'
                    ? 'bg-accent-primary text-white shadow-sm'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Wind Speed Units */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-card-subtle">
            <span className="font-semibold text-content-primary">{t('profile.wind_unit')}</span>
            <div className="flex rounded-xl bg-card p-0.5 border border-border-subtle">
              {(['kph', 'mph', 'mps', 'knots'] as WindSpeedUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setWindSpeedUnit(u)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                    windSpeedUnit === u
                      ? 'bg-accent-primary text-white shadow-sm'
                      : 'text-content-muted hover:text-content-primary'
                  }`}
                >
                  {u === 'mps' ? 'm/s' : u === 'knots' ? 'kts' : u}
                </button>
              ))}
            </div>
          </div>

          {/* Color Theme Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-card-subtle">
            <span className="font-semibold text-content-primary">{t('profile.theme')}</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border-subtle font-bold text-content-primary hover:bg-card-subtle"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t('profile.dark_mode')}</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('profile.light_mode')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 6. SIH Project Metadata Banner */}
      <div className="rounded-2xl border border-border-subtle bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent p-4 space-y-1.5">
        <div className="flex items-center gap-1.5 text-accent-primary font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>{t('profile.project')}</span>
        </div>
        <p className="text-[11px] text-content-secondary">
          {t('profile.project_detail')}
        </p>
        <p className="text-[10px] text-content-muted">
          Mausam+ Prototype v1.2.0 • Full Multilingual &amp; Allergy AI Engine
        </p>
      </div>

      {/* 7. Reset Onboarding Button */}
      <div className="pt-1">
        <Button
          variant="outline"
          fullWidth
          onClick={handleResetOnboarding}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          {t('profile.reset')}
        </Button>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <LanguageConfirmModal
        isOpen={Boolean(pendingLanguage)}
        targetLanguage={pendingLanguage}
        onConfirm={handleConfirmLanguage}
        onCancel={() => setPendingLanguage(null)}
      />
    </div>
  );
};
