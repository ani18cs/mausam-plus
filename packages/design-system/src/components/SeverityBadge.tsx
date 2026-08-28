import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, Flame } from 'lucide-react';
import { SeverityType } from '../tokens';

interface SeverityBadgeProps {
  severity: SeverityType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const severityConfig: Record<
  SeverityType,
  {
    icon: React.ComponentType<{ className?: string }>;
    defaultLabel: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
  }
> = {
  info: {
    icon: AlertCircle,
    defaultLabel: 'Advisory / Information',
    bgClass: 'bg-sky-500/10 dark:bg-sky-950/40',
    borderClass: 'border-sky-500/30',
    textClass: 'text-sky-700 dark:text-sky-300',
  },
  safe: {
    icon: ShieldCheck,
    defaultLabel: 'Safe / Low Risk',
    bgClass: 'bg-severity-safe-bg',
    borderClass: 'border-severity-safe-border',
    textClass: 'text-severity-safe-text dark:text-emerald-300',
  },
  caution: {
    icon: AlertCircle,
    defaultLabel: 'Caution / Moderate',
    bgClass: 'bg-severity-caution-bg',
    borderClass: 'border-severity-caution-border',
    textClass: 'text-severity-caution-text dark:text-amber-300',
  },
  warning: {
    icon: AlertTriangle,
    defaultLabel: 'Warning / High',
    bgClass: 'bg-severity-warning-bg',
    borderClass: 'border-severity-warning-border',
    textClass: 'text-severity-warning-text dark:text-orange-300',
  },
  severe: {
    icon: Flame,
    defaultLabel: 'Severe Hazard',
    bgClass: 'bg-severity-severe-bg',
    borderClass: 'border-severity-severe-border',
    textClass: 'text-severity-severe-text dark:text-rose-300',
  },
};

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  label,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const config = severityConfig[severity] || severityConfig.safe;
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${config.bgClass} ${config.borderClass} ${config.textClass} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      {showIcon && <Icon className={`${iconSizes} flex-shrink-0`} aria-hidden="true" />}
      <span>{displayLabel}</span>
    </span>
  );
};
