import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface ConfirmDeleteDialogProps {
  title: string | null;
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteDialog({
  title,
  pending,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  const { t } = useTranslation();

  if (title === null) return null;

  return (
    <Modal open onClose={onCancel} title={t('admin.deleteTitle', { title })}>
      <p className="text-text-muted text-body-sm">{t('admin.deleteBody')}</p>

      <div className="mt-8 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={pending}>
          {t('actions.cancel')}
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={pending}>
          {t('actions.delete')}
        </Button>
      </div>
    </Modal>
  );
}
