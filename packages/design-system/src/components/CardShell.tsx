import React from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import { SeverityType } from '../tokens';

export interface CardShellProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: {
    severity: SeverityType;
    label: string;
  };
  children: React.ReactNode;
  onWhyClick?: (cardId: string) => void;
  whyLabel?: string;
  className?: string;
  headerAction?: React.ReactNode;
}

export const CardShell: React.FC<CardShellProps> = ({
  id,
  title,
  subtitle,
  icon,
  badge,
  children,
  onWhyClick,
  whyLabel = 'Why this?',
  className = '',
  headerAction,
}) => {
  return (
    <article
      data-card-id={id}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-card/90 p-4 sm:p-5 shadow-card backdrop-blur-md transition-all duration-200 hover:border-border-strong dark:bg-card/75 ${className}`}
    >
      {/* Top Header: Clean Icon + Title + Subtitle + Badge / Why button */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-accent-primary-subtle text-accent-primary dark:bg-sky-950/60 dark:text-sky-400">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate font-heading text-sm font-bold text-content-primary tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="truncate text-[11px] font-medium text-content-muted">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {badge && (
            <SeverityBadge
              severity={badge.severity}
              label={badge.label}
              size="sm"
            />
          )}
          {headerAction}
          {onWhyClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onWhyClick(id);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-content-muted hover:bg-card-subtle hover:text-accent-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-primary"
              aria-label={`Understand why you are seeing the ${title} recommendation`}
              title={whyLabel}
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Card Body */}
      <div className="flex-1">{children}</div>
    </article>
  );
};

