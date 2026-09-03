import { createContext, use, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { ToastViewport, type Toast, type ToastVariant } from '@/components/ui/Toast';

interface ToastInput {
  message: string;
  variant?: ToastVariant;
  /** Optional link rendered beside the message, e.g. the resulting commit. */
  action?: { label: string; href: string };
  durationMs?: number;
}

interface ToastContextValue {
  notify: (input: ToastInput) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 4000;
const MAX_VISIBLE = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    ({ message, variant = 'info', action, durationMs = DEFAULT_DURATION }: ToastInput) => {
      const id = nextId.current++;

      setToasts((current) => [...current, { id, message, variant, action }].slice(-MAX_VISIBLE));
      window.setTimeout(() => dismiss(id), durationMs);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext>
  );
}

export function useToast(): ToastContextValue {
  const context = use(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>.');
  return context;
}
