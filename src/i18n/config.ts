export const LOCALES = ['fa', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export type Direction = 'rtl' | 'ltr';

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_DIRECTION: Record<Locale, Direction> = {
  fa: 'rtl',
  en: 'ltr',
};

/** Persian dates are shown on the Solar Hijri calendar with Persian digits. */
export const LOCALE_TAG: Record<Locale, string> = {
  fa: 'fa-IR-u-ca-persian',
  en: 'en-GB',
};

export const LOCALE_LABEL: Record<Locale, string> = {
  fa: 'فارسی',
  en: 'English',
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
