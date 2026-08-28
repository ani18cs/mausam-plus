import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { PersonaId } from '@mausam/shared-types';
import { PersonaIcon, Button } from '@mausam/design-system';
import {
  User,
  Globe,
  Sliders,
  Moon,
  Sun,
  RotateCcw,
  Sparkles,
  Compass,
  Check,
  ShieldCheck,
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

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedPersonas,
    setSelectedPersonas,
    language,
    setLanguage,
    theme,
    toggleTheme,
    temperatureUnit,
    setHasCompletedOnboarding,
  } = useAppStore();

  const togglePersona = (id: PersonaId) => {
    if (selectedPersonas.includes(id)) {
      if (selectedPersonas.length > 1) {
        setSelectedPersonas(selectedPersonas.filter((p) => p !== id));
      }
    } else {
      setSelectedPersonas([...selectedPersonas, id]);
    }
  };

  const handleResetOnboarding = () => {
    setHasCompletedOnboarding(false);
    navigate('/onboarding');
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border-subtle">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-heading text-base font-bold text-content-primary">
            Profile & Personalization
          </h1>
          <p className="text-[11px] text-content-muted">
            Configure homepage persona feed, language & telemetry units
          </p>
        </div>
      </div>

      {/* 1. Persona Configuration Manager */}
      <div className="rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold text-content-primary flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-accent-primary" /> Active Personas
          </h3>
          <span className="text-[10px] font-bold text-accent-primary">
            {selectedPersonas.length} Active
          </span>
        </div>
        <p className="text-[11px] text-content-muted">
          Tap chips to toggle which cards rank at the top of your homepage feed.
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {ALL_PERSONAS.map((p) => {
            const isSelected = selectedPersonas.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePersona(p.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 border transition-all ${
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

      {/* 2. Language & Multilingual Selector */}
      <div className="rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-card">
        <h3 className="font-heading text-xs font-bold text-content-primary flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-emerald-500" /> Language & Regional Localization
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code as any)}
              className={`rounded-xl p-2.5 text-left border transition-all ${
                language === lang.code
                  ? 'border-emerald-500 bg-emerald-500/10 font-bold text-content-primary ring-1 ring-emerald-500/30'
                  : 'border-border-subtle bg-card-subtle text-content-secondary hover:bg-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{lang.label}</span>
                {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Theme & Preferences */}
      <div className="rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-card">
        <h3 className="font-heading text-xs font-bold text-content-primary flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-orange-500" /> Display & Telemetry Units
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-card-subtle">
            <span className="font-semibold text-content-primary">Color Theme</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border-subtle font-bold text-content-primary"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-card-subtle">
            <span className="font-semibold text-content-primary">Temperature Units</span>
            <span className="font-mono font-bold text-accent-primary bg-card px-2.5 py-1 rounded-lg border border-border-subtle">
              Celsius (°C)
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-card-subtle">
            <span className="font-semibold text-content-primary">Wind Speed</span>
            <span className="font-mono font-bold text-accent-primary bg-card px-2.5 py-1 rounded-lg border border-border-subtle">
              km/h
            </span>
          </div>
        </div>
      </div>

      {/* 4. SIH Project Metadata Banner */}
      <div className="rounded-2xl border border-border-subtle bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent p-4 space-y-1.5">
        <div className="flex items-center gap-1.5 text-accent-primary font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Smart India Hackathon 2026</span>
        </div>
        <p className="text-[11px] text-content-secondary">
          PS 26076 | Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)
        </p>
        <p className="text-[10px] text-content-muted">
          Mausam+ Prototype Foundation v1.0.0 (Monorepo Architecture)
        </p>
      </div>

      {/* 5. Reset Onboarding Button */}
      <div className="pt-2">
        <Button
          variant="outline"
          fullWidth
          onClick={handleResetOnboarding}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Re-run Onboarding Persona Flow
        </Button>
      </div>
    </div>
  );
};
