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
  Layers,
  Plus,
  ThumbsUp,
  ShieldCheck,
  Navigation,
  CloudRain,
  Flame,
  Wind,
} from 'lucide-react';

// Fix Leaflet standard default icon URL issue in React/Vite
const createCustomIcon = (category: string, severity: string) => {
  const color =
    severity === 'high' || severity === 'critical'
      ? '#EF4444'
      : severity === 'medium'
      ? '#F59E0B'
      : '#10B981';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 13px; font-weight: bold;">
      📍
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

export const HyperlocalMapPage: React.FC = () => {
  const { activeLocation } = useAppStore();
  const [activeLayer, setActiveLayer] = useState<'rain' | 'heat' | 'aqi'>('rain');
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/reports');
        if (res.ok) {
          const data = await res.json();
          setReports(data.reports || []);
        }
      } catch (e) {
        console.warn('Failed to load reports from BFF, using sample pins.', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const center: [number, number] = [activeLocation.lat, activeLocation.lon];

  return (
    <div className="relative h-[calc(100vh-120px)] w-full overflow-hidden">
      {/* 1. Map Layer Toggle Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 rounded-2xl bg-card/90 p-1.5 shadow-floating backdrop-blur-md border border-border-strong pointer-events-auto">
          <button
            type="button"
            onClick={() => setActiveLayer('rain')}
            className={`flex min-h-[38px] items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-colors ${
              activeLayer === 'rain'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-content-secondary hover:bg-card-subtle'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            <span>Rain Radar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('heat')}
            className={`flex min-h-[38px] items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-colors ${
              activeLayer === 'heat'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-content-secondary hover:bg-card-subtle'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Heat Stress</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('aqi')}
            className={`flex min-h-[38px] items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-colors ${
              activeLayer === 'aqi'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-content-secondary hover:bg-card-subtle'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>AQI</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Leaflet Map Container */}
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Heat/Rain Visual Overlay Rings */}
        {activeLayer === 'rain' && (
          <Circle
            center={[12.9344, 77.6288]}
            radius={2200}
            pathOptions={{ color: '#0284C7', fillColor: '#38BDF8', fillOpacity: 0.35 }}
          />
        )}

        {activeLayer === 'heat' && (
          <Circle
            center={[12.9784, 77.6408]}
            radius={2500}
            pathOptions={{ color: '#EA580C', fillColor: '#F97316', fillOpacity: 0.35 }}
          />
        )}

        {activeLayer === 'aqi' && (
          <Circle
            center={[12.9915, 77.5854]}
            radius={3000}
            pathOptions={{ color: '#D97706', fillColor: '#FBBF24', fillOpacity: 0.3 }}
          />
        )}

        {/* Citizen Report Markers */}
        {reports.map((rep) => (
          <Marker
            key={rep.id}
            position={[rep.lat, rep.lon]}
            icon={createCustomIcon(rep.category, rep.severity)}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 space-y-1.5 min-w-[200px] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rep.title}</span>
                  {rep.verified && (
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-bold">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-700 leading-snug">{rep.description}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-500 font-medium">
                  <span>{rep.locationName}</span>
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <ThumbsUp className="w-3 h-3" /> {rep.upvotes} upvotes
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 3. Floating Action Button: + Report (Thumb Zone Placement) */}
      <div className="absolute bottom-20 right-4 z-[1000]">
        <Link
          to="/report"
          className="flex min-h-[48px] items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-floating hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>+ Report Hazard</span>
        </Link>
      </div>
    </div>
  );
};
