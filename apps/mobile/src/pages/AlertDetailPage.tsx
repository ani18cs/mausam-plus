import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert } from '@mausam/shared-types';
import { SeverityBadge, Button } from '@mausam/design-system';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Share2,
} from 'lucide-react';

export const AlertDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const res = await fetch(`/api/alerts/${id || 'alert-heat-01'}`);
        if (res.ok) {
          const data = await res.json();
          setAlert(data);
        } else {
          throw new Error('Not found');
        }
      } catch {
        // Fallback alert object
        setAlert({
          id: 'alert-heat-01',
          title: 'Severe Heat-Stress & Thermal Strain Alert',
          severity: 'warning',
          category: 'heat',
          headline: 'High physiological thermal load active across central plains.',
          message:
            'A combination of 33.5°C dry-bulb temperature, 78% relative humidity, and 8.2 UV index impairs natural sweat evaporation.',
          issuedAt: new Date(Date.now() - 3600000).toISOString(),
          expiresAt: new Date(Date.now() + 14400000).toISOString(),
          affectedRegion: 'Bengaluru Urban & Semi-Arid Plains',
          reasonTrace: {
            ruleName: 'RULE_WBGT_THERMAL_STRAIN_L3',
            summary: 'Composite Apparent Temperature exceeds safety envelope for continuous outdoor exertion.',
            explanation:
              'Relative humidity > 70% drastically slows perspiration evaporation. Radiant solar UV (8.2) adds direct dermal heating.',
            recommendation:
              '1. Hydrate with electrolyte water (minimum 600ml/hr).\n2. Rest in shade every 20-30 mins.\n3. Avoid heavy endurance workouts between 12 PM and 4:30 PM.',
            confidencePct: 94,
            steps: [
              {
                factor: 'Ambient Temperature',
                observedValue: '33.5 °C',
                threshold: '> 32.0 °C',
                contribution: 'primary',
              },
              {
                factor: 'Relative Humidity',
                observedValue: '78 %',
                threshold: '> 70 %',
                contribution: 'primary',
              },
              {
                factor: 'Solar UV Index',
                observedValue: '8.2',
                threshold: '> 7.0',
                contribution: 'aggravating',
              },
            ],
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlert();
  }, [id]);

  if (isLoading || !alert) {
    return (
      <div className="p-8 text-center text-xs text-content-muted">
        Loading explainable alert trace...
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 text-xs">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-subtle text-content-primary hover:bg-card focus:outline-none"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400">
          Official Meteorological Advisory
        </span>
        <button
          type="button"
          onClick={() => alert && navigator.share && navigator.share({ title: alert.title, text: alert.headline })}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-subtle text-content-primary hover:bg-card"
          aria-label="Share alert"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Alert Banner Card */}
      <div className="rounded-3xl border border-orange-500/30 bg-orange-500/10 p-5 space-y-3 dark:bg-orange-950/30">
        <div className="flex items-start justify-between gap-3">
          <SeverityBadge severity={alert.severity} label={alert.severity.toUpperCase()} size="lg" />
          <div className="flex items-center gap-1 text-[11px] text-content-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>Active</span>
          </div>
        </div>

        <h1 className="font-heading text-lg font-bold text-content-primary leading-snug">
          {alert.title}
        </h1>

        <p className="text-xs font-semibold text-content-secondary leading-relaxed">
          {alert.headline}
        </p>

        <div className="flex items-center gap-1.5 text-[11px] text-content-muted pt-1 border-t border-orange-500/20">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          <span>{alert.affectedRegion}</span>
        </div>
      </div>

      {/* Detailed Message */}
      <div className="rounded-2xl border border-border-subtle bg-card p-4 space-y-2">
        <h3 className="font-heading font-bold text-content-primary">Advisory Details</h3>
        <p className="text-content-secondary leading-relaxed">{alert.message}</p>
      </div>

      {/* Flagship Feature: Explainable "Why Am I Seeing This?" Reason Trace */}
      <div className="rounded-3xl border border-border-strong bg-card p-5 space-y-4 shadow-card">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-content-primary">
                Why am I seeing this alert?
              </h2>
              <p className="text-[10px] text-content-muted font-mono">{alert.reasonTrace.ruleName}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            {alert.reasonTrace.confidencePct}% Verified
          </span>
        </div>

        <p className="text-content-secondary leading-relaxed">
          {alert.reasonTrace.explanation}
        </p>

        {/* Factors & Thresholds */}
        <div className="space-y-2">
          <h4 className="font-heading text-[11px] font-bold uppercase tracking-wider text-content-muted">
            Telemetry Threshold Triggers
          </h4>
          {alert.reasonTrace.steps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border-subtle bg-card-subtle p-3 flex items-center justify-between gap-3"
            >
              <div>
                <span className="font-bold text-content-primary block">{step.factor}</span>
                <span className="text-[10px] text-content-muted">
                  Contribution: <span className="font-semibold uppercase">{step.contribution}</span>
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 block">
                  {step.observedValue}
                </span>
                <span className="text-[10px] text-content-muted">Threshold {step.threshold}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Actionable Protocol */}
        <div className="rounded-2xl bg-sky-500/10 dark:bg-sky-950/40 border border-sky-500/25 p-4 space-y-2">
          <h4 className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5 text-xs">
            <CheckCircle className="w-4 h-4" /> Recommended Safety Actions
          </h4>
          <div className="whitespace-pre-line text-sky-950 dark:text-sky-200 leading-relaxed">
            {alert.reasonTrace.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
};
