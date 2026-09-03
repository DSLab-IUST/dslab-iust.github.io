import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeVariant =
  'neutral' | 'accent' | 'gold' | 'success' | 'warning' | 'error' | 'info' | 'live';

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  neutral: '',
  accent: 'badge-accent',
  gold: 'badge-gold',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'badge-info',
  live: 'badge-accent badge-live',
};

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
}

export function Badge({ variant = 'neutral', size = 'md', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        VARIANT_CLASS[variant],
        size === 'sm' && 'badge-sm',
        size === 'lg' && 'badge-lg',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DegreeBadge({
  degree,
  label,
}: {
  degree: 'faculty' | 'phd' | 'msc' | 'bsc';
  label: string;
}) {
  return <span className={cn('badge badge-sm badge-degree', `badge-${degree}`)}>{label}</span>;
}
