import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IMDRemoteSensingOverview,
  IMDRadarStation,
  IMDRadarProductType,
  IMDSatelliteChannel,
} from '@mausam/shared-types';

export const RadarSatellitePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'radar' | 'satellite' | 'lightning'>('radar');
  const [overview, setOverview] = useState<IMDRemoteSensingOverview | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string>('delhi');
  const [selectedRadarProduct, setSelectedRadarProduct] = useState<IMDRadarProductType>('MAX_Z');
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [selectedSatelliteChannelId, setSelectedSatelliteChannelId] = useState<string>('ir1');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRemoteSensing = async () => {
      try {
        const res = await fetch('/api/imd/remote-sensing');
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setOverview(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load remote sensing overview', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRemoteSensing();
  }, []);

  const selectedStation: IMDRadarStation | undefined =
    overview?.radarStations.find((s) => s.id === selectedStationId) || overview?.radarStations[0];

  const selectedSatellite: IMDSatelliteChannel | undefined =
    overview?.satelliteChannels.find((c) => c.id === selectedSatelliteChannelId) || overview?.satelliteChannels[0];

  const radarProductLabels: Record<IMDRadarProductType, { label: string; desc: string }> = {
    MAX_Z: { label: 'MAX (Z) Reflectivity', desc: 'Maximum storm core reflectivity across all vertical elevation angles' },
    SRI: { label: 'SRI Rainfall Intensity', desc: 'Surface rainfall rate estimate (mm/hr) at ground level' },
    PAC: { label: 'PAC Precipitation Total', desc: 'Cumulative rainfall accumulation over 1h to 24h window' },
    PPI_Z: { label: 'PPI (Z) Base Scan', desc: 'Plan Position Indicator reflectivity at lowest tilt' },
    PPV: { label: 'PPV Radial Velocity', desc: 'Doppler wind speeds towards / away from radar dish' },
    VVP2: { label: 'VVP (2) Wind Profile', desc: 'Vertical atmospheric wind speed & direction profile with altitude' },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
              IMD Remote Sensing Studio
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Doppler Radar &amp; Satellite
            </h1>
          </div>
          <span className="flex items-center gap-1.5 bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs px-2.5 py-1 rounded-full font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Live IMD Telemetry
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('radar')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'radar'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📡 Doppler Radar
          </button>
          <button
            onClick={() => setActiveTab('satellite')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'satellite'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🛰️ INSAT-3DS
          </button>
          <button
            onClick={() => setActiveTab('lightning')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'lightning'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Lightning Grid
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4">
        {/* ========================================== */}
        {/* 1. RADAR STUDIO TAB */}
        {/* ========================================== */}
        {activeTab === 'radar' && (
          <div className="space-y-4">
            {/* National Radar Mosaic vs Station Scan Selector */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Select Doppler Radar Station</h3>
                  <p className="text-xs text-slate-400">37 Operational Radars Across India</p>
                </div>
                <button
                  onClick={() => setShowAnimation(!showAnimation)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    showAnimation
                      ? 'bg-amber-500 text-black border-amber-400 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {showAnimation ? '⏸️ Loop Playing' : '▶️ 3-Hr Animation'}
                </button>
              </div>

              {/* Station Horizontal Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  onClick={() => setSelectedStationId('mosaic')}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedStationId === 'mosaic'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  🇮🇳 National Mosaic (All-India)
                </button>
                {overview?.radarStations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => setSelectedStationId(station.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedStationId === station.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {station.name.split(' (')[0]} ({station.band})
                  </button>
                ))}
              </div>
            </div>

            {/* Radar Scan Product Switcher (When specific station is selected) */}
            {selectedStationId !== 'mosaic' && selectedStation && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Scan Product Layer
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(radarProductLabels) as IMDRadarProductType[]).map((prodKey) => (
                    <button
                      key={prodKey}
                      onClick={() => setSelectedRadarProduct(prodKey)}
                      className={`text-left p-2.5 rounded-xl border transition-all ${
                        selectedRadarProduct === prodKey
                          ? 'bg-cyan-950/60 border-cyan-500 text-white ring-1 ring-cyan-500/50'
                          : 'bg-slate-950/80 border-slate-800/80 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-200">
                        {radarProductLabels[prodKey].label}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {radarProductLabels[prodKey].desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Radar Viewer Display */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {selectedStationId === 'mosaic'
                      ? 'National Radar Reflectivity Composite'
                      : `${selectedStation?.name} — ${radarProductLabels[selectedRadarProduct].label}`}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Scan Interval: 10 mins • Coordinates: {selectedStation ? `${selectedStation.lat}°N, ${selectedStation.lon}°E` : 'Pan-India'}
                  </span>
                </div>
                <span className="text-xs text-emerald-400 font-mono">
                  ● ACTIVE
                </span>
              </div>

              {/* Image Frame */}
              <div className="relative bg-black flex items-center justify-center min-h-[340px] p-2">
                <img
                  src={
                    selectedStationId === 'mosaic'
                      ? overview?.nationalRadarMosaicUrl || 'https://mausam.imd.gov.in/Radar/MOSAIC/Converted/mosaic.gif'
                      : showAnimation && selectedStation?.animationGifUrl
                      ? selectedStation.animationGifUrl
                      : selectedStation?.productImageUrls[selectedRadarProduct] || 'https://mausam.imd.gov.in/Radar/caz_delhi.gif'
                  }
                  alt="IMD Radar Product"
                  className="max-h-[460px] w-auto object-contain rounded-lg"
                  onError={(e) => {
                    // Fallback to national mosaic if station scan image is unavailable
                    (e.target as HTMLImageElement).src = 'https://mausam.imd.gov.in/Radar/MOSAIC/Converted/mosaic.gif';
                  }}
                />
              </div>

              {/* Reflectivity dBZ Legend */}
              <div className="p-3 bg-slate-950 border-t border-slate-800">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span>Reflectivity Intensity (dBZ) &amp; Rain Rate</span>
                  <span>Severe Hail / Core &gt; 60 dBZ</span>
                </div>
                <div className="grid grid-cols-6 gap-1 h-3 rounded overflow-hidden">
                  <div className="bg-[#00e5ff]" title="< 15 dBZ (Drizzle)"></div>
                  <div className="bg-[#00e676]" title="15-30 dBZ (Light Rain)"></div>
                  <div className="bg-[#ffea00]" title="30-45 dBZ (Moderate)"></div>
                  <div className="bg-[#ff9100]" title="45-55 dBZ (Heavy Rain)"></div>
                  <div className="bg-[#ff1744]" title="55-65 dBZ (Very Heavy / Hail)"></div>
                  <div className="bg-[#d500f9]" title="> 65 dBZ (Extreme Storm)"></div>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                  <span>Drizzle (&lt;15)</span>
                  <span>Light (25)</span>
                  <span>Moderate (35)</span>
                  <span>Heavy (45)</span>
                  <span>Hail/Squall (55+)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 2. SATELLITE STUDIO TAB */}
        {/* ========================================== */}
        {activeTab === 'satellite' && (
          <div className="space-y-4">
            {/* Channel Switcher */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {overview?.satelliteChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedSatelliteChannelId(channel.id)}
                  className={`text-left p-3 rounded-2xl border transition-all ${
                    selectedSatelliteChannelId === channel.id
                      ? 'bg-cyan-950/60 border-cyan-400 text-white ring-1 ring-cyan-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">
                    {channel.name}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                    {channel.wavelength}
                  </div>
                </button>
              ))}
            </div>

            {/* Satellite Viewer Card */}
            {selectedSatellite && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                <div className="p-3 border-b border-slate-800 bg-slate-950/60">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-white">
                      INSAT-3DS • {selectedSatellite.name}
                    </h4>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800">
                      Geostationary 74°E
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {selectedSatellite.description}
                  </p>
                </div>

                {/* Satellite Image Frame */}
                <div className="relative bg-black flex items-center justify-center min-h-[360px] p-2">
                  <img
                    src={selectedSatellite.imageUrl}
                    alt={selectedSatellite.name}
                    className="max-h-[500px] w-auto object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ir1.jpg';
                    }}
                  />
                </div>

                <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Coverage: Indian Ocean &amp; Asia Sector</span>
                  <a
                    href="https://rapid.imd.gov.in/r2v/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Rapid Scan Mode</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* 3. LIGHTNING GRID TAB */}
        {/* ========================================== */}
        {activeTab === 'lightning' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⚡</span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Damini Lightning &amp; Convection Grid
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ground-based sensor network mapping cloud-to-ground flash density
                  </p>
                </div>
              </div>

              <div className="relative bg-black rounded-xl overflow-hidden min-h-[340px] flex items-center justify-center my-3 border border-slate-800">
                <img
                  src={overview?.nationalLightningMapUrl || 'https://mausam.imd.gov.in/lightning/Converted/BT.gif'}
                  alt="Live Lightning Grid"
                  className="max-h-[440px] w-auto object-contain"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                  <div className="font-bold text-emerald-400">&lt; 30%</div>
                  <div className="text-[10px] text-slate-400">Low Risk</div>
                </div>
                <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/20">
                  <div className="font-bold text-amber-400">30% - 60%</div>
                  <div className="text-[10px] text-slate-400">Moderate Alert</div>
                </div>
                <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/20">
                  <div className="font-bold text-rose-400">&gt; 60%</div>
                  <div className="text-[10px] text-slate-400">High Danger (Shelter)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
