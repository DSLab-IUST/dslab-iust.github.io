import { cn } from '@/lib/cn';
import { ExternalLinkIcon } from './icons';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  action?: { label: string; href: string };
}

interface ToastViewportProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-viewport">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn('toast', `toast-${toast.variant}`)}
          role={toast.variant === 'error' ? 'alert' : 'status'}
          onClick={() => onDismiss(toast.id)}
        >
          <p className="min-w-0 flex-1">{toast.message}</p>

          {toast.action ? (
            <a
              className="text-accent shrink-0 inline-flex items-center gap-1 text-caption font-semibold"
              href={toast.action.href}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(event) => event.stopPropagation()}
            >
              {toast.action.label}
              <ExternalLinkIcon />
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}
