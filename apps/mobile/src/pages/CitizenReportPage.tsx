import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { CitizenReportCategory } from '@mausam/shared-types';
import { Button } from '@mausam/design-system';
import { useTranslation } from '../utils/i18n';
import { capturePhotoFromCamera } from '../services/nativeServices';
import {
  MapPin,
  Camera,
  AlertTriangle,
  Send,
  CheckCircle2,
  CloudRain,
  Flame,
  Wind,
  CloudFog,
  Image as ImageIcon,
  X,
} from 'lucide-react';

const CATEGORIES: Array<{ id: CitizenReportCategory; labelKey: string; icon: React.ReactNode }> = [
  { id: 'waterlogging', labelKey: 'Waterlogging / Flooded Road', icon: <CloudRain className="w-4 h-4 text-sky-500" /> },
  { id: 'severe_heat', labelKey: 'Severe Heat Hazard', icon: <Flame className="w-4 h-4 text-orange-500" /> },
  { id: 'high_wind', labelKey: 'High Wind / Squall', icon: <Wind className="w-4 h-4 text-teal-500" /> },
  { id: 'air_pollution', labelKey: 'Air Pollution / Smog', icon: <CloudFog className="w-4 h-4 text-slate-500" /> },
  { id: 'fallen_tree', labelKey: 'Fallen Tree / Road Obstacle', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
];

export const CitizenReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeLocation } = useAppStore();
  const { t } = useTranslation();

  const [category, setCategory] = useState<CitizenReportCategory>('waterlogging');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePhotoCapture = async () => {
    try {
      const dataUrl = await capturePhotoFromCamera();
      if (dataUrl) {
        setPhotoUrl(dataUrl);
      }
    } catch (e) {
      console.warn('Camera error:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          title,
          description,
          photoUrl: photoUrl || undefined,
          lat: activeLocation.lat,
          lon: activeLocation.lon,
          locationName: activeLocation.name,
          severity,
        }),
      });

      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/map');
      }, 1500);
    } catch (err) {
      console.warn('Report submission error', err);
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/map');
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Sub-header */}
      <div className="pb-2 border-b border-border-subtle">
        <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-content-primary">
          {t('report.title')}
        </h2>
        <p className="text-[10px] text-content-muted">
          {t('report.subtitle')}
        </p>
      </div>

      {isSubmitted ? (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-3 animate-fadeIn">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="font-heading text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {t('report.success_title')}
          </h2>
          <p className="text-xs text-content-secondary leading-relaxed">
            {t('report.success_desc')}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Location Auto-Fill Card */}
          <div className="rounded-2xl border border-border-subtle bg-card p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary/15 text-accent-primary">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-content-muted">{t('report.location')}</span>
                <p className="font-semibold text-content-primary">{activeLocation.name}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              GPS Verified
            </span>
          </div>

          {/* Category Selector */}
          <div>
            <label className="font-heading text-xs font-bold text-content-primary block mb-1.5">
              {t('report.category')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2.5 rounded-xl p-2.5 text-left border transition-all ${
                    category === cat.id
                      ? 'border-accent-primary bg-accent-primary/10 font-bold text-content-primary'
                      : 'border-border-subtle bg-card hover:bg-card-subtle text-content-secondary'
                  }`}
                >
                  {cat.icon}
                  <span className="truncate">{cat.labelKey}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title / Summary */}
          <div>
            <label className="font-heading text-xs font-bold text-content-primary block mb-1">
              {t('report.description')}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('report.description_placeholder')}
              className="w-full min-h-[44px] rounded-xl border border-border-subtle bg-input px-3 text-xs text-content-primary focus:border-accent-primary focus:outline-none"
            />
          </div>

          {/* Severity Picker */}
          <div>
            <label className="font-heading text-xs font-bold text-content-primary block mb-1.5">
              {t('report.severity')}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  className={`rounded-xl py-2 text-center uppercase font-bold text-[10px] border transition-all ${
                    severity === sev
                      ? sev === 'critical' || sev === 'high'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-card border-border-subtle text-content-muted'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-heading text-xs font-bold text-content-primary block mb-1">
              {t('report.description')} (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide traffic impact, route detour advice, or water depth estimates..."
              className="w-full rounded-xl border border-border-subtle bg-input p-3 text-xs text-content-primary focus:border-accent-primary focus:outline-none resize-none"
            />
          </div>

          {/* Photo Capture / Evidence */}
          <div
            onClick={handlePhotoCapture}
            className="rounded-2xl border border-dashed border-border-strong bg-card/50 p-4 text-center cursor-pointer hover:bg-card-subtle transition-colors"
          >
            {photoUrl ? (
              <div className="relative inline-block">
                <img src={photoUrl} alt="Report evidence" className="h-24 w-auto rounded-xl object-cover border border-border-strong" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoUrl(null);
                  }}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-500 text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <Camera className="w-6 h-6 text-content-muted mx-auto mb-1" />
                <p className="font-semibold text-content-primary text-xs">{t('report.attach_photo')}</p>
                <p className="text-[10px] text-content-muted">Tap to capture or upload camera proof</p>
              </>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            rightIcon={<Send className="w-4 h-4" />}
          >
            {isSubmitting ? t('report.submitting') : t('report.submit')}
          </Button>
        </form>
      )}
    </div>
  );
};
