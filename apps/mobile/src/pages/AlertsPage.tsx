import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  RefreshCw,
  FileText,
  Bell,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { NowcastWarningCard } from '../cards/NowcastWarningCard';
import { FiveDayWarningCard } from '../cards/FiveDayWarningCard';
import { IMDBulletinBoard } from '../components/alerts/IMDBulletinBoard';
import { useTranslation } from '../utils/i18n';

interface IMDOverview {
  activeNowcastsCount: number;
  criticalWarningsCount: number;
  activeCyclonesCount: number;
  monitoredStationsCount: number;
  radarStationsCount: number;
}

export const AlertsPage: React.FC = () => {
  const { t } = useTranslation();
  const { activeLocation } = useAppStore();
  const [activeTab, setActiveTab] = useState<'alerts' | 'bulletins'>('alerts');
  const [overview, setOverview] = useState<IMDOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Refilter and reload immediately whenever activeLocation or lastRefresh changes
  useEffect(() => {
    let isCurrent = true;
    const fetchOverview = async () => {
      try {
        const res = await fetch('/api/imd/overview');
        if (res.ok) {
          const json = await res.json();
          if (isCurrent && json.data) {
            setOverview(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load IMD overview', err);
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    fetchOverview();
    return () => {
      isCurrent = false;
    };
  }, [activeLocation.name, lastRefresh]);

  const handleRefresh = () => {
    setLoading(true);
    setLastRefresh(new Date());
  };

  return (
    <div className="space-y-4 p-4 max-w-lg mx-auto pb-24">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="font-heading text-base font-extrabold text-content-primary tracking-tight flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
              <ShieldAlert className="w-4 h-4" />
            </div>
            {t('alerts.page_title')}
          </h1>
          <p className="text-[11px] text-content-muted font-medium pl-9">
            {t('alerts.page_subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-1 rounded-xl bg-card-subtle px-2.5 py-1.5 text-[11px] font-semibold text-content-muted hover:text-content-primary border border-border-subtle transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Segmented Control: [Active Alerts | Official Bulletins] */}
      <div className="flex rounded-2xl bg-card-subtle p-1 border border-border-subtle">
        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'alerts'
              ? 'bg-accent-primary text-white shadow-sm'
              : 'text-content-muted hover:text-content-primary'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Active Alerts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bulletins')}
          className={`flex-1 flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bulletins'
              ? 'bg-accent-primary text-white shadow-sm'
              : 'text-content-muted hover:text-content-primary'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Official Bulletins</span>
        </button>
      </div>

      {/* Tab 1: Active Location-Scoped Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Active Location Scope Badge */}
          <div className="flex items-center gap-2 rounded-2xl bg-card-subtle px-3.5 py-2.5 border border-border-subtle">
            <MapPin className="w-4 h-4 text-accent-primary flex-shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="text-content-muted block text-[10px] uppercase font-bold">Scoped Location</span>
              <span className="font-bold text-content-primary">{activeLocation.name}</span>
            </div>
            <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              Live Scoped
            </span>
          </div>

          {/* Alert Status Summary Strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 p-3 text-center space-y-1">
              <div className="font-heading text-xl font-black text-amber-500">
                {overview?.activeNowcastsCount ?? '—'}
              </div>
              <div className="text-[10px] font-semibold text-content-muted uppercase tracking-wide">
                Active Nowcasts
              </div>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/8 p-3 text-center space-y-1">
              <div className="font-heading text-xl font-black text-rose-500">
                {overview?.criticalWarningsCount ?? '—'}
              </div>
              <div className="text-[10px] font-semibold text-content-muted uppercase tracking-wide">
                Critical Alerts
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/8 p-3 text-center space-y-1">
              <div className="font-heading text-xl font-black text-cyan-500">
                {overview?.activeCyclonesCount ?? '—'}
              </div>
              <div className="text-[10px] font-semibold text-content-muted uppercase tracking-wide">
                Cyclones Tracked
              </div>
            </div>
          </div>

          {/* Section: 0-3hr Nowcast Warnings for Active Location */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-content-primary">
                {t('alerts.nowcast_section')}
              </h2>
              <span className="text-[9px] font-mono text-content-muted ml-auto flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> 0-3hr Window
              </span>
            </div>
            <NowcastWarningCard districtName={activeLocation.name} />
          </div>

          {/* Section: 5-Day District Warning Matrix for Active Location */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
              <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-content-primary">
                {t('alerts.fiveday_section')}
              </h2>
              <span className="text-[9px] font-mono text-content-muted ml-auto">
                Multi-Day Outlook
              </span>
            </div>
            <FiveDayWarningCard districtName={activeLocation.name} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-1">
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-content-primary px-0.5">
              {t('alerts.quick_actions')}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/radar"
                className="flex items-center gap-2.5 rounded-2xl border border-border-subtle bg-card p-3.5 hover:border-cyan-500/40 transition-all group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/12 text-cyan-500 group-hover:bg-cyan-500/20 transition-colors">
                  <Radio className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-content-primary block">Radar Studio</span>
                  <span className="text-[10px] text-content-muted">{overview?.radarStationsCount ?? 37} DWR Stations</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-content-muted group-hover:text-cyan-500 transition-colors" />
              </Link>

              <Link
                to="/cyclone"
                className="flex items-center gap-2.5 rounded-2xl border border-border-subtle bg-card p-3.5 hover:border-rose-500/40 transition-all group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/12 text-rose-500 group-hover:bg-rose-500/20 transition-colors">
                  <span className="text-base">🌀</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-content-primary block">Cyclone Tracker</span>
                  <span className="text-[10px] text-content-muted">{overview?.activeCyclonesCount ?? 0} Active</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-content-muted group-hover:text-rose-500 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Official IMD Announcements & PDF Advisories */}
      {activeTab === 'bulletins' && (
        <div className="animate-fadeIn">
          <IMDBulletinBoard />
        </div>
      )}

      {/* Footer Timestamp */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-content-muted pt-3">
        <Clock className="w-3 h-3" />
        <span>Last checked: {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="text-content-muted/50">•</span>
        <span>Source: IMD / MoES Official</span>
      </div>
    </div>
  );
};
