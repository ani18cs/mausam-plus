import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MapPin, AlertTriangle, ChevronDown, Check, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TopAppBar: React.FC = () => {
  const { activeLocation, setActiveLocation, savedPlaces, theme, toggleTheme } = useAppStore();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-card/85 backdrop-blur-md transition-colors pt-[var(--sat)]">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left: Location Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="flex min-h-[44px] items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-card-subtle focus:outline-none focus:ring-2 focus:ring-accent-primary"
            aria-expanded={isLocationDropdownOpen}
            aria-label="Change active weather location"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-primary/15 text-accent-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="text-left">
              <span className="block font-heading text-sm font-bold text-content-primary truncate max-w-[170px] sm:max-w-[220px]">
                {activeLocation.name}
              </span>
              <span className="block text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live IMD Feed
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-content-muted" />
          </button>

          {/* Location Picker Popover */}
          {isLocationDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsLocationDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-border-strong bg-card p-2 shadow-floating z-50 animate-fadeIn">
                <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-content-muted border-b border-border-subtle mb-1">
                  Saved Cities
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
                      className="flex w-full min-h-[44px] items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-content-primary hover:bg-card-subtle transition-colors"
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
                <div className="border-t border-border-subtle mt-1 pt-1">
                  <Link
                    to="/saved-places"
                    onClick={() => setIsLocationDropdownOpen(false)}
                    className="block text-center text-xs font-semibold text-accent-primary py-1.5 hover:underline"
                  >
                    + Manage & Add Cities
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Severe Alert Badge & Theme Toggle */}
        <div className="flex items-center gap-1.5">
          <Link
            to="/alert/alert-heat-01"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 p-2 transition-transform hover:scale-105"
            aria-label="View active heat warning alert"
          >
            <AlertTriangle className="h-5 w-5 animate-pulse" />
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-content-secondary hover:bg-card-subtle hover:text-content-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary"
            aria-label="Toggle dark and light theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
