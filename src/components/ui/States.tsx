import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { InboxIcon } from './icons';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden="true" />;
}

export function CardSkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid-3', className)} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-[280px] rounded-xl" />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
  action?: ReactNode;
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="panel flex flex-col items-center gap-4 px-6 py-16 text-center">
      <span className="text-text-faint">
        <InboxIcon />
      </span>
      <p className="text-body-sm text-text-muted">{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message, action }: EmptyStateProps) {
  return (
    <div className="panel flex flex-col items-center gap-4 px-6 py-16 text-center" role="alert">
      <p className="text-body-sm text-error-fg">{message}</p>
      {action}
    </div>
  );
}
