import React from 'react';
import { SupportedLanguage } from '@mausam/shared-types';
import { LANGUAGE_METADATA, useTranslation } from '../../utils/i18n';
import { Globe, AlertCircle } from 'lucide-react';
import { Button } from '@mausam/design-system';

interface LanguageConfirmModalProps {
  isOpen: boolean;
  targetLanguage: SupportedLanguage | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LanguageConfirmModal: React.FC<LanguageConfirmModalProps> = ({
  isOpen,
  targetLanguage,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !targetLanguage) return null;

  const targetMeta = LANGUAGE_METADATA[targetLanguage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-card border border-border-strong p-5 space-y-4 shadow-2xl animate-scaleUp">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-content-primary">
              {t('lang_modal.title')}
            </h3>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {targetMeta.flag} {targetMeta.nativeName} ({targetMeta.label})
            </p>
          </div>
        </div>

        {/* Warning / Explanation message */}
        <div className="rounded-2xl bg-card-subtle border border-border-subtle p-3 text-xs text-content-secondary leading-relaxed flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p>
            {t('lang_modal.confirm_msg', {
              lang: `${targetMeta.nativeName} (${targetMeta.label})`,
            })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="outline" size="md" onClick={onCancel}>
            {t('lang_modal.cancel_btn')}
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm}>
            {t('lang_modal.confirm_btn')}
          </Button>
        </div>
      </div>
    </div>
  );
};
