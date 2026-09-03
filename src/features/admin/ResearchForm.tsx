import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@/components/ui/Field';
import type { ResearchArea } from '@/types/content';
import { FormActions } from './FormActions';
import { LocalizedField } from './LocalizedField';
import { formatList, isBlank, parseList, useEntityForm, type FieldErrors } from './useEntityForm';

interface ResearchFormProps {
  initial: ResearchArea;
  pending: boolean;
  onSubmit: (area: ResearchArea) => void;
  onCancel: () => void;
}

export function ResearchForm({ initial, pending, onSubmit, onCancel }: ResearchFormProps) {
  const { t } = useTranslation();

  const validate = useCallback(
    (draft: ResearchArea): FieldErrors<ResearchArea> => {
      const errors: FieldErrors<ResearchArea> = {};

      if (isBlank(draft.title.fa)) errors.title = t('form.errors.required');
      if (isBlank(draft.summary.fa)) errors.summary = t('form.errors.required');
      if (!Number.isFinite(draft.order)) errors.order = t('form.errors.number');

      return errors;
    },
    [t],
  );

  const { draft, errors, setField, handleSubmit } = useEntityForm(initial, validate);

  return (
    <form className="stack-sm" onSubmit={handleSubmit(onSubmit)} noValidate>
      <LocalizedField
        value={draft.title}
        onChange={(value) => setField('title', value)}
        labels={{ fa: t('form.titleFa'), en: t('form.titleEn') }}
        {...(errors.title ? { error: errors.title } : {})}
      />

      <LocalizedField
        multiline
        value={draft.summary}
        onChange={(value) => setField('summary', value)}
        labels={{ fa: t('form.summaryFa'), en: t('form.summaryEn') }}
        {...(errors.summary ? { error: errors.summary } : {})}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label={t('form.glyph')}
          maxLength={4}
          value={draft.glyph}
          onChange={(event) => setField('glyph', event.target.value)}
        />
        <TextField
          label={t('form.order')}
          type="number"
          inputMode="numeric"
          value={String(draft.order)}
          onChange={(event) => setField('order', Number(event.target.value))}
          {...(errors.order ? { error: errors.order } : {})}
        />
      </div>

      <TextField
        label={t('form.tags')}
        value={formatList(draft.tags)}
        onChange={(event) => setField('tags', parseList(event.target.value))}
      />

      <FormActions pending={pending} onCancel={onCancel} />
    </form>
  );
}
