import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../utils/i18n';
import { MapPin, AlertTriangle, ChevronDown, Check, Sun, Moon, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TopAppBar: React.FC = () => {
  const { t } = useTranslation();
  const { activeLocation, setActiveLocation, savedPlaces, theme, toggleTheme } = useAppStore();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-card/90 backdrop-blur-md transition-colors pt-[var(--sat)]">
      <div className="flex h-14 items-center justify-between px-3 sm:px-4">
        {/* Left: IMD Emblem & Location Selector Dropdown */}
        <div className="relative flex items-center gap-2">
          {/* IMD Emblem Badge */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white font-extrabold text-[11px] shadow-sm flex-shrink-0 border border-white/20">
            IMD
          </div>

          <button
            type="button"
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="flex min-h-[40px] items-center gap-1.5 rounded-xl px-1.5 py-1 transition-colors hover:bg-card-subtle focus:outline-none focus:ring-1 focus:ring-accent-primary"
            aria-expanded={isLocationDropdownOpen}
            aria-label="Change active weather location"
          >
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="font-heading text-sm font-bold text-content-primary truncate max-w-[140px] sm:max-w-[180px]">
                  {activeLocation.name.split(',')[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-content-muted" />
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {t('bar.live_telemetry')}
                </span>
              </div>
            </div>
          </button>

          {/* Location Picker Popover */}
          {isLocationDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsLocationDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-border-strong bg-card p-2 shadow-floating z-50 animate-fadeIn">
                <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-content-muted border-b border-border-subtle mb-1">
                  <span>{t('bar.saved_places')}</span>
                  <Link
                    to="/saved-places"
                    onClick={() => setIsLocationDropdownOpen(false)}
                    className="text-accent-primary hover:underline lowercase font-normal"
                  >
                    manage
                  </Link>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {savedPlaces.map((place) => (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => {
                        setActiveLocation({
                          name: `${place.name}, ${place.state}`,
                          lat: place.lat,
                          lon: place.lon,
                          region: place.state,
                          country: place.country,
                        });
                        setIsLocationDropdownOpen(false);
                      }}
                      className="flex w-full min-h-[40px] items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-content-primary hover:bg-card-subtle transition-colors"
                    >
                      <div>
                        <p>{place.name}</p>
                        <span className="text-[10px] font-normal text-content-muted">{place.state}</span>
                      </div>
                      {activeLocation.lat === place.lat && activeLocation.lon === place.lon && (
                        <Check className="h-4 w-4 text-accent-primary flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Search Cities Shortcut, Active Alert Pulse & Theme Toggle */}
        <div className="flex items-center gap-1">
          <Link
            to="/saved-places"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-content-secondary hover:bg-card-subtle hover:text-content-primary transition-colors"
            aria-label="Search and manage saved cities"
            title="Saved places"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            to="/alert/alert-heat-01"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-orange-500 hover:bg-orange-500/10 transition-colors"
            aria-label="View active weather alerts"
            title="Active warning alert"
          >
            <AlertTriangle className="h-4 w-4 animate-pulse" />
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-content-secondary hover:bg-card-subtle hover:text-content-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-primary"
            aria-label="Toggle dark and light theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};



