import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

interface FormActionsProps {
  pending: boolean;
  onCancel: () => void;
}

export function FormActions({ pending, onCancel }: FormActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="border-border mt-2 flex justify-end gap-3 border-t pt-6">
      <Button variant="ghost" onClick={onCancel} disabled={pending}>
        {t('actions.cancel')}
      </Button>
      <Button type="submit" variant="primary" loading={pending}>
        {pending ? t('admin.saving') : t('actions.save')}
      </Button>
    </div>
  );
}
