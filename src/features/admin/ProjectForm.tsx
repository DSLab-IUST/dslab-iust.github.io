import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectField, TextField } from '@/components/ui/Field';
import { useLocalized } from '@/hooks/useLocalized';
import type { Member, Project, ProjectStatus } from '@/types/content';
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

const STATUSES: ProjectStatus[] = ['active', 'completed', 'archived'];

interface ProjectFormProps {
  initial: Project;
  members: Member[];
  pending: boolean;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}

export function ProjectForm({ initial, members, pending, onSubmit, onCancel }: ProjectFormProps) {
  const { t } = useTranslation();
  const localized = useLocalized();

  const validate = useCallback(
    (draft: Project): FieldErrors<Project> => {
      const errors: FieldErrors<Project> = {};

      if (isBlank(draft.title.fa)) errors.title = t('form.errors.required');
      if (isBlank(draft.summary.fa)) errors.summary = t('form.errors.required');
      if (!isValidUrl(draft.repositoryUrl)) errors.repositoryUrl = t('form.errors.url');
      if (!isValidUrl(draft.demoUrl)) errors.demoUrl = t('form.errors.url');

      return errors;
    },
    [t],
  );

  const { draft, errors, setField, handleSubmit } = useEntityForm(initial, validate);

  const toggleMember = (id: string) =>
    setField(
      'memberIds',
      draft.memberIds.includes(id)
        ? draft.memberIds.filter((memberId) => memberId !== id)
        : [...draft.memberIds, id],
    );

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
        <SelectField
          label={t('form.status')}
          value={draft.status}
          onChange={(event) => setField('status', event.target.value as ProjectStatus)}
          options={STATUSES.map((status) => ({
            value: status,
            label: t(`projects.status.${status}`),
          }))}
        />
        <TextField
          label={t('form.startedAt')}
          type="date"
          value={draft.startedAt.slice(0, 10)}
          onChange={(event) => setField('startedAt', event.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label={`${t('form.repositoryUrl')} (${t('form.optional')})`}
          type="url"
          dir="ltr"
          placeholder="https://github.com/…"
          value={draft.repositoryUrl}
          onChange={(event) => setField('repositoryUrl', event.target.value)}
          {...(errors.repositoryUrl ? { error: errors.repositoryUrl } : {})}
        />
        <TextField
          label={`${t('form.demoUrl')} (${t('form.optional')})`}
          type="url"
          dir="ltr"
          placeholder="https://"
          value={draft.demoUrl}
          onChange={(event) => setField('demoUrl', event.target.value)}
          {...(errors.demoUrl ? { error: errors.demoUrl } : {})}
        />
      </div>

      <TextField
        label={t('form.tags')}
        value={formatList(draft.tags)}
        onChange={(event) => setField('tags', parseList(event.target.value))}
      />

      <fieldset className="field">
        <legend className="field-label mb-2">{t('form.memberIds')}</legend>
        <div className="cluster-xs">
          {members.map((member) => {
            const selected = draft.memberIds.includes(member.id);

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => toggleMember(member.id)}
                aria-pressed={selected}
                className={`badge badge-lg cursor-pointer ${selected ? 'badge-accent' : ''}`}
              >
                {localized(member.name)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <FormActions pending={pending} onCancel={onCancel} />
    </form>
  );
}
