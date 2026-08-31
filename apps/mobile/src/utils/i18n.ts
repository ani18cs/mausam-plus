import i18n from 'i18next';
import { initReactI18next, useTranslation as useReactI18nextTranslation } from 'react-i18next';
import { SupportedLanguage } from '@mausam/shared-types';
import enLocale from '../locales/en.json';
import hiLocale from '../locales/hi.json';
import knLocale from '../locales/kn.json';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'hi', 'kn'];

export const LANGUAGE_METADATA: Record<SupportedLanguage, { label: string; nativeName: string; flag: string; localeCode: string }> = {
  en: { label: 'English', nativeName: 'English', flag: '🇬🇧', localeCode: 'en-IN' },
  hi: { label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', localeCode: 'hi-IN' },
  kn: { label: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', localeCode: 'kn-IN' },
};

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  kn: 'ಕನ್ನಡ (Kannada)',
};

const getStoredLanguage = (): SupportedLanguage => {
  try {
    const saved = localStorage.getItem('mausam_language');
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'kn')) {
      return saved as SupportedLanguage;
    }
  } catch (e) {
    // localStorage not accessible
  }
  return 'en';
};

const initialLang = getStoredLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enLocale },
    hi: { translation: hiLocale },
    kn: { translation: knLocale },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;

export const setAppLanguage = (lang: SupportedLanguage) => {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return;
  i18n.changeLanguage(lang);
  try {
    localStorage.setItem('mausam_language', lang);
  } catch (e) {
    // Ignore
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    if (lang === 'kn') {
      document.documentElement.classList.add('lang-kn');
    } else {
      document.documentElement.classList.remove('lang-kn');
    }
  }
};

// Ensure root attributes are set initially
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
  document.documentElement.setAttribute('data-lang', initialLang);
  if (initialLang === 'kn') {
    document.documentElement.classList.add('lang-kn');
  }
}

/**
 * Format numbers according to active locale
 */
export const formatNumber = (num: number, lang: SupportedLanguage = i18n.language as SupportedLanguage, options?: Intl.NumberFormatOptions): string => {
  const locale = LANGUAGE_METADATA[lang]?.localeCode || 'en-IN';
  return new Intl.NumberFormat(locale, options).format(num);
};

/**
 * Format dates according to active locale
 */
export const formatDate = (date: string | Date, lang: SupportedLanguage = i18n.language as SupportedLanguage, options?: Intl.DateTimeFormatOptions): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  const locale = LANGUAGE_METADATA[lang]?.localeCode || 'en-IN';
  const defaultOpts: Intl.DateTimeFormatOptions = options || {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat(locale, defaultOpts).format(d);
};

/**
 * Format time according to active locale
 */
export const formatTime = (timeStr: string | Date, lang: SupportedLanguage = i18n.language as SupportedLanguage): string => {
  let d: Date;
  if (typeof timeStr === 'string') {
    // Check if simple HH:mm
    if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
      const [h, m] = timeStr.split(':').map(Number);
      d = new Date();
      d.setHours(h, m, 0, 0);
    } else {
      d = new Date(timeStr);
    }
  } else {
    d = timeStr;
  }
  if (isNaN(d.getTime())) return String(timeStr);
  const locale = LANGUAGE_METADATA[lang]?.localeCode || 'en-IN';
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hour12: true }).format(d);
};

/**
 * Enhanced useTranslation hook supporting both react-i18next and translation helper
 */
export const useTranslation = () => {
  const { t: i18nextT, i18n: activeI18n } = useReactI18nextTranslation();
  const currentLang = (activeI18n.language || 'en') as SupportedLanguage;

  const t = (key: string, vars?: Record<string, any>): string => {
    return i18nextT(key, vars as any) as string;
  };

  return {
    t,
    language: currentLang,
    changeLanguage: setAppLanguage,
    formatNumber: (n: number, opts?: Intl.NumberFormatOptions) => formatNumber(n, currentLang, opts),
    formatDate: (d: string | Date, opts?: Intl.DateTimeFormatOptions) => formatDate(d, currentLang, opts),
    formatTime: (ts: string | Date) => formatTime(ts, currentLang),
  };
};
