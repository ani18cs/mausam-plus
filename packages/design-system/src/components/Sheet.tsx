import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  // Prevent background scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
    >
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-border-strong bg-card p-6 shadow-floating max-h-[85vh] flex flex-col overflow-hidden transition-transform duration-250 animate-slideUp dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle Indicator */}
        <div className="w-12 h-1.5 bg-border-strong rounded-full mx-auto mb-4 opacity-70" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <h2 id="sheet-title" className="font-heading text-lg font-bold text-content-primary">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs font-medium text-content-muted mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full text-content-muted hover:bg-card-subtle hover:text-content-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            aria-label="Close bottom sheet"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pt-4 flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};
