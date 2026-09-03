import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckboxField, SelectField, TextField } from '@/components/ui/Field';
import type { Member, MemberDegree } from '@/types/content';
import { FormActions } from './FormActions';
import { LocalizedField } from './LocalizedField';
import {
  formatList,
  isBlank,
  isValidEmail,
  isValidUrl,
  parseList,
  useEntityForm,
  type FieldErrors,
} from './useEntityForm';

const DEGREES: MemberDegree[] = ['faculty', 'phd', 'msc', 'bsc'];

interface MemberFormProps {
  initial: Member;
  pending: boolean;
  onSubmit: (member: Member) => void;
  onCancel: () => void;
}

export function MemberForm({ initial, pending, onSubmit, onCancel }: MemberFormProps) {
  const { t } = useTranslation();

  const validate = useCallback(
    (draft: Member): FieldErrors<Member> => {
      const errors: FieldErrors<Member> = {};

      if (isBlank(draft.name.fa)) errors.name = t('form.errors.required');
      if (isBlank(draft.role.fa)) errors.role = t('form.errors.required');
      if (!isValidEmail(draft.email)) errors.email = t('form.errors.email');
      if (!isValidUrl(draft.avatarUrl)) errors.avatarUrl = t('form.errors.url');
      if (!isValidUrl(draft.scholarUrl)) errors.scholarUrl = t('form.errors.url');

      return errors;
    },
    [t],
  );

  const { draft, errors, setField, handleSubmit } = useEntityForm(initial, validate);

  return (
    <form className="stack-sm" onSubmit={handleSubmit(onSubmit)} noValidate>
      <LocalizedField
        value={draft.name}
        onChange={(value) => setField('name', value)}
        labels={{ fa: t('form.nameFa'), en: t('form.nameEn') }}
        {...(errors.name ? { error: errors.name } : {})}
      />

      <LocalizedField
        value={draft.role}
        onChange={(value) => setField('role', value)}
        labels={{ fa: t('form.roleFa'), en: t('form.roleEn') }}
        {...(errors.role ? { error: errors.role } : {})}
      />

      <LocalizedField
        multiline
        value={draft.bio}
        onChange={(value) => setField('bio', value)}
        labels={{ fa: t('form.bioFa'), en: t('form.bioEn') }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label={t('form.degree')}
          value={draft.degree}
          onChange={(event) => setField('degree', event.target.value as MemberDegree)}
          options={DEGREES.map((degree) => ({
            value: degree,
            label: t(`members.degree.${degree}`),
          }))}
        />
        <TextField
          label={`${t('form.email')} (${t('form.optional')})`}
          type="email"
          dir="ltr"
          placeholder="name@iust.ac.ir"
          value={draft.email}
          onChange={(event) => setField('email', event.target.value)}
          {...(errors.email ? { error: errors.email } : {})}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label={`${t('form.githubUsername')} (${t('form.optional')})`}
          dir="ltr"
          value={draft.githubUsername}
          onChange={(event) => setField('githubUsername', event.target.value)}
        />
        <TextField
          label={`${t('form.avatarUrl')} (${t('form.optional')})`}
          type="url"
          dir="ltr"
          placeholder="https://"
          value={draft.avatarUrl}
          onChange={(event) => setField('avatarUrl', event.target.value)}
          {...(errors.avatarUrl ? { error: errors.avatarUrl } : {})}
        />
      </div>

      <TextField
        label={`${t('form.scholarUrl')} (${t('form.optional')})`}
        type="url"
        dir="ltr"
        placeholder="https://scholar.google.com/…"
        value={draft.scholarUrl}
        onChange={(event) => setField('scholarUrl', event.target.value)}
        {...(errors.scholarUrl ? { error: errors.scholarUrl } : {})}
      />

      <TextField
        label={t('form.interests')}
        value={formatList(draft.interests)}
        onChange={(event) => setField('interests', parseList(event.target.value))}
      />

      <CheckboxField
        label={t('form.lead')}
        checked={draft.lead}
        onChange={(event) => setField('lead', event.target.checked)}
      />

      <FormActions pending={pending} onCancel={onCancel} />
    </form>
  );
}
