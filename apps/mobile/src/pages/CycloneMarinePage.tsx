import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IMDActiveCyclone,
  IMDFishermenAreaWarning,
  IMDPortWarningSignal,
} from '@mausam/shared-types';

export const CycloneMarinePage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'cyclone' | 'fishermen' | 'ports'>('cyclone');
  const [cyclones, setCyclones] = useState<IMDActiveCyclone[]>([]);
  const [fishermenWarnings, setFishermenWarnings] = useState<IMDFishermenAreaWarning[]>([]);
  const [portSignals, setPortSignals] = useState<IMDPortWarningSignal[]>([]);
  const [selectedCycloneIndex, setSelectedCycloneIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCycloneMarine = async () => {
      try {
        const [cycRes, marineRes] = await Promise.all([
          fetch('/api/imd/cyclone'),
          fetch('/api/imd/marine'),
        ]);

        if (cycRes.ok) {
          const cycJson = await cycRes.json();
          if (cycJson.data) setCyclones(cycJson.data);
        }

        if (marineRes.ok) {
          const marineJson = await marineRes.json();
          if (marineJson.data) {
            setFishermenWarnings(marineJson.data.fishermenWarnings || []);
            setPortSignals(marineJson.data.portSignals || []);
          }
        }
      } catch (err) {
        console.error('Failed to load cyclone and marine data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCycloneMarine();
  }, []);

  const currentCyclone = cyclones[selectedCycloneIndex] || cyclones[0] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400">
              RSMC New Delhi • Maritime Safety
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Cyclone &amp; Coastal Guard
            </h1>
          </div>
          <span className="flex items-center gap-1.5 bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs px-2.5 py-1 rounded-full font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            Special Bulletin
          </span>
        </div>

        {/* Sub-tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('cyclone')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'cyclone'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌀 Cyclone Tracker
          </button>
          <button
            onClick={() => setActiveSubTab('fishermen')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'fishermen'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⛵ Fishermen Alert
          </button>
          <button
            onClick={() => setActiveSubTab('ports')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'ports'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🚩 Port Warning Signals
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================== */}
        {/* 1. CYCLONE TRACKER TAB */}
        {/* ========================================== */}
        {activeSubTab === 'cyclone' && (
          <div className="space-y-4">
            {currentCyclone ? (
              <>
                {/* Active Storm Overview Card */}
                <div className="rounded-2xl p-4 bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/40 shadow-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {currentCyclone.basin} Basin
                      </span>
                      <h2 className="text-lg font-extrabold text-white mt-1.5">
                        {currentCyclone.name}
                      </h2>
                      <p className="text-xs text-rose-300 font-medium">
                        {currentCyclone.currentIntensityLabel}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-rose-400 font-mono">
                        {currentCyclone.currentWindSpeedKph} <span className="text-xs">km/h</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Press: {currentCyclone.currentPressureHpa} hPa
                      </div>
                    </div>
                  </div>

                  {/* Landfall Prediction Box */}
                  {currentCyclone.landfallForecast && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/30 mb-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <span>🎯 Landfall Projection</span>
                      </div>
                      <p className="text-xs text-slate-200">
                        {currentCyclone.landfallForecast.location}
                      </p>
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
                        <span>ETA: {currentCyclone.landfallForecast.estimatedTimeIST}</span>
                        <span>Storm Surge: +{currentCyclone.landfallForecast.stormSurgeHeightM}m</span>
                      </div>
                    </div>
                  )}

                  {/* Bulletin Official Text */}
                  <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 leading-relaxed italic">
                    "{currentCyclone.bulletinText}"
                  </p>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                    <span>Center: {currentCyclone.currentLat}°N, {currentCyclone.currentLon}°E</span>
                    <span>{currentCyclone.lastUpdatedIST}</span>
                  </div>
                </div>

                {/* Track Timeline: Past Observed vs 120-Hr Forecast */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
                  <h3 className="text-sm font-bold text-white mb-3">
                    Observed vs. 120-Hour Projected Track
                  </h3>

                  <div className="space-y-2.5">
                    {/* Past Points */}
                    {currentCyclone.trackHistory.map((pt, i) => (
                      <div key={'past-' + i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                          <span className="font-mono text-slate-300">{pt.timeIST}</span>
                          <span className="font-semibold text-slate-200">{pt.estimatedStatus}</span>
                        </div>
                        <span className="font-mono text-slate-400">{pt.lat}°N, {pt.lon}°E ({pt.windSpeedKph} km/h)</span>
                      </div>
                    ))}

                    {/* Forecast Points */}
                    {currentCyclone.forecastTrack.map((pt, i) => (
                      <div key={'fc-' + i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-rose-950/20 border border-rose-500/20">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                          <span className="font-mono text-rose-300 font-semibold">{pt.timeIST}</span>
                          <span className="font-semibold text-white">{pt.estimatedStatus}</span>
                        </div>
                        <span className="font-mono text-rose-300">{pt.lat}°N, {pt.lon}°E ({pt.windSpeedKph} km/h)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl p-8 text-center bg-slate-900 border border-slate-800">
                <span className="text-3xl">🌊</span>
                <h3 className="text-base font-bold text-white mt-2">No Active Cyclones in North Indian Ocean</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Bay of Bengal and Arabian Sea basins are currently under normal tropical monitoring.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* 2. FISHERMEN WARNINGS TAB */}
        {/* ========================================== */}
        {activeSubTab === 'fishermen' && (
          <div className="space-y-3">
            {fishermenWarnings.map((fw, idx) => {
              const isDanger = fw.warningLevel === 'severe_danger' || fw.warningLevel === 'danger';
              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-4 border transition-all ${
                    isDanger
                      ? 'bg-gradient-to-br from-rose-950/40 to-slate-900 border-rose-500/40 shadow-lg shadow-rose-950/20'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {fw.warningLevel.replace('_', ' ')}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">
                        {fw.coastalZone}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-amber-300 font-bold">
                      {fw.expectedWindSpeedKph}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                    <span className="font-semibold text-slate-400">Sea State:</span>
                    <span className="font-bold text-cyan-300">{fw.seaCondition}</span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    ⚠️ {fw.fishermenAdvisory}
                  </p>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                    <span>Covered: {fw.statesCovered.join(', ')}</span>
                    <span className="font-mono">Valid: {fw.validUptoIST}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================== */}
        {/* 3. PORT SIGNALS TAB */}
        {/* ========================================== */}
        {activeSubTab === 'ports' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-white">IMD Port Signal Protocol (1 to 11):</span> Official storm warning signals hoisted at major Indian commercial ports and shipping anchorages.
            </div>

            {portSignals.map((port, idx) => (
              <div key={idx} className="rounded-2xl p-4 bg-slate-900 border border-slate-800">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {port.portName} ({port.state})
                    </h4>
                    <span className="text-xs font-semibold text-rose-400">
                      🚩 {port.signalName} (Signal #{port.signalNumber})
                    </span>
                  </div>
                  <span className="text-lg font-black text-rose-500 font-mono bg-rose-950/50 w-8 h-8 rounded-full flex items-center justify-center border border-rose-500/40">
                    {port.signalNumber}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-2">
                  <span className="text-slate-400">Meaning: </span>
                  {port.meaning}
                </p>

                <div className="text-xs text-amber-300 bg-amber-950/20 p-2 rounded-lg border border-amber-500/20">
                  <span className="font-bold">Required Action: </span>
                  {port.actionRequired}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
