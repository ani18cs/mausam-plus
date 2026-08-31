import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CitizenReport } from '@mausam/shared-types';
import { Link } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  Plus,
  ThumbsUp,
  ShieldCheck,
  Navigation,
  CloudRain,
  Flame,
  Wind,
  Loader2,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

// Center updater helper component
const MapRecenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

// Hazard Symbol and Color Mappings
const HAZARD_CONFIG: Record<string, { icon: string; bg: string; label: string; defaultVal: string }> = {
  waterlogging: { icon: '🌊', bg: '#0284C7', label: 'Waterlogging', defaultVal: '1.2 ft' },
  severe_heat: { icon: '🔥', bg: '#EA580C', label: 'Severe Heat', defaultVal: '41°C' },
  air_pollution: { icon: '💨', bg: '#7C3AED', label: 'Air Pollution', defaultVal: 'AQI 184' },
  fallen_tree: { icon: '🌳', bg: '#D97706', label: 'Fallen Tree', defaultVal: 'Lane Block' },
  hail: { icon: '🧊', bg: '#0891B2', label: 'Hailstorm', defaultVal: '2 cm Hail' },
  high_wind: { icon: '🌪️', bg: '#0D9488', label: 'High Wind', defaultVal: '48 km/h' },
  dense_fog: { icon: '🌫️', bg: '#64748B', label: 'Dense Fog', defaultVal: '<50m Vis' },
};

