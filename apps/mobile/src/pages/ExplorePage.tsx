import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Radio,
  Newspaper,
  Map,
  MessageSquarePlus,
  ChevronRight,
  Zap,
  Waves,
  Route,
  Tractor,
  Mountain,
  CloudLightning,
} from 'lucide-react';
import { useTranslation } from '../utils/i18n';

interface IMDOverview {
  activeNowcastsCount: number;
  criticalWarningsCount: number;
  activeCyclonesCount: number;
  monitoredStationsCount: number;
  radarStationsCount: number;
}

interface CategoryCard {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  icon: React.ReactNode;
  accentColor: string;
  borderHover: string;
  bgAccent: string;
  liveLabel?: string;
  liveLabelColor?: string;
}

export const ExplorePage: React.FC = () => {
  const { t } = useTranslation();
  const [overview, setOverview] = useState<IMDOverview | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch('/api/imd/overview');
        if (res.ok) {
          const json = await res.json();
          if (json.data) setOverview(json.data);
        }
      } catch (err) {
        console.error('Failed to load IMD overview', err);
      }
    };
    fetchOverview();
  }, []);

  const categories: CategoryCard[] = [
    {
      id: 'radar',
      title: t('explore.radar_title'),
      subtitle: t('explore.radar_subtitle'),
      route: '/radar',
      icon: <Radio className="w-5 h-5" />,
      accentColor: 'text-cyan-500',
      borderHover: 'hover:border-cyan-500/40',
      bgAccent: 'bg-cyan-500/12',
      liveLabel: `${overview?.radarStationsCount ?? 37} DWR Stations`,
      liveLabelColor: 'text-cyan-500',
    },
    {
      id: 'cyclone',
      title: t('explore.cyclone_title'),
      subtitle: t('explore.cyclone_subtitle'),
      route: '/cyclone',
      icon: <Waves className="w-5 h-5" />,
      accentColor: 'text-rose-500',
      borderHover: 'hover:border-rose-500/40',
      bgAccent: 'bg-rose-500/12',
      liveLabel: `${overview?.activeCyclonesCount ?? 0} Tracked`,
      liveLabelColor: 'text-rose-500',
    },
    {
      id: 'specialized',
      title: t('explore.specialized_title'),
      subtitle: t('explore.specialized_subtitle'),
      route: '/specialized',
      icon: <Mountain className="w-5 h-5" />,
      accentColor: 'text-emerald-500',
      borderHover: 'hover:border-emerald-500/40',
      bgAccent: 'bg-emerald-500/12',
      liveLabel: 'Highways · Agro · Yatra',
      liveLabelColor: 'text-emerald-500',
    },
    {
      id: 'news',
      title: t('explore.news_title'),
      subtitle: t('explore.news_subtitle'),
      route: '/news',
      icon: <Newspaper className="w-5 h-5" />,
      accentColor: 'text-violet-500',
      borderHover: 'hover:border-violet-500/40',
      bgAccent: 'bg-violet-500/12',
    },
    {
      id: 'map',
      title: t('explore.map_title'),
      subtitle: t('explore.map_subtitle'),
      route: '/map',
      icon: <Map className="w-5 h-5" />,
      accentColor: 'text-amber-500',
      borderHover: 'hover:border-amber-500/40',
      bgAccent: 'bg-amber-500/12',
      liveLabel: `${overview?.monitoredStationsCount ?? 50} Stations`,
      liveLabelColor: 'text-amber-500',
    },
    {
      id: 'report',
      title: t('explore.report_title'),
      subtitle: t('explore.report_subtitle'),
      route: '/report',
      icon: <MessageSquarePlus className="w-5 h-5" />,
      accentColor: 'text-sky-500',
      borderHover: 'hover:border-sky-500/40',
      bgAccent: 'bg-sky-500/12',
    },
  ];

  return (
    <div className="space-y-5 p-4 max-w-lg mx-auto pb-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-heading text-base font-extrabold text-content-primary tracking-tight flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary">
            <Compass className="w-4 h-4" />
          </div>
          {t('explore.page_title')}
        </h1>
        <p className="text-[11px] text-content-muted font-medium pl-9">
          {t('explore.page_subtitle')}
        </p>
      </div>

      {/* National Status Strip */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-2 rounded-2xl border border-border-subtle bg-card-subtle/50 px-3.5 py-2.5"
      >
        <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span className="text-[11px] font-semibold text-content-secondary">
          <strong className="text-amber-500">{overview?.activeNowcastsCount ?? 2}</strong> active nowcasts
          <span className="text-content-muted mx-1.5">·</span>
          <strong className="text-rose-500">{overview?.criticalWarningsCount ?? 2}</strong> critical warnings
          <span className="text-content-muted mx-1.5">·</span>
          <strong className="text-cyan-500">{overview?.activeCyclonesCount ?? 1}</strong> cyclone tracked
        </span>
      </motion.div>

      {/* Category Cards Grid */}
      <div className="space-y-2.5">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.04 * index }}
          >
            <Link
              to={cat.route}
              className={`flex items-center gap-3.5 rounded-2xl border border-border-subtle bg-card p-4 ${cat.borderHover} transition-all group active:scale-[0.98]`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${cat.bgAccent} ${cat.accentColor} group-hover:scale-105 transition-transform flex-shrink-0`}>
                {cat.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-content-primary">{cat.title}</span>
                  {cat.liveLabel && (
                    <span className={`text-[9px] font-bold ${cat.liveLabelColor} bg-card-subtle px-1.5 py-0.5 rounded-md`}>
                      {cat.liveLabel}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug">{cat.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-content-muted group-hover:text-content-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* IMD Source Attribution */}
      <div className="text-center pt-2">
        <p className="text-[10px] text-content-muted font-medium">
          Data sourced from <strong>India Meteorological Department (IMD)</strong>
        </p>
        <p className="text-[9px] text-content-muted/60 mt-0.5">
          Ministry of Earth Sciences (MoES), Govt. of India
        </p>
      </div>
    </div>
  );
};
