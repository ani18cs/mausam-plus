import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { SavedPlace } from '@mausam/shared-types';
import { Button } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Plane,
  Search,
  MapPin,
  Check,
} from 'lucide-react';

interface PlaceWeather {
  temp_c: number;
  condition: string;
}

export const SavedPlacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { savedPlaces, activeLocation, setActiveLocation, addSavedPlace, removeSavedPlace } = useAppStore();

  const [isAdding, setIsAdding] = useState(false);
  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [placeWeather, setPlaceWeather] = useState<Record<string, PlaceWeather>>({});
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    const loadPlaceWeather = async () => {
      setLoadingWeather(true);
      const results = await Promise.all(
        savedPlaces.map(async (place) => {
          try {
            const response = await fetch(
              `/api/forecast?lat=${place.lat}&lon=${place.lon}&name=${encodeURIComponent(place.name)}`
            );
            if (!response.ok) return null;
            const data = (await response.json()) as { current?: PlaceWeather };
            return data.current ? ([place.id, data.current] as const) : null;
          } catch {
            return null;
          }
        })
      );

      if (isCurrent) {
        setPlaceWeather(
          Object.fromEntries(
            results.filter((result): result is readonly [string, PlaceWeather] => result !== null)
          )
        );
        setLoadingWeather(false);
      }
    };

    void loadPlaceWeather();
    return () => {
      isCurrent = false;
    };
  }, [savedPlaces]);

  const visiblePlaces = savedPlaces.filter((place) =>
    `${place.name} ${place.state} ${place.country}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim()) return;

    const newPlace: SavedPlace = {
      id: `place-${Date.now()}`,
      name: cityName.trim(),
      state: stateName.trim() || 'India',
      country: 'India',
      lat: 19.076,
      lon: 72.8777,
    };

    addSavedPlace(newPlace);
    setCityName('');
    setStateName('');
    setIsAdding(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-xl hover:bg-card-subtle text-content-secondary hover:text-content-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading text-sm font-bold text-content-primary">
              {t('saved_places.title')}
            </h1>
            <p className="text-[10px] text-content-muted">
              {t('saved_places.subtitle')}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          {t('saved_places.add_place')}
        </Button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('saved_places.search_placeholder')}
          className="w-full min-h-[44px] rounded-2xl border border-border-subtle bg-input pl-10 pr-4 text-xs text-content-primary placeholder-content-muted focus:border-accent-primary focus:outline-none"
        />
      </div>

      {/* Add New City Form Modal / Drawer */}
      {isAdding && (
        <form onSubmit={handleAdd} className="rounded-3xl border border-accent-primary/40 bg-card p-4 space-y-3 shadow-lg animate-slideUp">
          <h3 className="font-heading text-xs font-bold text-content-primary">
            {t('saved_places.add_place')}
          </h3>
          <div className="space-y-2">
            <input
              type="text"
              required
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="City Name (e.g. Pune, Jaipur, Chennai)..."
              className="w-full min-h-[40px] rounded-xl border border-border-subtle bg-input px-3 text-xs text-content-primary focus:border-accent-primary focus:outline-none"
            />
            <input
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              placeholder="State / Region (e.g. Maharashtra)..."
              className="w-full min-h-[40px] rounded-xl border border-border-subtle bg-input px-3 text-xs text-content-primary focus:border-accent-primary focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {t('common.save')}
            </Button>
          </div>
        </form>
      )}

      {/* Saved Places List */}
      <div className="space-y-2.5">
        {visiblePlaces.map((place) => {
          const isActive = activeLocation.name.toLowerCase().includes(place.name.toLowerCase());
          const weather = placeWeather[place.id];

          return (
            <div
              key={place.id}
              onClick={() => {
                setActiveLocation({
                  name: place.name,
                  lat: place.lat,
                  lon: place.lon,
                  region: place.state,
                  country: place.country,
                });
              }}
              className={`rounded-2xl p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                isActive
                  ? 'border-accent-primary bg-accent-primary/10 shadow-sm ring-1 ring-accent-primary/30'
                  : 'border-border-subtle bg-card hover:bg-card-subtle'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? 'bg-accent-primary text-white' : 'bg-card-subtle text-content-secondary'}`}>
                  {place.isCurrentLocation ? <MapPin className="w-4 h-4" /> : <Plane className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading text-xs font-bold text-content-primary">
                      {place.name}
                    </h3>
                    {place.isCurrentLocation && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        GPS
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-content-muted">{place.state}, {place.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {weather && (
                  <div className="text-right">
                    <span className="font-heading text-sm font-bold text-content-primary">
                      {weather.temp_c}°C
                    </span>
                    <span className="text-[10px] text-content-muted block">{weather.condition}</span>
                  </div>
                )}

                {isActive ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-primary text-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedPlace(place.id);
                    }}
                    className="p-1.5 rounded-lg text-content-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
