import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CARD_REGISTRY, getRankedCardIds } from '../cards/CardRegistry';
import { WeatherConditionIcon } from '@mausam/design-system';
import {
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Layers,
  Sparkles,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const HomePage: React.FC = () => {
  const {
    forecast,
    selectedPersonas,
    cardOrder,
    reorderCards,
    fetchForecast,
    isLoadingForecast,
    setWhyModalCardId,
    activeLocation,
  } = useAppStore();

  const [isReorderMode, setIsReorderMode] = useState(false);
  const [showExploreModal, setShowExploreModal] = useState(false);

  useEffect(() => {
    if (!forecast) {
      fetchForecast(activeLocation.lat, activeLocation.lon, activeLocation.name);
    }
  }, [activeLocation]);

  const activeCardIds = getRankedCardIds(selectedPersonas, cardOrder);

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderCards(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < activeCardIds.length - 1) {
      reorderCards(index, index + 1);
    }
  };

  const currentTemp = forecast?.current.temp_c ?? 28.5;
  const feelsLike = forecast?.current.feels_like_c ?? 31.0;
  const condition = forecast?.current.condition ?? 'Partly Cloudy';

  return (
    <div className="space-y-4 p-4">
      {/* 1. Severe Weather Alert Banner (Collapsible) */}
      <Link
        to="/alert/alert-heat-01"
        className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-orange-500/30 bg-orange-500/10 p-3.5 shadow-sm transition-all hover:bg-orange-500/15 dark:bg-orange-950/30"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Heat-Stress Warning
              </span>
              <span className="h-1 w-1 rounded-full bg-orange-400" />
              <span className="text-[10px] text-content-muted">Valid till 4:30 PM</span>
            </div>
            <p className="truncate text-xs font-bold text-content-primary">
              High thermal strain with 78% humidity.
            </p>
          </div>
        </div>
        <div className="flex items-center text-orange-600 dark:text-orange-400 text-xs font-semibold pl-2">
          <span>Trace</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>

      {/* 2. Ambient Condition Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-transparent p-5 shadow-card dark:from-sky-950/40 dark:via-slate-900/60">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-content-muted uppercase tracking-wider">
              {activeLocation.name}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-5xl font-extrabold text-content-primary tracking-tight">
                {currentTemp}°
              </span>
              <span className="text-sm font-semibold text-content-secondary">
                Feels like {feelsLike}°C
              </span>
            </div>
            <p className="text-sm font-bold text-content-primary mt-1 flex items-center gap-1.5">
              <span>{condition}</span>
              <span className="text-content-muted">•</span>
              <span className="text-xs text-content-muted">H: 32° L: 21°</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <WeatherConditionIcon condition={condition} className="w-14 h-14" />
            <button
              type="button"
              onClick={() => fetchForecast(activeLocation.lat, activeLocation.lon, activeLocation.name)}
              disabled={isLoadingForecast}
              className="flex min-h-[36px] items-center gap-1 text-[11px] font-semibold text-accent-primary hover:underline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingForecast ? 'animate-spin' : ''}`} />
              <span>{isLoadingForecast ? 'Updating...' : 'Synced'}</span>
            </button>
          </div>
        </div>

        {/* Human Context Summary */}
        <div className="mt-3.5 border-t border-border-subtle/50 pt-2.5 flex items-center justify-between">
          <p className="text-xs font-medium text-content-secondary leading-snug">
            <span className="font-bold text-content-primary">Summary: </span>
            Thermal load elevated during midday; expect scattered convective showers by 5:30 PM.
          </p>
        </div>
      </div>

      {/* 3. Section Header & Drag-to-Reorder Toggle */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-content-primary">
            Personalized Feed
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-primary/15 text-accent-primary">
            {selectedPersonas.join(' + ')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsReorderMode(!isReorderMode)}
          className={`flex min-h-[44px] items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition-colors ${
            isReorderMode
              ? 'bg-accent-primary text-white shadow-sm'
              : 'text-content-muted hover:bg-card-subtle hover:text-content-primary'
          }`}
        >
          <GripVertical className="w-4 h-4" />
          <span>{isReorderMode ? 'Done Reordering' : 'Reorder'}</span>
        </button>
      </div>

      {/* 4. Ranked Persona Cards Feed */}
      <div className="space-y-3">
        {forecast && (
          <AnimatePresence>
            {activeCardIds.map((cardId, index) => {
              const cardDef = CARD_REGISTRY[cardId];
              if (!cardDef) return null;
              const CardComp = cardDef.component;

              return (
                <motion.div
                  key={cardId}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  {isReorderMode && (
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-1 bg-card/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-border-strong">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-card-subtle disabled:opacity-30"
                        aria-label="Move card up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === activeCardIds.length - 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-card-subtle disabled:opacity-30"
                        aria-label="Move card down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <CardComp
                    forecast={forecast}
                    onOpenWhyModal={(id) => setWhyModalCardId(id)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* 5. Explore Other Cards Drawer Affordance */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowExploreModal(!showExploreModal)}
          className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-dashed border-border-strong bg-card/40 p-3.5 text-xs font-semibold text-content-muted hover:border-accent-primary hover:text-accent-primary transition-colors"
        >
          <Layers className="w-4 h-4" />
          <span>Explore All 8 Persona Widgets ({Object.keys(CARD_REGISTRY).length} available)</span>
        </button>

        {showExploreModal && (
          <div className="mt-3 space-y-2 rounded-2xl border border-border-subtle bg-card p-4 shadow-card animate-fadeIn">
            <h4 className="font-heading text-xs font-bold text-content-primary">
              All Available Card Modules
            </h4>
            <div className="space-y-1.5 text-xs">
              {Object.values(CARD_REGISTRY).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl bg-card-subtle p-2.5"
                >
                  <div>
                    <p className="font-bold text-content-primary">{c.title}</p>
                    <p className="text-[10px] text-content-muted">{c.description}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-accent-primary">
                    {c.relevantPersonas.join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
