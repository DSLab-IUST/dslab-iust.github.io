import { useCallback } from 'react';
import { useLocale } from '@/providers/LocaleProvider';
import type { Localized } from '@/types/content';

/** Reads the active language, falling back to the other one when it is empty. */
export function useLocalized(): (value: Localized | undefined) => string {
  const { locale } = useLocale();

  return useCallback(
    (value) => {
      if (!value) return '';
      const preferred = value[locale]?.trim();
      return preferred || value[locale === 'fa' ? 'en' : 'fa']?.trim() || '';
    },
    [locale],
  );
}
