import { createContext, use, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_DIRECTION,
  type Direction,
  type Locale,
} from '@/i18n/config';
import { storageKeys, writeStorage } from '@/lib/storage';
import { runViewTransition } from '@/lib/viewTransition';

interface LocaleContextValue {
  locale: Locale;
  direction: Direction;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  const locale: Locale = isLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LOCALE;
  const direction = LOCALE_DIRECTION[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;

      runViewTransition(
        'locale',
        () => {
          void i18n.changeLanguage(next);
          writeStorage(storageKeys.locale, next);
        },
        { direction: LOCALE_DIRECTION[next] === 'rtl' ? -1 : 1 },
      );
    },
    [i18n, locale],
  );

  const toggleLocale = useCallback(
    () => setLocale(locale === 'fa' ? 'en' : 'fa'),
    [locale, setLocale],
  );

  const value = useMemo(
    () => ({ locale, direction, setLocale, toggleLocale }),
    [locale, direction, setLocale, toggleLocale],
  );

  return <LocaleContext value={value}>{children}</LocaleContext>;
}

export function useLocale(): LocaleContextValue {
  const context = use(LocaleContext);
  if (!context) throw new Error('useLocale must be used inside <LocaleProvider>.');
  return context;
}
