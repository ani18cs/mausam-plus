import React, { useState } from 'react';
import { NewsArticle } from '@mausam/shared-types';
import { WEATHER_NEWS_ARTICLES } from '../../data/newsData';
import { useTranslation } from '../../utils/i18n';
import { Newspaper, Clock, ShieldCheck, ArrowRight, X, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@mausam/design-system';

export const WeatherNewsFeed: React.FC = () => {
  const { t } = useTranslation();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const getCategoryBadge = (category: NewsArticle['category']) => {
    switch (category) {
      case 'monsoon':
        return { label: 'Monsoon Tracker', color: 'bg-sky-500/15 text-sky-600 dark:text-sky-400' };
      case 'heatwave':
        return { label: 'Heatwave Alert', color: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' };
      case 'aqi':
        return { label: 'Air Quality & Pollen', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' };
      case 'cyclone':
        return { label: 'Cyclone Watch', color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' };
      case 'imd_advisory':
      default:
        return { label: 'IMD Advisory', color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' };
    }
  };

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400">
            <Newspaper className="w-4 h-4" />
          </div>
          <h2 className="font-heading text-sm font-bold text-content-primary">
            {t('news.section_title')}
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-accent-primary flex items-center gap-0.5">
          AccuWeather Wire
        </span>
      </div>

      {/* Horizontal Scrolling News Cards Carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
        {WEATHER_NEWS_ARTICLES.map((article) => {
          const badge = getCategoryBadge(article.category);
          return (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="flex-shrink-0 w-72 rounded-2xl border border-border-subtle bg-card overflow-hidden shadow-sm hover:shadow-card hover:border-border-strong transition-all cursor-pointer snap-start flex flex-col justify-between"
            >
              {/* Card Image Thumbnail */}
              {article.imageUrl && (
                <div className="relative h-32 w-full overflow-hidden bg-slate-800">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  {article.verifiedIMD && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              )}

              {/* Text content */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-xs font-bold text-content-primary line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-[11px] text-content-secondary line-clamp-2 mt-1 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-content-muted pt-2 border-t border-border-subtle/50">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTimeMinutes} {t('news.min_read')}</span>
                  </div>
                  <span className="font-semibold text-accent-primary flex items-center gap-0.5">
                    Read Story <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg max-h-[85vh] rounded-3xl bg-card border border-border-strong overflow-hidden shadow-2xl flex flex-col animate-scaleUp">
            {/* Modal Image Header */}
            {selectedArticle.imageUrl && (
              <div className="relative h-44 w-full overflow-hidden bg-slate-900 flex-shrink-0">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${getCategoryBadge(selectedArticle.category).color}`}>
                    {getCategoryBadge(selectedArticle.category).label}
                  </span>
                  {selectedArticle.relatedLocation && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedArticle.relatedLocation}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Modal Article Body */}
            <div className="p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
              <div className="flex items-center justify-between text-[11px] text-content-muted">
                <span className="font-semibold text-accent-primary">{selectedArticle.source}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedArticle.readTimeMinutes} {t('news.min_read')}
                </span>
              </div>

              <h2 className="font-heading text-base font-bold text-content-primary leading-snug">
                {selectedArticle.title}
              </h2>

              {selectedArticle.author && (
                <p className="text-[11px] font-semibold text-content-secondary">
                  By {selectedArticle.author}
                </p>
              )}

              <div className="h-px bg-border-subtle" />

              <div className="text-content-secondary leading-relaxed whitespace-pre-line text-xs">
                {selectedArticle.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border-subtle bg-card-subtle flex justify-end">
              <Button variant="primary" size="md" onClick={() => setSelectedArticle(null)}>
                {t('btn.close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
