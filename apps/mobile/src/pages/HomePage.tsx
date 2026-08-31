import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CARD_REGISTRY, getOptedInCardIds, getUnselectedCardIds } from '../cards/CardRegistry';
import { LottieWeatherGraphic } from '../components/weather/LottieWeatherGraphic';
import { useTranslation } from '../utils/i18n';
import { formatTemp, formatWind } from '../utils/units';
import {
  ArrowUp,
  ArrowDown,
  GripVertical,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Clock,
  TrendingUp,
  TrendingDown,
  HeartPulse,
  Sparkles,
  Droplets,
  Navigation,
  Sun,
  ShieldAlert,
  Plus,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const {
    forecast,
    selectedPersonas,
    cardOrder,
    pinnedCardIds,
    pinCardToHome,
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
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [activeAlertCount, setActiveAlertCount] = useState<number>(0);

  useEffect(() => {
    if (!forecast) {
      fetchForecast(activeLocation.lat, activeLocation.lon, activeLocation.name);
    }
  }, [activeLocation]);

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const res = await fetch('/api/imd/overview');
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setActiveAlertCount(
              (json.data.activeNowcastsCount ?? 0) + (json.data.criticalWarningsCount ?? 0)
            );
          }
        }
      } catch {
        // Silently fail
      }
    };
    fetchAlertCount();
  }, []);

  const optedInCardIds = getOptedInCardIds(selectedPersonas, cardOrder, pinnedCardIds);
  const unselectedCardIds = getUnselectedCardIds(selectedPersonas, pinnedCardIds);

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderCards(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < optedInCardIds.length - 1) {
      reorderCards(index, index + 1);
    }
  };

  const rawTemp = forecast?.current.temp_c ?? 28;
  const rawFeels = forecast?.current.feels_like_c ?? 31;
  const rawWind = forecast?.current.wind_kph ?? 14;
  const windDirDeg = forecast?.current.wind_dir_deg ?? 180;
  const condition = forecast?.current.condition ?? 'Partly Cloudy';
  const diff = forecast?.extras?.forecast_diff;
  const isDay = forecast?.current.is_day ?? true;

  // Next 12 hours for smooth animated curve chart
  const nextHours = forecast?.hourly?.slice(0, 12) || [];
  const chartData = nextHours.map((h, i) => ({
    time: i === 0 ? 'Now' : h.time.split('T')[1]?.slice(0, 5) || h.time,
    temp: Math.round(h.temp_c),
    rain: h.rain_prob_pct || 0,
  }));

  // Health alerts
  const aqiVal = forecast?.current.aqi ?? 128;
  const heatStressScore = forecast?.extras?.heat_stress_index?.score ?? 72;

  const healthAlerts: Array<{ type: string; title: string; desc: string; icon: string }> = [];
  if (allergies.includes('pollen')) {
    healthAlerts.push({
      type: 'pollen',
      title: t('allergy.pollen_high') || 'High Pollen Count',
      desc: t('allergy.pollen_desc') || 'Grass & weed counts elevated.',
      icon: '🌸',
    });
  }
  if (allergies.includes('dust_aqi') && aqiVal > 100) {
    healthAlerts.push({
      type: 'dust_aqi',
      title: t('allergy.dust_aqi') || 'PM2.5 Dust Warning',
      desc: t('allergy.dust_desc') || 'Particulate matter exceeds safe thresholds.',
      icon: '💨',
    });
  }
  if (allergies.includes('asthma') && aqiVal > 120) {
    healthAlerts.push({
      type: 'asthma',
      title: t('allergy.asthma') || 'Asthma Sensitivity Alert',
      desc: t('allergy.asthma_desc') || 'Airway strain elevated. Carry inhaler.',
      icon: '🫁',
    });
  }
  if (allergies.includes('heat_sensitive') && heatStressScore > 65) {
    healthAlerts.push({
      type: 'heat',
      title: t('allergy.heat') || 'Extreme Heat Caution',
      desc: t('allergy.heat_desc') || 'High wet-bulb temp. Avoid midday sun.',
      icon: '☀️',
    });
  }

  return (
    <div className="space-y-6 max-w-md mx-auto pb-28">
      {/* ═══════════════════════════════════════════════════════════════════
          1. FULL-VIEWPORT HERO TILE (Google Weather Style "Wow" Moment)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-[calc(100vh-140px)] flex flex-col justify-between p-4 sm:p-5 rounded-b-3xl bg-gradient-to-b from-card via-card to-card-subtle/80 border-b border-border-subtle shadow-card relative overflow-hidden">
        {/* Top: Location & Severe Alert Badge */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-sm sm:text-base font-extrabold text-content-primary truncate max-w-[220px]">
                {activeLocation.name}
              </h1>
              <button
                type="button"
                onClick={() => fetchForecast(activeLocation.lat, activeLocation.lon, activeLocation.name)}
                disabled={isLoadingForecast}
                className="text-content-muted hover:text-accent-primary transition-colors p-1"
                title="Refresh weather"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingForecast ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Severity Alert Pill if Active */}
            {activeAlertCount > 0 && (
              <Link
                to="/alerts"
                className="flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 animate-pulse hover:bg-amber-500/25 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{activeAlertCount} Warnings</span>
              </Link>
            )}
          </div>

          {/* "What Changed?" 1-Line Insight */}
          {diff && (
            <div className="flex items-center gap-1.5 text-xs text-content-secondary">
              {diff.trend === 'warmer' ? (
                <TrendingUp className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
              )}
              <span className="truncate text-[11px]">
                <strong className="text-content-primary font-semibold">{t('hero.vs_yesterday') || 'vs Yesterday'}:</strong> {diff.summary}
              </span>
            </div>
          )}
        </div>

        {/* Center: Animated Weather Graphic + Hero Temperature Scale */}
        <div className="my-auto flex flex-col items-center justify-center text-center py-4">
          <LottieWeatherGraphic
            condition={condition}
            isDay={isDay}
            size="hero"
            className="mb-2"
          />

          {/* Hero Numeral with exact Unicode degree symbol */}
          <div className="flex items-start justify-center">
            <span className="font-heading text-7xl sm:text-8xl font-black text-content-primary tracking-tighter leading-none">
              {formatTemp(rawTemp, temperatureUnit, false)}
            </span>
            <span className="font-heading text-4xl sm:text-5xl font-bold text-accent-primary ml-1 -mt-1">
              °{temperatureUnit === 'fahrenheit' ? 'F' : 'C'}
            </span>
          </div>

          <div className="mt-2 space-y-0.5">
            <p className="font-heading text-lg font-extrabold text-content-primary tracking-tight">
              {condition}
            </p>
            <p className="text-xs font-medium text-content-muted">
              {t('hero.feels_like') || 'Feels like'} {formatTemp(rawFeels, temperatureUnit)}
            </p>
          </div>
        </div>

        {/* Bottom: 3 Core Environmental Quick-Pills & Scroll Cue */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-card-subtle p-2.5 border border-border-subtle/50 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-content-muted flex items-center gap-1">
                <Droplets className="w-3 h-3 text-sky-400" /> Humidity
              </span>
              <span className="font-heading text-sm font-extrabold text-content-primary mt-0.5">
                {forecast?.current.humidity_pct ?? 57}%
              </span>
            </div>

            <div className="rounded-2xl bg-card-subtle p-2.5 border border-border-subtle/50 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-content-muted flex items-center gap-1">
                <Navigation
                  className="w-3 h-3 text-teal-400 transition-transform duration-500"
                  style={{ transform: `rotate(${windDirDeg}deg)` }}
                /> Wind
              </span>
              <span className="font-heading text-sm font-extrabold text-content-primary mt-0.5">
                {formatWind(rawWind, windSpeedUnit)}
              </span>
            </div>

            <div className="rounded-2xl bg-card-subtle p-2.5 border border-border-subtle/50 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-content-muted flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" /> UV Index
              </span>
              <span className="font-heading text-sm font-extrabold text-content-primary mt-0.5">
                {forecast?.current.uv_index ?? 7}
              </span>
            </div>
          </div>

          {/* Animated Scroll Down Indicator Cue */}
          <div className="flex flex-col items-center justify-center text-center text-[10px] font-bold text-content-muted animate-bounce pt-1">
            <span>Scroll for Persona Feed</span>
            <ChevronDown className="w-3.5 h-3.5 text-accent-primary" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. BELOW THE FOLD: HOURLY AREA CHART & EXTENDED OUTLOOK
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="px-3.5 sm:px-4 space-y-5">
        {/* Hourly Smooth Animated Area Chart */}
        {chartData.length > 0 && (
          <div className="rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-content-primary">
                <Clock className="w-4 h-4 text-accent-primary" />
                <span>{t('hero.hourly_outlook') || '12-Hour Telemetry Curve'}</span>
              </div>
              <span className="text-[10px] font-bold text-accent-primary">
                Temp (°C) &amp; Rain (%)
              </span>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '11px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    name="Temp (°C)"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tempGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="rain"
                    name="Rain (%)"
                    stroke="#0284c7"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    fillOpacity={1}
                    fill="url(#rainGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Health Alert Modules if Triggered */}
        {healthAlerts.length > 0 && (
          <div className="rounded-3xl border border-rose-500/25 bg-rose-500/10 p-3.5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400">
                  <HeartPulse className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-heading text-xs font-bold text-content-primary">
                  {t('allergy.title') || 'Personal Health Alerts'}
                </h3>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AI Guard
              </span>
            </div>

            <div className="space-y-1.5">
              {healthAlerts.slice(0, 2).map((alert, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-card p-2.5 border border-border-subtle flex items-start gap-2"
                >
                  <span className="text-lg flex-shrink-0">{alert.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading text-xs font-bold text-content-primary">
                      {alert.title}
                    </h4>
                    <p className="text-[10px] text-content-secondary leading-snug">
                      {alert.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            3. OPTED-IN PERSONA CARDS (Tight, high-signal feed of 4-6 cards)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-content-primary">
                {t('feed.title') || 'Personalized Feed'}
              </h2>
              <div className="flex gap-1">
                {selectedPersonas.map((p) => (
                  <span
                    key={p}
                    className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-accent-primary-subtle text-accent-primary capitalize"
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
              <span>{isReorderMode ? t('feed.done') || 'Done' : t('feed.reorder') || 'Reorder'}</span>
            </button>
          </div>

          {/* Cards Loop */}
          <div className="space-y-3">
            {forecast && (
              <AnimatePresence>
                {optedInCardIds.map((cardId, index) => {
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
                            disabled={index === optedInCardIds.length - 1}
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
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            4. "MORE CATEGORIES" COLLAPSED SECTION (Two-Way Personalization)
        ═══════════════════════════════════════════════════════════════════ */}
        {unselectedCardIds.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowMoreCategories(!showMoreCategories)}
              className="flex w-full min-h-[44px] items-center justify-between rounded-2xl border border-border-subtle bg-card p-3.5 text-xs font-semibold text-content-secondary hover:text-content-primary hover:border-accent-primary transition-all"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-accent-primary" />
                <span>More Categories ({unselectedCardIds.length} Available)</span>
              </div>
              {showMoreCategories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showMoreCategories && (
              <div className="mt-3 space-y-3 animate-slideDown">
                <p className="text-[11px] text-content-muted px-1">
                  Tap &quot;Pin to Home&quot; on any card below to add it to your daily feed.
                </p>
                {forecast &&
                  unselectedCardIds.map((cardId) => {
                    const cardDef = CARD_REGISTRY[cardId];
                    if (!cardDef) return null;
                    const CardComp = cardDef.component;

                    return (
                      <div key={cardId} className="relative rounded-3xl border border-border-subtle/80 bg-card/60 p-1">
                        <div className="flex justify-end p-2 pb-0">
                          <button
                            type="button"
                            onClick={() => pinCardToHome(cardId)}
                            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hover shadow-sm transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Pin to Home</span>
                          </button>
                        </div>
                        <CardComp
                          forecast={forecast}
                          onOpenWhyModal={(id) => setWhyModalCardId(id)}
                        />
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
