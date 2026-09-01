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
    <div className="min-h-screen bg-background text-content-primary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b border-border-subtle p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
              Sectoral Weather Portals
            </span>
            <h1 className="text-xl font-bold tracking-tight text-content-primary">
              Specialized Forecast Hub
            </h1>
          </div>
          <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs px-2.5 py-1 rounded-full font-mono">
            National Grid
          </span>
        </div>

        {/* 4 Sector Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-card-subtle p-1 rounded-xl border border-border-subtle">
          <button
            type="button"
            onClick={() => setActiveSector('highways')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSector === 'highways'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            🛣️ Highways
          </button>
          <button
            type="button"
            onClick={() => setActiveSector('pilgrimage')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSector === 'pilgrimage'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            🏔️ Pilgrimage
          </button>
          <button
            type="button"
            onClick={() => setActiveSector('flashflood')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSector === 'flashflood'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            🌊 Flash Flood
          </button>
          <button
            type="button"
            onClick={() => setActiveSector('agromet')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSector === 'agromet'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                : 'text-content-secondary hover:text-content-primary'
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
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {highways.map((hw) => (
                <button
                  type="button"
                  key={hw.highwayId}
                  onClick={() => setSelectedHighwayId(hw.highwayId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition-all ${
                    selectedHighwayId === hw.highwayId
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/40'
                      : 'bg-card border-border-subtle text-content-secondary hover:bg-card-subtle hover:text-content-primary'
                  }`}
                >
                  {hw.highwayId} • {hw.routeName}
                </button>
              ))}
            </div>

            {currentHighway && (
              <div className="rounded-2xl bg-card border border-border-subtle p-4 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <div>
                    <h3 className="text-base font-bold text-content-primary">
                      {currentHighway.highwayId} Route Forecast
                    </h3>
                    <p className="text-xs text-content-muted">
                      {currentHighway.originCity} ➔ {currentHighway.destinationCity} ({currentHighway.totalDistanceKm} km)
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase ${
                      currentHighway.overallStatus === 'all_clear'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {currentHighway.overallStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Corridor Segments */}
                <div className="space-y-3">
                  {currentHighway.segments.map((seg, i) => (
                    <div key={i} className="p-3 rounded-xl bg-card-subtle border border-border-subtle space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs font-bold text-content-primary">
                            {seg.segmentName}
                          </div>
                          <div className="text-[11px] text-content-secondary">
                            {seg.currentCondition}
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                          {seg.speedAdvisoryKph} km/h rec.
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-content-muted font-mono">
                        <span>Visibility: {seg.visibilityMeters}m</span>
                        <span>Rain: {seg.rainfallStatus}</span>
                      </div>

                      {seg.hazardWarning && (
                        <div className="text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
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
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {yatras.map((yt) => (
                <button
                  type="button"
                  key={yt.yatraId}
                  onClick={() => setSelectedYatraId(yt.yatraId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition-all ${
                    selectedYatraId === yt.yatraId
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-500/40'
                      : 'bg-card border-border-subtle text-content-secondary hover:bg-card-subtle hover:text-content-primary'
                  }`}
                >
                  🕉️ {yt.yatraName}
                </button>
              ))}
            </div>

            {currentYatra && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-card border border-cyan-500/30 flex items-center justify-between shadow-xs">
                  <div>
                    <h3 className="text-sm font-bold text-content-primary">{currentYatra.yatraName}</h3>
                    <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">Status: {currentYatra.seasonStatus}</span>
                  </div>
                  {currentYatra.mountainBulletinUrl && (
                    <a
                      href={currentYatra.mountainBulletinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-2.5 py-1 bg-cyan-500 text-white font-bold rounded-lg shadow-xs"
                    >
                      Mountain Bulletin ↗
                    </a>
                  )}
                </div>

                {/* Camp Altitude Weather Cards */}
                {currentYatra.camps.map((camp, idx) => (
                  <div key={idx} className="rounded-2xl p-4 bg-card border border-border-subtle space-y-2 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-content-primary">{camp.campName}</h4>
                        <span className="text-[11px] font-mono text-content-muted">
                          Altitude: {camp.altitudeMeters}m MSL
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono">
                          {camp.currentTempC}°C
                        </div>
                        <div className="text-[10px] text-content-muted">
                          Wind Chill: {camp.windChillC}°C
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-card-subtle text-content-secondary font-medium">
                        {camp.rainSnowStatus}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          camp.trackPassability === 'Open'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        Trail: {camp.trackPassability}
                      </span>
                    </div>

                    <p className="text-xs text-content-secondary bg-card-subtle p-2.5 rounded-xl border border-border-subtle">
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
            <div className="p-3.5 rounded-2xl bg-card border border-blue-500/30 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">🌊</span>
                <h3 className="text-sm font-bold text-content-primary">
                  Flash Flood Guidance System (FFGS)
                </h3>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Automated hydrometeorological threat matrix calculating excess runoff beyond soil infiltration capacity.
              </p>
            </div>

            {/* Basin Risk Cards */}
            <div className="space-y-3">
              {floodBasins.map((basin) => (
                <div
                  key={basin.basinId}
                  className={`rounded-2xl p-4 border transition-all shadow-sm ${
                    basin.flashFloodRisk === 'high'
                      ? 'bg-card border-blue-500/40'
                      : 'bg-card border-border-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          basin.flashFloodRisk === 'high'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {basin.flashFloodRisk} Flash Flood Risk
                      </span>
                      <h4 className="text-sm font-bold text-content-primary mt-1.5">
                        {basin.basinName} ({basin.state})
                      </h4>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {basin.flashFloodThreatMm} mm
                      </div>
                      <div className="text-[10px] text-content-muted">Runoff Threat</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-content-secondary mb-2">
                    <span>Soil Moisture Saturation:</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{basin.soilMoistureIndexPct}%</span>
                  </div>

                  {/* Soil Moisture Bar */}
                  <div className="h-2 bg-card-subtle rounded-full overflow-hidden mb-2 border border-border-subtle">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"
                      style={{ width: `${basin.soilMoistureIndexPct}%` }}
                    ></div>
                  </div>

                  <p className="text-xs text-content-secondary bg-card-subtle p-2.5 rounded-xl border border-border-subtle">
                    {basin.catchmentSummary}
                  </p>
                </div>
              ))}
            </div>

            {/* DRMS Rainfall Departure Table */}
            <div className="rounded-2xl bg-card border border-border-subtle p-4 shadow-sm">
              <h4 className="text-xs font-bold text-content-primary uppercase tracking-wider mb-2.5">
                District Rainfall Monitoring (DRMS Departures)
              </h4>
              <div className="space-y-2">
                {rainfallDepartures.map((rf, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-card-subtle border border-border-subtle text-xs">
                    <div>
                      <div className="font-bold text-content-primary">{rf.districtName}, {rf.stateName}</div>
                      <div className="text-[10px] text-content-muted">Actual: {rf.actualRainMm}mm (Norm: {rf.normalRainMm}mm)</div>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-xs font-bold font-mono px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${rf.colorHex}22`, color: rf.colorHex }}
                      >
                        {rf.departurePct > 0 ? `+${rf.departurePct}%` : `${rf.departurePct}%`}
                      </span>
                      <div className="text-[9px] text-content-muted mt-0.5">{rf.category}</div>
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
            <div className="rounded-2xl p-4 bg-card border border-emerald-500/30 shadow-xs">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    GKMS • Meghdoot Advisory
                  </span>
                  <h3 className="text-base font-bold text-content-primary mt-1">
                    {agromet.districtName} ({agromet.stateName})
                  </h3>
                </div>
                <span className="text-xs font-mono text-content-muted">
                  {agromet.issuedDateIST}
                </span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                {agromet.weatherSummary}
              </p>
            </div>

            {/* Crop Advisories */}
            <div className="space-y-3">
              {agromet.cropAdvisories.map((crop, idx) => (
                <div key={idx} className="rounded-2xl p-4 bg-card border border-border-subtle space-y-2 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        🌱 {crop.cropName}
                      </h4>
                      <span className="text-[11px] text-content-muted">
                        Stage: {crop.growthStage}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        crop.fertilizerSprayingWindow === 'favorable'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      Spraying: {crop.fertilizerSprayingWindow}
                    </span>
                  </div>

                  <p className="text-xs text-content-secondary leading-relaxed">
                    {crop.advisoryText}
                  </p>

                  <div className="p-2.5 rounded-xl bg-card-subtle text-xs text-content-secondary border border-border-subtle space-y-1">
                    <div>
                      <span className="font-semibold text-content-muted">💧 Irrigation Guidance: </span>
                      <span>{crop.irrigationGuidance}</span>
                    </div>
                    {crop.pestDiseaseAlert && (
                      <div className="text-amber-600 dark:text-amber-400 font-medium">
                        🐛 Pest Alert: {crop.pestDiseaseAlert}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {agromet.livestockCare && (
                <div className="rounded-2xl p-4 bg-card border border-border-subtle shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-content-primary mb-1.5">
                    🐄 Livestock &amp; Dairy Cattle Care
                  </h4>
                  <p className="text-xs text-content-secondary leading-relaxed">
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
