import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PersonaId } from '@mausam/shared-types';
import { PersonaIcon, Button } from '@mausam/design-system';
import { Check, Sparkles, Compass } from 'lucide-react';

interface PersonaOption {
  id: PersonaId;
  title: string;
  tagline: string;
  details: string;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  {
    id: 'health',
    title: 'Health-Conscious',
    tagline: 'AQI, pollen, UV & respiratory load',
    details: 'Focuses on clean air, allergen alerts, and UV radiation prevention.',
  },
  {
    id: 'fitness',
    title: 'Outdoor Fitness',
    tagline: 'Running hours, heat strain & wind',
    details: 'Calculates optimal workout windows with lowest wet-bulb thermal strain.',
  },
  {
    id: 'beach',
    title: 'Beachgoers & Surfers',
    tagline: 'Tides, wave swell & sea temperature',
    details: 'Tracks coastal tide schedules, surf safety bands, and marine warnings.',
  },
  {
    id: 'traveler',
    title: 'Travelers & Nomads',
    tagline: 'Saved cities, severe alerts & packing',
    details: 'Multi-destination forecasts, travel transit delays, and weather diffs.',
  },
  {
    id: 'family',
    title: 'Parents & Families',
    tagline: 'School commute & rain radar',
    details: 'Early precipitation warnings for morning drop-offs and weekend outings.',
  },
  {
    id: 'agri',
    title: 'Agriculture & Gardeners',
    tagline: 'Soil moisture, frost & rainfall',
    details: 'Actionable crop weather guidance, monsoon tracking, and spray windows.',
  },
  {
    id: 'commuter',
    title: 'Daily Commuters',
    tagline: 'Traffic radar, fog & road flooding',
    details: 'Crowdsourced waterlogging pins and route visibility hazard scores.',
  },
  {
    id: 'events',
    title: 'Event Planners',
    tagline: '7-day comfort matrix & storm odds',
    details: 'Extended precipitation probabilities and outdoor comfort predictability.',
  },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedPersonas, setSelectedPersonas, setHasCompletedOnboarding, fetchForecast } = useAppStore();
  const [selected, setSelected] = useState<PersonaId[]>(selectedPersonas.length > 0 ? selectedPersonas : ['fitness', 'health']);

  const togglePersona = (id: PersonaId) => {
    if (selected.includes(id)) {
      if (selected.length > 1) {
        setSelected(selected.filter((p) => p !== id));
      }
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleFinish = () => {
    setSelectedPersonas(selected);
    setHasCompletedOnboarding(true);
    fetchForecast();
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-5 pt-8 bg-app text-content-primary">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-sm tracking-wider uppercase text-accent-primary">
            Mausam+ Setup
          </span>
        </div>

        <h1 className="font-heading text-2xl font-extrabold text-content-primary tracking-tight">
          How do you experience weather?
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Pick 1 or more personas. Your homepage will rank the most actionable metrics first.
        </p>
      </div>

      {/* 8 Persona Options Grid */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
        {PERSONA_OPTIONS.map((item) => {
          const isChosen = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => togglePersona(item.id)}
              className={`flex items-start gap-3 rounded-2xl p-3.5 text-left border transition-all duration-150 active:scale-[0.98] ${
                isChosen
                  ? 'border-accent-primary bg-accent-primary/10 shadow-sm ring-1 ring-accent-primary/40 dark:bg-sky-950/40'
                  : 'border-border-subtle bg-card/80 hover:bg-card-subtle'
              }`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isChosen ? 'bg-accent-primary text-white shadow-sm' : 'bg-card-subtle'
                }`}
              >
                <PersonaIcon personaId={item.id} className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xs font-bold text-content-primary truncate">
                    {item.title}
                  </h3>
                  {isChosen && (
                    <div className="h-4 w-4 rounded-full bg-accent-primary flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-semibold text-content-secondary mt-0.5">{item.tagline}</p>
                <p className="text-[10px] text-content-muted mt-1 leading-snug">{item.details}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="border-t border-border-subtle pt-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleFinish}
          rightIcon={<Sparkles className="w-4 h-4" />}
        >
          Enter Personalized Mausam+ ({selected.length} Selected)
        </Button>
      </div>
    </div>
  );
};