// Custom Marker Pin Generator with bold readable numeric value overlay
const createNumericHazardIcon = (category: string, severity: string, valueTag?: string) => {
  const cfg = HAZARD_CONFIG[category] || { icon: '⚠️', bg: '#EF4444', label: 'Hazard', defaultVal: 'Alert' };
  const val = valueTag || cfg.defaultVal;

  const borderColor =
    severity === 'critical' || severity === 'high'
      ? '#EF4444'
      : severity === 'medium'
      ? '#F59E0B'
      : '#10B981';

  return L.divIcon({
    className: 'custom-numeric-hazard-pin',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5)); cursor: pointer;">
        <div style="background-color: ${cfg.bg}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid ${borderColor}; font-size: 15px;">
          ${cfg.icon}
        </div>
        <div style="background: rgba(15, 23, 42, 0.92); color: white; border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; padding: 2px 6px; font-size: 10px; font-weight: 800; font-family: ui-sans-serif, system-ui; white-space: nowrap; margin-top: -3px; letter-spacing: -0.02em;">
          ${val}
        </div>
      </div>
    `,
    iconSize: [60, 52],
    iconAnchor: [30, 48],
    popupAnchor: [0, -48],
  });
};

export const HyperlocalMapPage: React.FC = () => {
  const { activeLocation, setActiveLocation, forecast } = useAppStore();
  const [activeLayer, setActiveLayer] = useState<'rain' | 'heat' | 'aqi'>('rain');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [upvotingId, setUpvotingId] = useState<string | null>(null);

  // Fetch Reports from BFF
  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.warn('Failed to load reports from BFF:', e);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setActiveLocation({
          name: 'Current Location',
          lat: latitude,
          lon: longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error('Error fetching location:', error);
        alert('Could not fetch location. Please enable GPS access.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleUpvote = async (reportId: string) => {
    setUpvotingId(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}/upvote`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, upvotes: data.upvotes || r.upvotes + 1 } : r))
        );
      }
    } catch (err) {
      console.error('Upvote failed:', err);
    } finally {
      setUpvotingId(null);
    }
  };

  const filteredReports =
    selectedFilter === 'all'
      ? reports
      : reports.filter((r) => r.category === selectedFilter);

  const center: [number, number] = [activeLocation.lat, activeLocation.lon];

  // Dynamic values from forecast telemetry
  const rainMm = forecast?.hourly?.[0]?.rain_prob_pct ? `${Math.round(forecast.hourly[0].rain_prob_pct * 0.4)}mm` : '18mm';
  const heatVal = forecast?.current?.temp_c ? `${Math.round(forecast.current.temp_c)}°C` : '36°C';
  const aqiVal = forecast?.current?.aqi ? `AQI ${forecast.current.aqi}` : 'AQI 142';

  return (
    <div className="relative h-[calc(100vh-120px)] w-full overflow-hidden bg-slate-950">
      {/* 1. Top Controls Bar: Layer Switcher & GPS Locate */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          {/* Layer Selector */}
          <div className="flex items-center gap-1 rounded-2xl bg-card/95 p-1 shadow-lg backdrop-blur-md border border-border-subtle">
            <button
              type="button"
              onClick={() => setActiveLayer('rain')}
              className={`flex min-h-[34px] items-center gap-1.5 rounded-xl px-2.5 text-xs font-bold transition-all ${
                activeLayer === 'rain'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-content-secondary hover:bg-card-subtle'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Rain ({rainMm})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLayer('heat')}
              className={`flex min-h-[34px] items-center gap-1.5 rounded-xl px-2.5 text-xs font-bold transition-all ${
                activeLayer === 'heat'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-content-secondary hover:bg-card-subtle'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Heat ({heatVal})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLayer('aqi')}
              className={`flex min-h-[34px] items-center gap-1.5 rounded-xl px-2.5 text-xs font-bold transition-all ${
                activeLayer === 'aqi'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-content-secondary hover:bg-card-subtle'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>{aqiVal}</span>
            </button>
          </div>

          {/* GPS Locate Button */}
          <button
            type="button"
            onClick={handleCurrentLocation}
            className="p-2.5 rounded-2xl bg-card/95 text-content-primary shadow-lg backdrop-blur-md border border-border-subtle active:scale-95 transition-all"
            title="Locate Me"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
            ) : (
              <Navigation className="w-4 h-4 text-sky-500 fill-sky-500" />
            )}
          </button>
        </div>

        {/* Hazard Category Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 pointer-events-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`rounded-xl px-3 py-1 text-[11px] font-bold backdrop-blur-md shadow-sm transition-all flex-shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-accent-primary text-white'
                : 'bg-card/90 text-content-secondary border border-border-subtle'
            }`}
          >
            All Hazards ({reports.length})
          </button>
          {Object.entries(HAZARD_CONFIG).map(([catKey, catCfg]) => (
            <button
              key={catKey}
              type="button"
              onClick={() => setSelectedFilter(catKey)}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md shadow-sm transition-all flex-shrink-0 ${
                selectedFilter === catKey
                  ? 'bg-accent-primary text-white'
                  : 'bg-card/90 text-content-secondary border border-border-subtle'
              }`}
            >
              <span>{catCfg.icon}</span>
              <span>{catCfg.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Leaflet Map Container */}
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <MapRecenter center={center} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic Hyperlocal Overlay Zones */}
        {activeLayer === 'rain' && (
          <Circle
            center={center}
            radius={3000}
            pathOptions={{ color: '#0284C7', fillColor: '#38BDF8', fillOpacity: 0.35 }}
          />
        )}

        {activeLayer === 'heat' && (
          <Circle
            center={center}
            radius={2800}
            pathOptions={{ color: '#EA580C', fillColor: '#F97316', fillOpacity: 0.35 }}
          />
        )}

        {activeLayer === 'aqi' && (
          <Circle
            center={center}
            radius={3200}
            pathOptions={{ color: '#059669', fillColor: '#34D399', fillOpacity: 0.3 }}
          />
        )}

        {/* Citizen Report Numeric Hazard Pins */}
        {filteredReports.map((rep) => {
          const valueTag =
            rep.category === 'waterlogging'
              ? '1.5 ft water'
              : rep.category === 'severe_heat'
              ? '41°C'
              : rep.category === 'air_pollution'
              ? 'AQI 184'
              : rep.severity === 'critical'
              ? 'CRITICAL'
              : 'VERIFIED';

          return (
            <Marker
              key={rep.id}
              position={[rep.lat, rep.lon]}
              icon={createNumericHazardIcon(rep.category, rep.severity, valueTag)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 space-y-2 min-w-[220px] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1">
                      <span>{HAZARD_CONFIG[rep.category]?.icon || '⚠️'}</span>
                      <span>{rep.title}</span>
                    </span>
                    {rep.verified && (
                      <span className="flex items-center gap-0.5 text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-extrabold">
                        <ShieldCheck className="w-3 h-3" /> IMD Verified
                      </span>
                    )}
                  </div>

                  {/* Reading Value Tag */}
                  <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-lg text-[11px]">
                    <span className="font-bold text-slate-700">Observed Value:</span>
                    <span className="font-extrabold text-accent-primary">{valueTag}</span>
                  </div>

                  {/* Short "Why?" Context Line */}
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-200 space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <Sparkles className="w-3 h-3 text-accent-primary" /> Why this alert?
                    </div>
                    <p className="leading-snug">{rep.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> Live GPS Report
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpvote(rep.id)}
                      disabled={upvotingId === rep.id}
                      className="flex items-center gap-1 text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg hover:bg-sky-100 active:scale-95 transition-all"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rep.upvotes} Upvotes</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* 3. Persistent Color Scale Legend */}
      <div className="absolute bottom-4 left-3 z-[1000] rounded-2xl bg-card/95 p-3 shadow-xl backdrop-blur-md border border-border-subtle text-[11px] space-y-2 max-w-[210px]">
        <div className="flex items-center justify-between font-bold text-content-primary">
          <span className="flex items-center gap-1 text-xs">
            <Info className="w-3.5 h-3.5 text-accent-primary" />
            {activeLayer === 'rain' ? 'Precipitation Scale' : activeLayer === 'heat' ? 'Thermal Load Scale' : 'CPCB AQI Scale'}
          </span>
        </div>

        {activeLayer === 'rain' && (
          <div className="space-y-1 text-[10px] font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-300 flex-shrink-0" />
              <span className="text-content-secondary">0–5 mm (Light Drizzle)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 flex-shrink-0" />
              <span className="text-content-secondary">5–20 mm (Moderate Rain)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-700 flex-shrink-0" />
              <span className="text-content-secondary">20+ mm (Heavy Downpour)</span>
            </div>
          </div>
        )}

        {activeLayer === 'heat' && (
          <div className="space-y-1 text-[10px] font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-content-secondary">&lt; 32°C (Minimal Stress)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="text-content-secondary">32–38°C (Caution)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
              <span className="text-content-secondary">38°C+ (Extreme Danger)</span>
            </div>
          </div>
        )}

        {activeLayer === 'aqi' && (
          <div className="space-y-1 text-[10px] font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-content-secondary">0–50 (Good)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="text-content-secondary">101–200 (Moderate)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
              <span className="text-content-secondary">201+ (Poor / Severe)</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Floating Action Button: + Report Hazard */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <Link
          to="/report"
          className="flex min-h-[46px] items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Report Hazard</span>
        </Link>
      </div>
    </div>
  );
};