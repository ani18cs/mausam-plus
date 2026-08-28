import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { SavedPlace } from '@mausam/shared-types';
import { Button } from '@mausam/design-system';
import {
  ArrowLeft,
  MapPin,
  Plus,
  Trash2,
  Check,
  Plane,
  Sun,
  CloudRain,
  Navigation,
} from 'lucide-react';

export const SavedPlacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedPlaces, activeLocation, setActiveLocation, addSavedPlace, removeSavedPlace } = useAppStore();

  const [isAdding, setIsAdding] = useState(false);
  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim()) return;

    const newPlace: SavedPlace = {
      id: `place-${Date.now()}`,
      name: cityName.trim(),
      state: stateName.trim() || 'India',
      country: 'India',
      lat: 19.076, // Default coordinate for demonstration
      lon: 72.8777,
    };

    addSavedPlace(newPlace);
    setCityName('');
    setStateName('');
    setIsAdding(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-subtle text-content-primary hover:bg-card focus:outline-none"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading text-base font-bold text-content-primary">
              Saved Destinations
            </h1>
            <p className="text-[11px] text-content-muted">
              Traveler multi-city forecast monitors
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex h-10 items-center gap-1.5 rounded-xl bg-accent-primary px-3 text-white font-bold hover:bg-accent-primary-hover shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Add Destination Form Popover */}
      {isAdding && (
        <form onSubmit={handleAdd} className="rounded-2xl border border-border-strong bg-card p-4 space-y-3 shadow-card animate-fadeIn">
          <h3 className="font-heading font-bold text-xs text-content-primary">
            Add New Saved Destination
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="City Name (e.g. Pune)"
              className="rounded-xl border border-border-subtle bg-input px-3 py-2 text-xs text-content-primary focus:border-accent-primary focus:outline-none"
            />
            <input
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              placeholder="State / Region"
              className="rounded-xl border border-border-subtle bg-input px-3 py-2 text-xs text-content-primary focus:border-accent-primary focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-xl px-3 py-1.5 font-semibold text-content-muted hover:bg-card-subtle"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm">
              Save Destination
            </Button>
          </div>
        </form>
      )}

      {/* Saved Places List */}
      <div className="space-y-2.5">
        {savedPlaces.map((place) => {
          const isCurrent = activeLocation.name.includes(place.name);

          return (
            <div
              key={place.id}
              onClick={() => {
                setActiveLocation({
                  name: `${place.name}, ${place.state}`,
                  lat: place.lat,
                  lon: place.lon,
                  region: place.state,
                  country: place.country,
                });
                navigate('/home');
              }}
              className={`flex items-center justify-between rounded-2xl p-4 border transition-all cursor-pointer ${
                isCurrent
                  ? 'border-accent-primary bg-accent-primary/10 shadow-sm ring-1 ring-accent-primary/30'
                  : 'border-border-subtle bg-card hover:bg-card-subtle'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary flex-shrink-0">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-bold text-content-primary">
                      {place.name}
                    </h3>
                    {isCurrent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-accent-primary text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-content-muted">{place.state}, {place.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-heading text-base font-bold text-content-primary">29°C</span>
                  <span className="text-[10px] text-content-muted block">Clear Sky</span>
                </div>

                {savedPlaces.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedPlace(place.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-content-muted hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                    aria-label={`Remove ${place.name}`}
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
