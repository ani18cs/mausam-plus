import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert } from '@mausam/shared-types';
import { SeverityBadge, StateIllustration } from '@mausam/design-system';
import { useAppStore } from '../store/useAppStore';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle,
  Share2,
} from 'lucide-react';

export const AlertDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { activeLocation } = useAppStore();

  const [alert, setAlert] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlert = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const alertId = id || 'alert-rain-02';

        const url =
          `/api/alerts/${alertId}` +
          `?lat=${activeLocation.lat}` +
          `&lon=${activeLocation.lon}` +
          `&name=${encodeURIComponent(activeLocation.name)}`;

        const res = await fetch(url);

        if (!res.ok) {
          const data = await res.json().catch(() => null);

          throw new Error(
            data?.error || 'This alert is no longer active.'
          );
        }

        const data: Alert = await res.json();

        setAlert(data);
      } catch (err) {
        setAlert(null);

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load alert details.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlert();
  }, [
    id,
    activeLocation.lat,
    activeLocation.lon,
    activeLocation.name,
  ]);

  if (isLoading) {
    return (
      <div className="p-8">
        <StateIllustration
          type="loading"
          title="Loading Alert Telemetry"
          description="Fetching real-time biometeorological conditions and radar triggers..."
        />
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="p-6 max-w-md mx-auto space-y-4 text-xs">
        <StateIllustration
          type="alert-ended"
          title="Alert No Longer Active"
          description={error || 'Current atmospheric conditions for this station have returned to safe baselines.'}
          action={
            <button
              type="button"
              onClick={() => navigate('/alerts')}
              className="px-4 py-2 rounded-xl bg-accent-primary text-white font-bold text-xs"
            >
              View Active Warnings
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 text-xs">
      {/* Alert Header Sub-bar */}
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400">
          Explainable Advisory Trace
        </span>
        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: alert.title,
                text: `${alert.title} in ${alert.affectedRegion}: ${alert.headline}`,
                url: window.location.href,
              }).catch(() => {});
            }
          }}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-card-subtle text-content-primary hover:bg-card transition-colors"
          aria-label="Share alert"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alert Banner */}
      <div className="rounded-3xl border border-orange-500/30 bg-orange-500/10 p-5 space-y-3 dark:bg-orange-950/30">
        <div className="flex items-start justify-between gap-3">
          <SeverityBadge
            severity={alert.severity}
            label={alert.severity.toUpperCase()}
            size="lg"
          />

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

      {/* Advisory Details */}
      <div className="rounded-2xl border border-border-subtle bg-card p-4 space-y-2">
        <h3 className="font-heading font-bold text-content-primary">
          Advisory Details
        </h3>

        <p className="text-content-secondary leading-relaxed">
          {alert.message}
        </p>
      </div>

      {/* Reason Trace */}
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

              <p className="text-[10px] text-content-muted font-mono">
                {alert.reasonTrace.ruleName}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            {alert.reasonTrace.confidencePct}% confidence
          </span>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-content-primary">
            {alert.reasonTrace.summary}
          </p>

          <p className="text-content-secondary leading-relaxed">
            {alert.reasonTrace.explanation}
          </p>
        </div>

        {/* Factors */}
        <div className="space-y-2">
          <h4 className="font-heading text-[11px] font-bold uppercase tracking-wider text-content-muted">
            Factors & Thresholds
          </h4>

          {alert.reasonTrace.steps.map((step, idx) => (
            <div
              key={`${step.factor}-${idx}`}
              className="rounded-xl border border-border-subtle bg-card-subtle p-3 flex items-center justify-between gap-3"
            >
              <div>
                <span className="font-bold text-content-primary block">
                  {step.factor}
                </span>

                <span className="text-[10px] text-content-muted">
                  Contribution:{' '}
                  <span className="font-semibold uppercase">
                    {step.contribution}
                  </span>
                </span>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 block">
                  {step.observedValue}
                </span>

                <span className="text-[10px] text-content-muted">
                  Threshold {step.threshold}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="rounded-2xl bg-sky-500/10 dark:bg-sky-950/40 border border-sky-500/25 p-4 space-y-2">
          <h4 className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5 text-xs">
            <CheckCircle className="w-4 h-4" />
            Recommended Safety Actions
          </h4>

          <div className="whitespace-pre-line text-sky-950 dark:text-sky-200 leading-relaxed">
            {alert.reasonTrace.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
};