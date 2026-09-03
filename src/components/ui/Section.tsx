import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from './Reveal';

interface SectionProps {
  id?: string;
  children: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export function Section({ id, children, size = 'md', className }: SectionProps) {
  return (
    <section id={id} className={cn(size === 'sm' ? 'section-sm' : 'section', className)}>
      <div className="container">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  kicker: string;
  title: string;
  lede?: string;
  action?: ReactNode;
}

export function SectionHeading({ kicker, title, lede, action }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end lg:gap-10">
      <div className="max-w-[46ch]">
        <p className="kicker">{kicker}</p>
        <h2 className="text-h2 heading-2 mt-3">{title}</h2>
        {lede ? <p className="lede text-body-sm mt-4">{lede}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  );
}

interface PageHeaderProps {
  kicker: string;
  title: string;
  lede: string;
  action?: ReactNode;
}

export function PageHeader({ kicker, title, lede, action }: PageHeaderProps) {
  return (
    <header className="container pt-14 pb-4 lg:pt-20">
      <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-[52ch]">
          <p className="kicker">{kicker}</p>
          <h1 className="text-h1 heading-1 mt-3">{title}</h1>
          <p className="lede mt-4">{lede}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </Reveal>
    </header>
  );
}
