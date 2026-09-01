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
    <div className="min-h-screen bg-background text-content-primary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b border-border-subtle p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">
              RSMC New Delhi • Maritime Safety
            </span>
            <h1 className="text-xl font-bold tracking-tight text-content-primary">
              Cyclone &amp; Coastal Guard
            </h1>
          </div>
          <span className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs px-2.5 py-1 rounded-full font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            Special Bulletin
          </span>
        </div>

        {/* Sub-tabs */}
        <div className="grid grid-cols-3 gap-1 bg-card-subtle p-1 rounded-xl border border-border-subtle">
          <button
            type="button"
            onClick={() => setActiveSubTab('cyclone')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'cyclone'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-bold'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            🌀 Cyclone Tracker
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('fishermen')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'fishermen'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-bold'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            ⛵ Fishermen Alert
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('ports')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'ports'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-bold'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            🚩 Port Signals
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
                <div className="rounded-2xl p-4 bg-card border border-rose-500/40 shadow-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                        {currentCyclone.basin} Basin
                      </span>
                      <h2 className="text-lg font-extrabold text-content-primary mt-1.5">
                        {currentCyclone.name}
                      </h2>
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {currentCyclone.currentIntensityLabel}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
                        {currentCyclone.currentWindSpeedKph} <span className="text-xs">km/h</span>
                      </div>
                      <div className="text-[11px] text-content-muted font-mono">
                        Press: {currentCyclone.currentPressureHpa} hPa
                      </div>
                    </div>
                  </div>

                  {/* Landfall Prediction Box */}
                  {currentCyclone.landfallForecast && (
                    <div className="p-3 rounded-xl bg-card-subtle border border-rose-500/30 mb-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-300">
                        <span>🎯 Landfall Projection</span>
                      </div>
                      <p className="text-xs text-content-primary">
                        {currentCyclone.landfallForecast.location}
                      </p>
                      <div className="flex justify-between text-[11px] text-content-muted font-mono pt-1">
                        <span>ETA: {currentCyclone.landfallForecast.estimatedTimeIST}</span>
                        <span>Storm Surge: +{currentCyclone.landfallForecast.stormSurgeHeightM}m</span>
                      </div>
                    </div>
                  )}

                  {/* Bulletin Official Text */}
                  <p className="text-xs text-content-secondary bg-card-subtle p-3 rounded-xl border border-border-subtle leading-relaxed italic">
                    &quot;{currentCyclone.bulletinText}&quot;
                  </p>

                  <div className="flex justify-between text-[10px] text-content-muted mt-2 font-mono">
                    <span>Center: {currentCyclone.currentLat}°N, {currentCyclone.currentLon}°E</span>
                    <span>{currentCyclone.lastUpdatedIST}</span>
                  </div>
                </div>

                {/* Track Timeline: Past Observed vs 120-Hr Forecast */}
                <div className="rounded-2xl bg-card border border-border-subtle p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-content-primary mb-3">
                    Observed vs. 120-Hour Projected Track
                  </h3>

                  <div className="space-y-2.5">
                    {/* Past Points */}
                    {currentCyclone.trackHistory.map((pt, i) => (
                      <div key={'past-' + i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-card-subtle border border-border-subtle">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                          <span className="font-mono text-content-secondary">{pt.timeIST}</span>
                          <span className="font-semibold text-content-primary">{pt.estimatedStatus}</span>
                        </div>
                        <span className="font-mono text-content-muted">{pt.lat}°N, {pt.lon}°E ({pt.windSpeedKph} km/h)</span>
                      </div>
                    ))}

                    {/* Forecast Points */}
                    {currentCyclone.forecastTrack.map((pt, i) => (
                      <div key={'fc-' + i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                          <span className="font-mono text-rose-600 dark:text-rose-300 font-semibold">{pt.timeIST}</span>
                          <span className="font-semibold text-content-primary">{pt.estimatedStatus}</span>
                        </div>
                        <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">{pt.lat}°N, {pt.lon}°E ({pt.windSpeedKph} km/h)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl p-8 text-center bg-card border border-border-subtle shadow-sm">
                <span className="text-3xl">🌊</span>
                <h3 className="text-base font-bold text-content-primary mt-2">No Active Cyclones in North Indian Ocean</h3>
                <p className="text-xs text-content-muted mt-1">
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
                  className={`rounded-2xl p-4 border transition-all shadow-sm ${
                    isDanger
                      ? 'bg-card border-rose-500/40 ring-1 ring-rose-500/20'
                      : 'bg-card border-border-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                        {fw.warningLevel.replace('_', ' ')}
                      </span>
                      <h4 className="text-sm font-bold text-content-primary mt-1.5">
                        {fw.coastalZone}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {fw.expectedWindSpeedKph}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-content-secondary mb-2">
                    <span className="font-semibold text-content-muted">Sea State:</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{fw.seaCondition}</span>
                  </div>

                  <p className="text-xs text-content-secondary bg-card-subtle p-2.5 rounded-xl border border-border-subtle leading-relaxed">
                    ⚠️ {fw.fishermenAdvisory}
                  </p>

                  <div className="flex justify-between text-[10px] text-content-muted mt-2">
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
            <div className="p-3 rounded-xl bg-card border border-border-subtle text-xs text-content-secondary shadow-xs">
              <span className="font-bold text-content-primary">IMD Port Signal Protocol (1 to 11):</span> Official storm warning signals hoisted at major Indian commercial ports and shipping anchorages.
            </div>

            {portSignals.map((port, idx) => (
              <div key={idx} className="rounded-2xl p-4 bg-card border border-border-subtle shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-content-primary">
                      {port.portName} ({port.state})
                    </h4>
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      🚩 {port.signalName} (Signal #{port.signalNumber})
                    </span>
                  </div>
                  <span className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono bg-rose-500/15 w-8 h-8 rounded-full flex items-center justify-center border border-rose-500/30">
                    {port.signalNumber}
                  </span>
                </div>

                <p className="text-xs text-content-secondary mb-2">
                  <span className="text-content-muted">Meaning: </span>
                  {port.meaning}
                </p>

                <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
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
