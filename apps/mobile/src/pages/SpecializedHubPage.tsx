import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IMDHighwayCorridor,
  IMDPilgrimageYatra,
  IMDFlashFloodBasin,
  IMDRainfallDepartureDistrict,
  IMDAgrometBulletin,
} from '@mausam/shared-types';

export const SpecializedHubPage: React.FC = () => {
  const [activeSector, setActiveSector] = useState<'highways' | 'pilgrimage' | 'flashflood' | 'agromet'>('highways');
  const [highways, setHighways] = useState<IMDHighwayCorridor[]>([]);
  const [yatras, setYatras] = useState<IMDPilgrimageYatra[]>([]);
  const [floodBasins, setFloodBasins] = useState<IMDFlashFloodBasin[]>([]);
  const [rainfallDepartures, setRainfallDepartures] = useState<IMDRainfallDepartureDistrict[]>([]);
  const [agromet, setAgromet] = useState<IMDAgrometBulletin | null>(null);
  const [selectedHighwayId, setSelectedHighwayId] = useState<string>('NH-48');
  const [selectedYatraId, setSelectedYatraId] = useState<string>('chardham');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSpecializedData = async () => {
      try {
        const [hwRes, pilgRes, ffRes, agroRes] = await Promise.all([
          fetch('/api/imd/highways'),
          fetch('/api/imd/pilgrimage'),
          fetch('/api/imd/flash-flood'),
          fetch('/api/imd/agromet'),
        ]);

        if (hwRes.ok) {
          const json = await hwRes.json();
          if (json.data) setHighways(json.data);
        }
        if (pilgRes.ok) {
          const json = await pilgRes.json();
          if (json.data) setYatras(json.data);
        }
        if (ffRes.ok) {
          const json = await ffRes.json();
          if (json.data) {
            setFloodBasins(json.data.flashFloodBasins || []);
            setRainfallDepartures(json.data.rainfallDepartures || []);
          }
        }
        if (agroRes.ok) {
          const json = await agroRes.json();
          if (json.data) setAgromet(json.data);
        }
      } catch (err) {
        console.error('Failed to load specialized hubs data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecializedData();
  }, []);

  const currentHighway = highways.find((h) => h.highwayId === selectedHighwayId) || highways[0];
  const currentYatra = yatras.find((y) => y.yatraId === selectedYatraId) || yatras[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
              Sectoral Weather Portals
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Specialized Forecast Hub
            </h1>
          </div>
          <span className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-mono">
            National Grid
          </span>
        </div>

        {/* 4 Sector Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSector('highways')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSector === 'highways'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🛣️ Highways
          </button>
          <button
            onClick={() => setActiveSector('pilgrimage')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSector === 'pilgrimage'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏔️ Pilgrimage
          </button>
          <button
            onClick={() => setActiveSector('flashflood')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSector === 'flashflood'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌊 Flash Flood
          </button>
          <button
            onClick={() => setActiveSector('agromet')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSector === 'agromet'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌾 Kisan Agro
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================== */}
        {/* 1. HIGHWAY WEATHER TAB */}
        {/* ========================================== */}
        {activeSector === 'highways' && (
          <div className="space-y-4">
            {/* Highway Route Selector */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {highways.map((hw) => (
                <button
                  key={hw.highwayId}
                  onClick={() => setSelectedHighwayId(hw.highwayId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition-all ${
                    selectedHighwayId === hw.highwayId
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {hw.highwayId} • {hw.routeName}
                </button>
              ))}
            </div>

            {currentHighway && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {currentHighway.highwayId} Route Forecast
                    </h3>
                    <p className="text-xs text-slate-400">
                      {currentHighway.originCity} ➔ {currentHighway.destinationCity} ({currentHighway.totalDistanceKm} km)
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase ${
                      currentHighway.overallStatus === 'all_clear'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {currentHighway.overallStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Corridor Segments */}
                <div className="space-y-3">
                  {currentHighway.segments.map((seg, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">
                            {seg.segmentName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {seg.currentCondition}
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {seg.speedAdvisoryKph} km/h rec.
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                        <span>Visibility: {seg.visibilityMeters}m</span>
                        <span>Rain: {seg.rainfallStatus}</span>
                      </div>

                      {seg.hazardWarning && (
                        <div className="text-[11px] font-medium text-amber-300 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20">
                          ⚠️ {seg.hazardWarning}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* 2. SACRED PILGRIMAGE TAB */}
        {/* ========================================== */}
        {activeSector === 'pilgrimage' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {yatras.map((yt) => (
                <button
                  key={yt.yatraId}
                  onClick={() => setSelectedYatraId(yt.yatraId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedYatraId === yt.yatraId
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  🕉️ {yt.yatraName}
                </button>
              ))}
            </div>

            {currentYatra && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{currentYatra.yatraName}</h3>
                    <span className="text-xs text-cyan-300 font-medium">Status: {currentYatra.seasonStatus}</span>
                  </div>
                  {currentYatra.mountainBulletinUrl && (
                    <a
                      href={currentYatra.mountainBulletinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-2.5 py-1 bg-cyan-500 text-black font-bold rounded-lg"
                    >
                      Mountain Bulletin ↗
                    </a>
                  )}
                </div>

                {/* Camp Altitude Weather Cards */}
                {currentYatra.camps.map((camp, idx) => (
                  <div key={idx} className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{camp.campName}</h4>
                        <span className="text-[11px] font-mono text-slate-400">
                          Altitude: {camp.altitudeMeters}m MSL
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-cyan-400 font-mono">
                          {camp.currentTempC}°C
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Wind Chill: {camp.windChillC}°C
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {camp.rainSnowStatus}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          camp.trackPassability === 'Open'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        Trail: {camp.trackPassability}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      {camp.forecastSummary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* 3. FLASH FLOOD GUIDANCE TAB */}
        {/* ========================================== */}
        {activeSector === 'flashflood' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/50 via-slate-900 to-slate-900 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">🌊</span>
                <h3 className="text-sm font-bold text-white">
                  Flash Flood Guidance System (FFGS)
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated hydrometeorological threat matrix calculating excess runoff beyond soil infiltration capacity.
              </p>
            </div>

            {/* Basin Risk Cards */}
            <div className="space-y-3">
              {floodBasins.map((basin) => (
                <div
                  key={basin.basinId}
                  className={`rounded-2xl p-4 border transition-all ${
                    basin.flashFloodRisk === 'high'
                      ? 'bg-gradient-to-br from-blue-950/40 to-slate-900 border-blue-500/40'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          basin.flashFloodRisk === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {basin.flashFloodRisk} Flash Flood Risk
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">
                        {basin.basinName} ({basin.state})
                      </h4>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-blue-400">
                        {basin.flashFloodThreatMm} mm
                      </div>
                      <div className="text-[10px] text-slate-400">Runoff Threat</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Soil Moisture Saturation:</span>
                    <span className="font-mono font-bold text-cyan-300">{basin.soilMoistureIndexPct}%</span>
                  </div>

                  {/* Soil Moisture Bar */}
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"
                      style={{ width: `${basin.soilMoistureIndexPct}%` }}
                    ></div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    {basin.catchmentSummary}
                  </p>
                </div>
              ))}
            </div>

            {/* DRMS Rainfall Departure Table */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                District Rainfall Monitoring (DRMS Departures)
              </h4>
              <div className="space-y-2">
                {rainfallDepartures.map((rf, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                    <div>
                      <div className="font-bold text-white">{rf.districtName}, {rf.stateName}</div>
                      <div className="text-[10px] text-slate-400">Actual: {rf.actualRainMm}mm (Norm: {rf.normalRainMm}mm)</div>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-xs font-bold font-mono px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${rf.colorHex}22`, color: rf.colorHex }}
                      >
                        {rf.departurePct > 0 ? `+${rf.departurePct}%` : `${rf.departurePct}%`}
                      </span>
                      <div className="text-[9px] text-slate-400 mt-0.5">{rf.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 4. KISAN AGROMET ADVISORY TAB */}
        {/* ========================================== */}
        {activeSector === 'agromet' && agromet && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/30">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    GKMS • Meghdoot Advisory
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {agromet.districtName} ({agromet.stateName})
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {agromet.issuedDateIST}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {agromet.weatherSummary}
              </p>
            </div>

            {/* Crop Advisories */}
            <div className="space-y-3">
              {agromet.cropAdvisories.map((crop, idx) => (
                <div key={idx} className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-300">
                        🌱 {crop.cropName}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Stage: {crop.growthStage}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        crop.fertilizerSprayingWindow === 'favorable'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      Spraying: {crop.fertilizerSprayingWindow}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {crop.advisoryText}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-950 text-xs text-slate-300 border border-slate-800 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-400">💧 Irrigation Guidance: </span>
                      <span>{crop.irrigationGuidance}</span>
                    </div>
                    {crop.pestDiseaseAlert && (
                      <div className="text-amber-300 font-medium">
                        🐛 Pest Alert: {crop.pestDiseaseAlert}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {agromet.livestockCare && (
                <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    🐄 Livestock &amp; Dairy Cattle Care
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {agromet.livestockCare}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
