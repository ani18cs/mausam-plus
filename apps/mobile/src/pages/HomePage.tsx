import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CARD_REGISTRY, getOptedInCardIds, getUnselectedCardIds } from '../cards/CardRegistry';
import { LottieWeatherGraphic } from '../components/weather/LottieWeatherGraphic';
import { DaysCard } from '../components/weather/DaysCard';
import { RainCard } from '../components/weather/RainCard';
import { ForecastCard } from '../components/weather/ForecastCard';
import { ScheduleCard, ScheduleItem } from '../components/weather/ScheduleCard';
import { WeatherChart } from '../components/weather/WeatherChart';
import { useTranslation } from '../utils/i18n';
import { convertTemp, formatWind } from '../utils/units';
import {
  ArrowUp,
  ArrowDown,
  GripVertical,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  HeartPulse,
  Sparkles,
  Droplets,
  Navigation,
  Sun,
  ShieldAlert,
  Plus,
  Calendar,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function getWeatherHeroImage(condition: string, isDay: boolean): string {
  const norm = (condition || '').toLowerCase();
  if (
    norm.includes('thunder') ||
    norm.includes('storm') ||
    norm.includes('lightning') ||
    norm.includes('squall')
  ) {
    return '/weather/hero_thunder.jpg';
  }
  if (
    norm.includes('rain') ||
    norm.includes('drizzle') ||
    norm.includes('shower') ||
    norm.includes('precipitation')
  ) {
    return '/weather/hero_rain.jpg';
  }
  if (
    norm.includes('cloud') ||
    norm.includes('overcast') ||
    norm.includes('fog') ||
    norm.includes('haze') ||
    norm.includes('mist')
  ) {
    return '/weather/hero_cloudy.jpg';
  }
  if (!isDay) {
    return '/weather/hero_night.jpg';
  }
  return '/weather/hero_sunny.jpg';
}

function getUpdatedTimeText(fetchedAt?: string): string {
  if (!fetchedAt) return 'Updated just now';
  const diffMs = Math.max(0, Date.now() - new Date(fetchedAt).getTime());
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Updated just now';
  return `Updated ${diffMins}m ago`;
}

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
  const rawWind = forecast?.current.wind_kph ?? 14;
  const windDirDeg = forecast?.current.wind_dir_deg ?? 180;
  const condition = forecast?.current.condition ?? 'Partly Cloudy';
  const diff = forecast?.extras?.forecast_diff;
  const isDay = forecast?.current.is_day ?? true;

  // Clean diff summary without markdown asterisks
  const cleanDiffSummary = (diff?.summary || '').replace(/\*\*/g, '');

  // City & Country formatting
  const locationParts = (activeLocation.name || 'Bengaluru, Karnataka').split(',');
  const cityName = locationParts[0]?.trim() || activeLocation.name;
  const regionName = locationParts.slice(1).join(',').trim() || activeLocation.country || 'India';

  // Date formatting for top badge (e.g. THU / 06)
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dayNum = String(now.getDate()).padStart(2, '0');

  // Weather Hero Image matching condition
  const heroImage = getWeatherHeroImage(condition, isDay);

  // Next 12 hours for smooth animated curve chart
  const nextHours = forecast?.hourly?.slice(0, 12) || [];
  const chartData = nextHours.map((h, i) => ({
    time: i === 0 ? 'Now' : h.time.split('T')[1]?.slice(0, 5) || h.time,
    temp: Math.round(convertTemp(h.temp_c, temperatureUnit)),
    rain: h.rain_prob_pct || 0,
  }));

  // Smart daily schedule items
  const scheduleItems: ScheduleItem[] = [
    {
      id: '1',
      title: 'Morning Cardio & Outdoor Workout',
      category: 'workout',
      timeSlot: forecast?.extras?.running_window?.optimal_time_slot || '05:30 AM - 07:15 AM',
      status: (forecast?.extras?.running_window?.score ?? 80) >= 70 ? 'optimal' : 'caution',
      summary: forecast?.extras?.running_window?.reason || 'Optimal thermal comfort with zero solar UV strain.',
    },
    {
      id: '2',
      title: 'Peak Solar UV Radiation Window',
      category: 'uv',
      timeSlot: '11:30 AM - 03:30 PM',
      status: (forecast?.current.uv_index ?? 6) >= 7 ? 'caution' : 'optimal',
      summary: `Current UV Index is ${forecast?.current.uv_index ?? 6}. Apply SPF sunscreen if heading outdoors.`,
    },
    {
      id: '3',
      title: 'Evening Transit & Commute Radar',
      category: 'commute',
      timeSlot: '05:00 PM - 07:30 PM',
      status: (forecast?.hourly?.[17]?.rain_prob_pct ?? 20) >= 50 ? 'warning' : 'optimal',
      summary: (forecast?.hourly?.[17]?.rain_prob_pct ?? 20) >= 50
        ? 'Rain shower probability elevated during commute hours.'
        : 'All major arterial roads and transit corridors clear.',
    },
  ];

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
    <div className="space-y-5 max-w-md mx-auto pb-28">
      {/* ═══════════════════════════════════════════════════════════════════
          1. PHOTOREALISTIC ATMOSPHERIC WEATHER HERO SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-b-[36px] shadow-xl">
        {/* Photorealistic Cinematic Background Frame */}
        <div
          className="relative min-h-[220px] sm:min-h-[240px] bg-cover bg-center flex flex-col justify-between p-5 transition-all duration-700"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Contrast Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" />

          {/* Top Bar: Active Alerts if Present (No redundant Location pill) */}
          <div className="relative z-10 flex items-center justify-end pt-1">
            {activeAlertCount > 0 && (
              <Link
                to="/alerts"
                className="flex items-center gap-1.5 rounded-full bg-rose-500/95 text-white px-3 py-1 text-[11px] font-bold shadow-lg backdrop-blur-md border border-white/20 animate-pulse"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{activeAlertCount} Active Warnings</span>
              </Link>
            )}
          </div>

          {/* City / District & Region Heading */}
          <div className="relative z-10 space-y-0.5 pb-8">
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              {cityName}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
              {regionName}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            Attached Weather Details Sheet Card (Seamless Integration)
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 -mt-7 rounded-t-[32px] sm:rounded-t-[36px] bg-card border-t border-border-subtle p-5 pt-4 space-y-4 shadow-2xl">
          {/* Top Metadata Row: 'Updated 12m ago' & Day/Date Badge */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-content-muted">
              {getUpdatedTimeText(forecast?.meta?.fetched_at)}
            </span>

            <div className="text-right">
              <span className="block text-[10px] font-black uppercase tracking-wider text-content-muted leading-none">
                {dayName}
              </span>
              <span className="block text-xs font-black text-content-primary leading-tight">
                {dayNum}
              </span>
            </div>
          </div>

          {/* Weather Condition Title */}
          <div>
            <h2 className="font-heading text-2xl font-black text-content-primary tracking-tight">
              {condition}
            </h2>
          </div>

          {/* Temperature & Micro-Graphic Presentation with Refresh Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Cute Weather Animated Graphic */}
              <div className="flex-shrink-0">
                <LottieWeatherGraphic condition={condition} isDay={isDay} size="md" />
              </div>

              {/* Large Modern Proper Temperature Numeral */}
              <div className="flex items-baseline">
                <span className="font-heading text-6xl sm:text-7xl font-black tracking-tighter text-content-primary select-none drop-shadow-sm">
                  {Math.round(convertTemp(rawTemp, temperatureUnit))}
                </span>
                <span className="font-heading text-3xl font-extrabold text-accent-primary ml-1 -translate-y-3">
                  °{temperatureUnit === 'fahrenheit' ? 'F' : 'C'}
                </span>
              </div>
            </div>

            {/* Quick Refresh Button */}
            <button
              type="button"
              onClick={() => fetchForecast(activeLocation.lat, activeLocation.lon, activeLocation.name)}
              disabled={isLoadingForecast}
              className="h-10 w-10 rounded-full bg-accent-primary/10 hover:bg-accent-primary text-accent-primary hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-90"
              title="Refresh weather"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingForecast ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* "What Changed?" 1-Line Insight (Clean text without raw asterisks) */}
          {diff && (
            <div className="flex items-center gap-2 text-xs text-content-secondary bg-card-subtle/70 p-3 rounded-2xl border border-border-subtle/70">
              {diff.trend === 'warmer' ? (
                <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-4 h-4 text-sky-500 flex-shrink-0" />
              )}
              <span className="truncate text-[11px]">
                <strong className="text-content-primary font-semibold">
                  {t('hero.vs_yesterday') || 'vs Yesterday'}:
                </strong>{' '}
                {cleanDiffSummary}
              </span>
            </div>
          )}

          {/* 3 Core Environmental Metrics Quick-Pills */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
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
                />{' '}
                Wind
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. BELOW THE FOLD: COMPLETE WEATHER TABS & INFORMATIONAL SUITE
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="px-3.5 sm:px-4 space-y-5">
        {/* A. Hourly Forecast Timeline Strip (Next 12 Hours) */}
        {forecast?.hourly && forecast.hourly.length > 0 && (
          <div className="rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-xs font-bold text-content-primary">
                  Hourly Forecast Timeline
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-content-muted">
                Next 12 Hours
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {forecast.hourly.slice(0, 12).map((h, idx) => {
                const rawHour = h.time.split('T')[1] || h.time;
                const timeFormatted = idx === 0 ? 'Now' : rawHour.slice(0, 5);
                return (
                  <ForecastCard
                    key={h.time || idx}
                    time={timeFormatted}
                    condition={h.condition || condition}
                    tempC={h.temp_c}
                    temperatureUnit={temperatureUnit}
                    isCurrent={idx === 0}
                    rainProbPct={h.rain_prob_pct}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* B. Next 7 Days Multi-Day Meteorological Forecast */}
        {forecast?.daily && forecast.daily.length > 0 && (
          <div className="rounded-3xl border border-border-subtle bg-card p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-xs font-bold text-content-primary">
                  7-Day Meteorological Outlook
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-content-muted">
                High / Low Divided
              </span>
            </div>

            {/* Days Card Vertical Stack */}
            <div className="space-y-2 pt-1">
              {forecast.daily.map((day, idx) => (
                <DaysCard
                  key={day.date}
                  day={day}
                  dayIndex={idx}
                  temperatureUnit={temperatureUnit}
                  isToday={idx === 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* C. Precipitation / Rain Probability Radar */}
        {forecast?.hourly && (
          <RainCard hourly={forecast.hourly} />
        )}

        {/* D. Interactive 12-Hour Weather Telemetry Curve Chart */}
        {chartData.length > 0 && (
          <WeatherChart data={chartData} temperatureUnit={temperatureUnit} />
        )}

        {/* E. Smart Circadian Activity & Commute Schedule */}
        <ScheduleCard items={scheduleItems} />

        {/* F. Personalized Health & Vulnerability Alerts */}
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
