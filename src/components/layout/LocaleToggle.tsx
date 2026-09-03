import { useTranslation } from 'react-i18next';
import { LanguagesIcon } from '@/components/ui/icons';
import { LOCALE_LABEL } from '@/i18n/config';
import { useLocale } from '@/providers/LocaleProvider';

export function LocaleToggle() {
  const { t } = useTranslation();
  const { locale, toggleLocale } = useLocale();
  const next = locale === 'fa' ? 'en' : 'fa';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleLocale}
      aria-label={`${t('locale.label')} — ${LOCALE_LABEL[next]}`}
    >
      <span className="theme-toggle-icons" aria-hidden="true">
        <LanguagesIcon />
      </span>
      <span className="max-sm:sr-only">{LOCALE_LABEL[next]}</span>
    </button>
  );
}
