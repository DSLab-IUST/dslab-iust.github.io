import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckboxField, SelectField, TextField } from '@/components/ui/Field';
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '@/lib/format';
import type { EventKind, LabEvent } from '@/types/content';
import { FormActions } from './FormActions';
import { LocalizedField } from './LocalizedField';
import {
  formatList,
  isBlank,
  isValidUrl,
  parseList,
  useEntityForm,
  type FieldErrors,
} from './useEntityForm';

const KINDS: EventKind[] = ['seminar', 'workshop', 'defense', 'meetup', 'course'];

interface EventFormProps {
  initial: LabEvent;
  pending: boolean;
  onSubmit: (event: LabEvent) => void;
  onCancel: () => void;
}

export function EventForm({ initial, pending, onSubmit, onCancel }: EventFormProps) {
  const { t } = useTranslation();

  const validate = useCallback(
    (draft: LabEvent): FieldErrors<LabEvent> => {
      const errors: FieldErrors<LabEvent> = {};

      if (isBlank(draft.title.fa)) errors.title = t('form.errors.required');
      if (isBlank(draft.description.fa)) errors.description = t('form.errors.required');
      if (isBlank(draft.startsAt)) errors.startsAt = t('form.errors.required');
      if (draft.endsAt && draft.endsAt <= draft.startsAt) {
        errors.endsAt = t('form.errors.dateOrder');
      }
      if (!isValidUrl(draft.registrationUrl)) errors.registrationUrl = t('form.errors.url');
      if (!Number.isFinite(draft.capacity) || draft.capacity < 0) {
        errors.capacity = t('form.errors.number');
      }

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
        value={draft.description}
        onChange={(value) => setField('description', value)}
        labels={{ fa: t('form.descriptionFa'), en: t('form.descriptionEn') }}
        {...(errors.description ? { error: errors.description } : {})}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SelectField
          label={t('form.kind')}
          value={draft.kind}
          onChange={(event) => setField('kind', event.target.value as EventKind)}
          options={KINDS.map((kind) => ({ value: kind, label: t(`events.kind.${kind}`) }))}
        />
        <TextField
          label={t('form.startsAt')}
          type="datetime-local"
          value={toDateTimeLocalValue(draft.startsAt)}
          onChange={(event) => setField('startsAt', fromDateTimeLocalValue(event.target.value))}
          {...(errors.startsAt ? { error: errors.startsAt } : {})}
        />
        <TextField
          label={`${t('form.endsAt')} (${t('form.optional')})`}
          type="datetime-local"
          value={toDateTimeLocalValue(draft.endsAt)}
          onChange={(event) => setField('endsAt', fromDateTimeLocalValue(event.target.value))}
          {...(errors.endsAt ? { error: errors.endsAt } : {})}
        />
      </div>

      <LocalizedField
        value={draft.location}
        onChange={(value) => setField('location', value)}
        labels={{ fa: t('form.locationFa'), en: t('form.locationEn') }}
      />

      <LocalizedField
        value={draft.speaker}
        onChange={(value) => setField('speaker', value)}
        labels={{ fa: t('form.speakerFa'), en: t('form.speakerEn') }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label={t('form.capacity')}
          type="number"
          min={0}
          inputMode="numeric"
          value={String(draft.capacity)}
          onChange={(event) => setField('capacity', Number(event.target.value))}
          {...(errors.capacity ? { error: errors.capacity } : {})}
        />
        <TextField
          label={`${t('form.registrationUrl')} (${t('form.optional')})`}
          type="url"
          dir="ltr"
          placeholder="https://"
          value={draft.registrationUrl}
          onChange={(event) => setField('registrationUrl', event.target.value)}
          {...(errors.registrationUrl ? { error: errors.registrationUrl } : {})}
        />
      </div>

      <TextField
        label={t('form.tags')}
        value={formatList(draft.tags)}
        onChange={(event) => setField('tags', parseList(event.target.value))}
      />

      <CheckboxField
        label={t('form.featured')}
        checked={draft.featured}
        onChange={(event) => setField('featured', event.target.checked)}
      />

      <FormActions pending={pending} onCancel={onCancel} />
    </form>
  );
}
