import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps {
  children: ReactNode;
  /** Adds the lift-and-orbit hover treatment reserved for clickable cards. */
  interactive?: boolean;
  className?: string;
}

export function Card({ children, interactive = false, className }: CardProps) {
  return (
    <article className={cn('card', interactive && 'card-interactive', className)}>
      {interactive ? <span className="card-orbit" aria-hidden="true" /> : null}
      {children}
    </article>
  );
}

/** Gold-framed variant — the only surface allowed to carry the leadership gold. */
export function LeadCard({ children, interactive = true, className }: CardProps) {
  return (
    <article className={cn('card card-lead', interactive && 'card-interactive', className)}>
      <div className="card-inner">{children}</div>
    </article>
  );
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('card-footer', className)}>{children}</div>;
}
