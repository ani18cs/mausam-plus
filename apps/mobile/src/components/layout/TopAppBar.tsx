import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../utils/i18n';
import { ChevronDown, Check, Sun, Moon, Search, ChevronLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const TopAppBar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { activeLocation, setActiveLocation, savedPlaces, theme, toggleTheme } = useAppStore();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // Check if current route is one of the root peer tabs
  const isRootTab =
    location.pathname === '/home' ||
    location.pathname === '/alerts' ||
    location.pathname === '/ask' ||
    location.pathname === '/explore' ||
    location.pathname === '/profile';

  // Get title for stack sub-screen dynamically
  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/radar':
        return t('explore.radar_title');
      case '/cyclone':
        return t('explore.cyclone_title');
      case '/specialized':
        return t('explore.specialized_title');
      case '/news':
        return t('explore.news_title');
      case '/saved-places':
        return t('saved_places.title');
      case '/report':
        return t('report.title');
      case '/map':
        return t('nav.map');
      default:
        if (pathname.startsWith('/alert/')) {
          return t('alert_detail.title') || 'Weather Alert Details';
        }
        return 'Mausam+';
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-card/95 backdrop-blur-md transition-colors pt-[var(--sat)]">
      <div className="flex h-14 items-center justify-between px-3 sm:px-4">
        {isRootTab ? (
          /* ROOT PEER TAB HEADER */
          <>
            {/* Left: IMD Emblem & Location Selector Dropdown */}
            <div className="relative flex items-center gap-2">
              <img
                src="/logo.png"
                alt="IMD Official Logo"
                className="h-8 w-auto object-contain drop-shadow-sm flex-shrink-0"
              />

              <button
                type="button"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex min-h-[44px] items-center gap-1.5 rounded-xl px-2 py-1 transition-colors hover:bg-card-subtle focus:outline-none focus:ring-1 focus:ring-accent-primary"
                aria-expanded={isLocationDropdownOpen}
                aria-label="Change active weather location"
              >
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-heading text-sm font-bold text-content-primary truncate max-w-[130px] sm:max-w-[170px]">
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
                  </div>
                </>
              )}
            </div>

            {/* Right: Search Shortcut & Theme Toggle */}
            <div className="flex items-center gap-1">
              <Link
                to="/saved-places"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-content-secondary hover:bg-card-subtle hover:text-content-primary transition-colors"
                aria-label="Search and manage saved cities"
                title="Saved places"
              >
                <Search className="h-4.5 w-4.5" />
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-content-secondary hover:bg-card-subtle hover:text-content-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-primary"
                aria-label="Toggle dark and light theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4.5 w-4.5 text-amber-400" />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-[#3A3A40]" />
                )}
              </button>
            </div>
          </>
        ) : (
          /* STACK SUB-SCREEN HEADER WITH BACK BUTTON */
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-content-primary hover:bg-card-subtle transition-colors focus:outline-none focus:ring-1 focus:ring-accent-primary"
                aria-label="Go back"
                title="Go back"
              >
                <ChevronLeft className="h-6 w-6 stroke-[2.2px]" />
              </button>
              <h1 className="font-heading text-sm font-bold text-content-primary truncate">
                {pageTitle}
              </h1>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-content-secondary hover:bg-card-subtle hover:text-content-primary transition-colors focus:outline-none"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4.5 w-4.5 text-amber-400" />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-[#3A3A40]" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
