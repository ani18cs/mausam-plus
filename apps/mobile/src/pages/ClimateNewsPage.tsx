import React, { useState } from 'react';
import { useTranslation } from '../utils/i18n';
import { WEATHER_NEWS_ARTICLES } from '../data/newsData';
import { NewsArticle } from '@mausam/shared-types';
import {
  Newspaper,
  Search,
  Flame,
  CloudRain,
  Wind,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  X,
  Bookmark,
  Info,
  Radio,
} from 'lucide-react';

export const ClimateNewsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getTranslatedArticle = (article: NewsArticle): NewsArticle => {
    const keyNumber = article.id.replace('news-', 'art');
    const titleKey = `news.${keyNumber}.title`;
    const summaryKey = `news.${keyNumber}.summary`;
    const contentKey = `news.${keyNumber}.content`;

    const title = t(titleKey) !== titleKey ? t(titleKey) : article.title;
    const summary = t(summaryKey) !== summaryKey ? t(summaryKey) : article.summary;
    const content = t(contentKey) !== contentKey ? t(contentKey) : article.content;

    return {
      ...article,
      title,
      summary,
      content,
    };
  };

  const filteredArticles = WEATHER_NEWS_ARTICLES.map(getTranslatedArticle).filter((art: NewsArticle) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'monsoon' && art.category === 'monsoon') ||
      (selectedCategory === 'heatwave' && art.category === 'heatwave') ||
      (selectedCategory === 'aqi' && art.category === 'aqi') ||
      (selectedCategory === 'cyclone' && art.category === 'cyclone') ||
      (selectedCategory === 'imd_advisory' && (art.category === 'imd_advisory' || art.verifiedIMD));

    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.relatedLocation && art.relatedLocation.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const categories = [
    { key: 'all', label: t('news.filter_all') },
    { key: 'monsoon', label: t('news.filter_monsoon') },
    { key: 'heatwave', label: t('news.filter_heatwave') },
    { key: 'aqi', label: t('news.filter_aqi') },
    { key: 'cyclone', label: t('news.filter_cyclone') },
    { key: 'imd_advisory', label: t('news.filter_imd') },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-3 space-y-4 max-w-lg mx-auto">
      {/* 1. Official IMD News Wire Header */}
      <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 p-4 text-white shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
          <Newspaper className="w-32 h-32 text-sky-400" />
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500 text-white font-bold text-xs shadow-sm">
            IMD
          </div>
          <span className="text-[11px] font-bold tracking-wide uppercase text-sky-300">
            {t('imd.ministry')}
          </span>
        </div>

        <h1 className="font-heading text-xl font-extrabold text-white tracking-tight">
          {t('news.page_title')}
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          {t('news.page_subtitle')}
        </p>

        {/* Live Wire Broadcast Pulse */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-sky-500/20 text-[11px] font-medium text-sky-200">
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse flex-shrink-0" />
          <span className="truncate">
            Live Bulletin: Doppler Radar Active Across 37 Regional Stations
          </span>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('news.search_placeholder')}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border-strong bg-card text-content-primary text-xs placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedCategory(cat.key)}
            className={`flex-shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              selectedCategory === cat.key
                ? 'bg-accent-primary text-white shadow-sm'
                : 'bg-card border border-border-subtle text-content-secondary hover:bg-card-subtle'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4. Articles Feed */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-card border border-border-subtle">
            <Info className="w-8 h-8 text-content-muted mx-auto mb-2" />
            <p className="text-xs font-semibold text-content-secondary">
              No bulletins match your search criteria.
            </p>
          </div>
        ) : (
          filteredArticles.map((article: NewsArticle) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer rounded-2xl border border-border-subtle bg-card p-4 shadow-card hover:border-accent-primary/50 transition-all active:scale-[0.99]"
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-md bg-accent-primary/10 px-2 py-0.5 text-[10px] font-bold text-accent-primary uppercase tracking-wide">
                    {article.category.replace('_', ' ')}
                  </span>
                  {article.verifiedIMD && (
                    <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{t('news.verified_badge')}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-content-muted">
                  <button
                    type="button"
                    onClick={(e) => toggleSave(e, article.id)}
                    className="p-1 hover:text-accent-primary transition-colors"
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        savedIds.includes(article.id)
                          ? 'fill-accent-primary text-accent-primary'
                          : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Title & Summary */}
              <h3 className="font-heading text-sm font-bold text-content-primary group-hover:text-accent-primary transition-colors leading-snug line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-content-secondary mt-1.5 line-clamp-2 leading-relaxed">
                {article.summary}
              </p>

              {/* Footer Metadata */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border-subtle/50 text-[11px] text-content-muted">
                <div className="flex items-center gap-3">
                  {article.relatedLocation && (
                    <span className="font-medium text-accent-primary">
                      📍 {article.relatedLocation}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {article.readTimeMinutes} {t('news.min_read')}
                  </span>
                </div>

                <span className="flex items-center gap-1 font-bold text-accent-primary group-hover:translate-x-0.5 transition-transform">
                  {t('news.read_full')} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Full Story Modal Reader */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-card border border-border-strong p-6 shadow-floating space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2.5 py-1 text-xs font-bold uppercase">
                {selectedArticle.category.replace('_', ' ')}
              </span>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-full hover:bg-card-subtle text-content-muted hover:text-content-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Metadata */}
            <div className="space-y-2">
              <h2 className="font-heading text-lg font-extrabold text-content-primary leading-snug">
                {selectedArticle.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-content-muted pb-2 border-b border-border-subtle">
                <span className="font-semibold text-content-primary">{selectedArticle.source}</span>
                <span>•</span>
                <span>{selectedArticle.author || 'IMD Forecaster'}</span>
                <span>•</span>
                <span>📍 {selectedArticle.relatedLocation || 'National'}</span>
              </div>
            </div>

            {/* Article Body */}
            <div className="text-xs sm:text-sm text-content-secondary leading-relaxed space-y-3 whitespace-pre-line">
              {selectedArticle.content}
            </div>

            {/* Official Advisory Banner */}
            <div className="rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/50 p-3 text-xs text-sky-900 dark:text-sky-200">
              <p className="font-bold flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>{t('imd.org_name')} Official Advisory</span>
              </p>
              <p className="text-[11px] leading-normal opacity-90">
                Issued for public safety and disaster readiness under the National Cyclone Risk Mitigation Project (NCRMP).
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="w-full py-2.5 rounded-xl bg-accent-primary text-white font-bold text-xs shadow-sm hover:brightness-110 active:scale-95 transition-all"
              >
                {t('btn.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
