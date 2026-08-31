import enLocale from './locales/en.json';
import hiLocale from './locales/hi.json';
import knLocale from './locales/kn.json';
import { SupportedLanguage } from './index';

export const LOCALE_RESOURCES: Record<SupportedLanguage, typeof enLocale> = {
  en: enLocale,
  hi: hiLocale,
  kn: knLocale,
};

export function getLocalizedTemplate(
  lang: SupportedLanguage,
  keyPath: string,
  variables: Record<string, string | number> = {}
): string {
  const dict = LOCALE_RESOURCES[lang] || LOCALE_RESOURCES.en;
  const parts = keyPath.split('.');
  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = null;
      break;
    }
  }

  if (typeof current !== 'string') {
    // Fallback to english
    let fallback: any = LOCALE_RESOURCES.en;
    for (const part of parts) {
      if (fallback && typeof fallback === 'object' && part in fallback) {
        fallback = fallback[part];
      } else {
        fallback = keyPath;
        break;
      }
    }
    current = typeof fallback === 'string' ? fallback : keyPath;
  }

  let result = current as string;
  for (const [vKey, vVal] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${vKey}\\}`, 'g'), String(vVal));
  }
  return result;
}
