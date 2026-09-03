import { TextAreaField, TextField } from '@/components/ui/Field';
import type { Locale } from '@/i18n/config';
import type { Localized } from '@/types/content';

interface LocalizedFieldProps {
  value: Localized;
  onChange: (value: Localized) => void;
  labels: Record<Locale, string>;
  /** Applied to the Persian half, which carries the required-field rule. */
  error?: string;
  multiline?: boolean;
}

/** Renders the Persian and English halves of a bilingual field side by side. */
export function LocalizedField({
  value,
  onChange,
  labels,
  error,
  multiline = false,
}: LocalizedFieldProps) {
  const half = (locale: Locale) => {
    const shared = {
      label: labels[locale],
      dir: locale === 'fa' ? ('rtl' as const) : ('ltr' as const),
      lang: locale,
      value: value[locale],
      ...(locale === 'fa' && error ? { error } : {}),
    };

    return multiline ? (
      <TextAreaField
        {...shared}
        rows={4}
        onChange={(event) => onChange({ ...value, [locale]: event.target.value })}
      />
    ) : (
      <TextField
        {...shared}
        onChange={(event) => onChange({ ...value, [locale]: event.target.value })}
      />
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {half('fa')}
      {half('en')}
    </div>
  );
}
