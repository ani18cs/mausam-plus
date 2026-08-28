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
  whyLabel = 'Why?',
  className = '',
  headerAction,
}) => {
  return (
    <article
      data-card-id={id}
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-card/90 p-4 sm:p-5 shadow-card backdrop-blur-md transition-all duration-200 hover:border-border-strong dark:bg-card/75 ${className}`}
    >
      {/* Top Header: Icon Top-Left + Title + Badge / HeaderAction */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-primary-subtle text-accent-primary dark:bg-sky-950/60 dark:text-sky-400">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate font-heading text-base font-semibold text-content-primary tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="truncate text-xs font-medium text-content-muted">
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
        </div>
      </div>

      {/* Main Card Body */}
      <div className="my-2 flex-1">{children}</div>

      {/* Card Footer: Standard Muscle-Memory 'Why?' Affordance (Bottom-Right) */}
      {onWhyClick && (
        <div className="mt-3 flex items-center justify-end border-t border-border-subtle/60 pt-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onWhyClick(id);
            }}
            className="group flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-content-muted transition-colors hover:bg-card-subtle hover:text-content-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            aria-label={`Understand why you are seeing the ${title} recommendation`}
          >
            <HelpCircle className="h-3.5 w-3.5 text-accent-primary transition-transform group-hover:scale-110" />
            <span className="text-xs font-semibold">{whyLabel}</span>
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </article>
  );
};
