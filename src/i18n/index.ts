import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { readStorage, storageKeys } from '@/lib/storage';
import { DEFAULT_LOCALE, isLocale, LOCALES } from './config';
import { en } from './locales/en';
import { fa } from './locales/fa';

const NAMESPACE = 'app';

const stored = readStorage(storageKeys.locale);

void i18next.use(initReactI18next).init({
  resources: {
    fa: { [NAMESPACE]: fa },
    en: { [NAMESPACE]: en },
  },
  lng: isLocale(stored) ? stored : DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: [...LOCALES],
  defaultNS: NAMESPACE,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export { i18next };
