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
} from 'lucide-react';

// Center updater helper component
const MapRecenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

// Custom Marker Pin Generator
const createCustomIcon = (category: string, severity: string) => {
  const color =
    severity === 'high' || severity === 'critical'
      ? '#EF4444'
      : severity === 'medium'
      ? '#F59E0B'
      : '#10B981';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.35); font-size: 14px;">
      📍
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

export const HyperlocalMapPage: React.FC = () => {
  const { activeLocation, setActiveLocation } = useAppStore();
  const [activeLayer, setActiveLayer] = useState<'rain' | 'heat' | 'aqi'>('rain');
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

  // Handle Geolocation
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

  // Upvote Action
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

  const center: [number, number] = [activeLocation.lat, activeLocation.lon];

  return (
    <div className="relative h-[calc(100vh-120px)] w-full overflow-hidden bg-slate-900">
      {/* 1. Map Layer Toggle & Location Button Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 p-1.5 shadow-lg backdrop-blur-md border border-slate-200 dark:border-slate-800 pointer-events-auto">
          <button
            type="button"
            onClick={() => setActiveLayer('rain')}
            className={`flex min-h-[36px] items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-all ${
              activeLayer === 'rain'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rain Radar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('heat')}
            className={`flex min-h-[36px] items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-all ${
              activeLayer === 'heat'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Heat Stress</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('aqi')}
            className={`flex min-h-[36px] items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-all ${
              activeLayer === 'aqi'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>AQI</span>
          </button>
        </div>

        {/* GPS Re-center Button */}
        <button
          type="button"
          onClick={handleCurrentLocation}
          className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-lg backdrop-blur-md border border-slate-200 dark:border-slate-800 pointer-events-auto active:scale-95 transition-all"
          title="Locate Me"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
          ) : (
            <Navigation className="w-4 h-4 text-sky-500 fill-sky-500" />
          )}
        </button>
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

        {/* Citizen Report Markers */}
        {reports.map((rep) => (
          <Marker
            key={rep.id}
            position={[rep.lat, rep.lon]}
            icon={createCustomIcon(rep.category, rep.severity)}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 space-y-2 min-w-[210px] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{rep.title}</span>
                  {rep.verified && (
                    <span className="flex items-center gap-0.5 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{rep.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 font-medium">{rep.locationName}</span>
                  <button
                    type="button"
                    onClick={() => handleUpvote(rep.id)}
                    disabled={upvotingId === rep.id}
                    className="flex items-center gap-1 text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg hover:bg-sky-100 active:scale-95 transition-all"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{rep.upvotes}</span>
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 3. Floating Action Button: + Report Hazard */}
      <div className="absolute bottom-6 right-4 z-[1000]">
        <Link
          to="/report"
          className="flex min-h-[46px] items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Report Hazard</span>
        </Link>
      </div>
    </div>
  );
};