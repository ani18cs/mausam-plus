import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CARD_REGISTRY, getRankedCardIds } from '../cards/CardRegistry';
import { WeatherConditionIcon } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import { formatTemp, formatWind } from '../utils/units';
import {
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Layers,
  ChevronRight,
  RefreshCw,
  Clock,
  TrendingUp,
  TrendingDown,
  HeartPulse,
  Sparkles,
  Droplets,
  Wind,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const {
    forecast,
    selectedPersonas,
    cardOrder,
    reorderCards,
    fetchForecast,
    isLoadingForecast,
    setWhyModalCardId,
    activeLocation,
    allergies,
    temperatureUnit,
    windSpeedUnit,
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

  const rawTemp = forecast?.current.temp_c ?? 28;
  const rawFeels = forecast?.current.feels_like_c ?? 31;
  const rawWind = forecast?.current.wind_kph ?? 14;
  const condition = forecast?.current.condition ?? 'Partly Cloudy';
  const diff = forecast?.extras?.forecast_diff;
  const isDay = forecast?.current.is_day ?? true;

  // Next 8 hours of forecast
  const nextHours = forecast?.hourly?.slice(0, 8) || [];

  // Determine Allergy & Health AI Alerts based on current conditions & user sensitivities
  const aqiVal = forecast?.current.aqi ?? 128;
  const uvVal = forecast?.current.uv_index ?? 7;
  const heatStressScore = forecast?.extras?.heat_stress_index?.score ?? 72;
  const humidityVal = forecast?.current.humidity_pct ?? 58;

  const healthAlerts = [];
  if (allergies.includes('pollen')) {
    healthAlerts.push({
      type: 'pollen',
      title: t('allergy.pollen_high'),
      desc: t('allergy.pollen_desc'),
      icon: '🌸',
      severity: 'warning',
    });
  }
  if (allergies.includes('dust_aqi') && aqiVal > 100) {
    healthAlerts.push({
      type: 'dust_aqi',
      title: t('allergy.dust_aqi'),
      desc: t('allergy.dust_desc'),
      icon: '💨',
      severity: 'caution',
    });
  }
  if (allergies.includes('asthma') && aqiVal > 120) {
    healthAlerts.push({
      type: 'asthma',
      title: t('allergy.asthma'),
      desc: t('allergy.asthma_desc'),
      icon: '🫁',
      severity: 'severe',
    });
  }
  if (allergies.includes('heat_sensitive') && heatStressScore > 65) {
    healthAlerts.push({
      type: 'heat',
      title: t('allergy.heat'),
      desc: t('allergy.heat_desc'),
      icon: '☀️',
      severity: 'warning',
    });
  }
  if (allergies.includes('migraine')) {
    healthAlerts.push({
      type: 'migraine',
      title: t('allergy.migraine'),
      desc: t('allergy.migraine_desc'),
      icon: '⚡',
      severity: 'caution',
    });
  }
  if (allergies.includes('cold_joint_pain') && rawTemp < 20) {
    healthAlerts.push({
      type: 'cold_joint',
      title: t('allergy.cold_joint'),
      desc: t('allergy.cold_joint_desc'),
      icon: '❄️',
      severity: 'caution',
    });
  }
  if (allergies.includes('eye_irritation') && (aqiVal > 150 || uvVal > 8)) {
    healthAlerts.push({
      type: 'eye',
      title: t('allergy.eye'),
      desc: t('allergy.eye_desc'),
      icon: '👁️',
      severity: 'caution',
    });
  }
  if (allergies.includes('elder_infant_care') && (heatStressScore > 70 || rawTemp < 15)) {
    healthAlerts.push({
      type: 'elder_care',
      title: t('allergy.elder_care'),
      desc: t('allergy.elder_care_desc'),
      icon: '👶',
      severity: 'warning',
    });
  }

  return (
    <div className="space-y-4 p-4 max-w-lg mx-auto pb-24">
      {/* 1. Subtle Alert Pill (Only shown if severe weather) */}
      <Link
        to="/alert/alert-heat-01"
        className="flex items-center justify-between rounded-2xl border border-orange-500/25 bg-orange-500/10 px-3.5 py-2.5 text-xs text-orange-600 dark:text-orange-400 transition-all hover:bg-orange-500/15"
      >
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 animate-pulse" />
          <span className="font-semibold truncate">{t('hero.severe_alert')}</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-[11px] flex-shrink-0 pl-2">
          <span>Reason Trace</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </Link>

      {/* 2. Intelligent AI Health & Allergy Advisory Module */}
      {healthAlerts.length > 0 && (
        <div className="rounded-3xl border border-rose-500/25 bg-rose-500/10 dark:bg-rose-950/30 p-4 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400">
                <HeartPulse className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-xs font-bold text-content-primary">
                {t('allergy.title')}
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Active
            </span>
          </div>

          <div className="space-y-2">
            {healthAlerts.slice(0, 3).map((alert, i) => (
              <div
                key={i}
                className="rounded-2xl bg-card/90 p-3 border border-border-subtle flex items-start gap-2.5"
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{alert.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-heading text-xs font-bold text-content-primary">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-content-secondary leading-snug mt-0.5">
                    {alert.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Clean Ambient Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-card/90 p-5 shadow-card backdrop-blur-md dark:bg-card/75">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-content-muted">
                {activeLocation.name}
              </span>
              <button
                type="button"
                onClick={() => fetchForecast(activeLocation.lat, activeLocation.lon, activeLocation.name)}
                disabled={isLoadingForecast}
                className="text-content-muted hover:text-accent-primary transition-colors"
                title="Refresh weather"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingForecast ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-6xl font-extrabold text-content-primary tracking-tighter">
                {formatTemp(rawTemp, temperatureUnit, false)}°
              </span>
              <div className="text-xs text-content-secondary font-medium">
                <p className="font-bold text-content-primary text-sm">{condition}</p>
                <p>{t('hero.feels_like')} {formatTemp(rawFeels, temperatureUnit)}</p>
              </div>
            </div>

            {/* Key Telemetry Quick Row */}
            <div className="flex items-center gap-3 text-[11px] text-content-muted mt-2 font-medium">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-sky-400" />
                {forecast?.current.humidity_pct ?? 57}%
              </span>
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-teal-400" />
                {formatWind(rawWind, windSpeedUnit)}
              </span>
              <span className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" />
                UV {uvVal}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <WeatherConditionIcon condition={condition} isDay={isDay} className="w-16 h-16" />
          </div>
        </div>

        {/* Hourly Forecast Timeline Strip with Weather Icons */}
        {nextHours.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-border-subtle/70">
            <div className="flex items-center justify-between text-[11px] font-semibold text-content-muted mb-2.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-accent-primary" /> {t('hero.hourly_outlook')}
              </span>
              <span>8h Outlook</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {nextHours.map((h, idx) => {
                const hourLabel = idx === 0 ? 'Now' : h.time.split('T')[1]?.slice(0, 5) || h.time;
                const hourCondition = h.condition || condition;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-between min-w-[56px] rounded-xl bg-card-subtle py-2 px-1 text-center"
                  >
                    <span className="text-[10px] font-medium text-content-muted">{hourLabel}</span>
                    <WeatherConditionIcon
                      condition={hourCondition}
                      isDay={idx >= 1 && idx <= 5}
                      className="w-5 h-5 my-1"
                    />
                    <span className="font-heading text-xs font-bold text-content-primary">
                      {formatTemp(h.temp_c, temperatureUnit, false)}°
                    </span>
                    <span className="text-[9px] font-semibold text-sky-500">
                      {h.rain_prob_pct > 0 ? `${h.rain_prob_pct}%` : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* "What Changed?" Integrated Insight Pill */}
        {diff && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-accent-primary-subtle px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              {diff.trend === 'warmer' ? (
                <TrendingUp className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
              )}
              <span className="truncate text-[11px] text-content-secondary">
                <strong className="text-content-primary font-semibold">{t('hero.vs_yesterday')}:</strong> {diff.summary}
              </span>
            </div>
            <span className="text-[10px] font-bold text-accent-primary flex-shrink-0 pl-2">
              {diff.temp_diff_c > 0 ? `+${diff.temp_diff_c}` : diff.temp_diff_c}°
            </span>
          </div>
        )}
      </div>

      {/* 4. Section Header & Reorder Mode */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-content-primary">
            {t('feed.title')}
          </h2>
          <div className="flex gap-1">
            {selectedPersonas.map((p) => (
              <span
                key={p}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-primary-subtle text-accent-primary"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsReorderMode(!isReorderMode)}
          className={`flex min-h-[32px] items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-semibold transition-colors ${
            isReorderMode
              ? 'bg-accent-primary text-white shadow-sm'
              : 'text-content-muted hover:bg-card-subtle hover:text-content-primary'
          }`}
        >
          <GripVertical className="w-3.5 h-3.5" />
          <span>{isReorderMode ? t('feed.done') : t('feed.reorder')}</span>
        </button>
      </div>

      {/* 5. Ranked Persona Cards Feed */}
      <div className="space-y-3.5">
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
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="relative"
                >
                  {isReorderMode && (
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-1 bg-card/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-border-strong">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-card-subtle disabled:opacity-30"
                        aria-label="Move card up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === activeCardIds.length - 1}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-card-subtle disabled:opacity-30"
                        aria-label="Move card down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
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

      {/* 6. Explore Persona Widgets */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowExploreModal(!showExploreModal)}
          className="flex w-full min-h-[40px] items-center justify-center gap-1.5 rounded-2xl border border-border-subtle bg-card/60 p-3 text-xs font-semibold text-content-muted hover:border-accent-primary hover:text-accent-primary transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{showExploreModal ? 'Hide Available Widgets' : `Explore All Widgets (${Object.keys(CARD_REGISTRY).length})`}</span>
        </button>

        {showExploreModal && (
          <div className="mt-2.5 space-y-2 rounded-2xl border border-border-subtle bg-card p-3.5 shadow-card animate-fadeIn">
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



