import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonLink } from '@/components/ui/Button';
import { CloseIcon, LogOutIcon, ShieldIcon } from '@/components/ui/icons';
import { useAuth } from '@/providers/AuthProvider';
import { NAV_ITEMS } from './navigation';
import { SectionLink } from './SectionNav';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/** Full-screen overlay menu below the `lg` breakpoint (DESIGN.md §5.1). */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const { t } = useTranslation();
  const { status, session, signOut } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="bg-surface-overlay text-text m-0 h-dvh max-h-none w-screen max-w-none border-0 p-0 backdrop:bg-[var(--color-overlay)] backdrop:backdrop-blur-[6px]"
      aria-label={t('nav.openMenu')}
    >
      <div className="container flex h-full flex-col gap-8 py-6">
        <div className="flex items-center justify-between">
          <span className="brand-mark" aria-hidden="true">
            DS
          </span>
          <Button variant="ghost" iconOnly onClick={onClose} aria-label={t('nav.closeMenu')}>
            <CloseIcon />
          </Button>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <SectionLink
              key={item.hash}
              hash={item.hash}
              onClick={onClose}
              className="text-h3 text-text-secondary aria-[current=page]:text-accent py-2 font-semibold"
            >
              {t(item.labelKey)}
            </SectionLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          {status === 'authenticated' && session ? (
            <>
              <ButtonLink to="/admin" variant="primary" size="lg" onClick={onClose}>
                <ShieldIcon />
                {t('nav.admin')}
              </ButtonLink>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  signOut();
                  onClose();
                }}
              >
                <LogOutIcon />
                {t('actions.signOut')}
              </Button>
            </>
          ) : (
            <ButtonLink to="/login" variant="primary" size="lg" onClick={onClose}>
              {t('actions.signIn')}
            </ButtonLink>
          )}
        </div>
      </div>
    </dialog>
  );
}
