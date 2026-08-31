import React from 'react';

export interface StateIllustrationProps {
  type: 'loading' | 'empty' | 'offline' | 'success' | 'alert-ended';
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const StateIllustration: React.FC<StateIllustrationProps> = ({
  type,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-6 space-y-3 ${className}`}>
      {type === 'loading' && (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-16 h-16 text-accent-primary animate-spin" viewBox="0 0 64 64" fill="none">
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="40 120"
              className="opacity-80"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-accent-primary animate-ping" />
          </div>
        </div>
      )}

      {type === 'empty' && (
        <div className="w-16 h-16 rounded-2xl bg-card-subtle flex items-center justify-center border border-border-subtle shadow-sm">
          <svg className="w-9 h-9 text-content-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            <circle cx="11" cy="13" r="2" />
          </svg>
        </div>
      )}

      {type === 'alert-ended' && (
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-sm text-emerald-500">
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
      )}

      {type === 'offline' && (
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-sm text-amber-500">
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </div>
      )}

      {title && (
        <h3 className="font-heading text-sm font-bold text-content-primary">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-xs text-content-muted max-w-xs leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
