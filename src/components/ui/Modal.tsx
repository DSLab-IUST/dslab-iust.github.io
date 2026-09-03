import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { CloseIcon } from './icons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Widen beyond the 620px default for dense editing forms. */
  wide?: boolean;
}

const EXIT_DURATION = 180;

/**
 * Wraps the native `<dialog>`, which supplies focus trapping, inertness and the
 * top-layer stacking for free. Closing is deferred so the exit animation runs.
 */
export function Modal({ open, onClose, title, children, wide = false }: ModalProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.dataset.closing = '';
    window.setTimeout(() => {
      delete dialog.dataset.closing;
      onClose();
    }, EXIT_DURATION);
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const onCancel = (event: Event) => {
      event.preventDefault();
      requestClose();
    };

    dialog.addEventListener('cancel', onCancel);
    return () => dialog.removeEventListener('cancel', onCancel);
  }, [requestClose]);

  return (
    <dialog
      ref={dialogRef}
      className={cn('modal', wide && 'w-[min(860px,calc(100%-28px))]')}
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="modal-close"
        onClick={requestClose}
        aria-label={t('actions.close')}
      >
        <CloseIcon />
      </button>

      <div className="modal-body">
        <h2 id={titleId} className="text-h3 pe-12">
          {title}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </dialog>
  );
}
