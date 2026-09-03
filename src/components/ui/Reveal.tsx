import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface RevealProps {
  children: ReactNode;
  /** Staggers siblings in a grid; capped so a long list never crawls in. */
  index?: number;
  as?: ElementType;
  className?: string;
}

const STAGGER_STEP_MS = 40;
const STAGGER_CAP_MS = 200;

/** Enters once when scrolled into view (DESIGN.md §6.5). */
export function Reveal({ children, index = 0, as: Tag = 'div', className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || visible) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <Tag
      ref={ref}
      className={cn('reveal', className)}
      data-visible={visible ? '' : undefined}
      style={{ transitionDelay: `${Math.min(index * STAGGER_STEP_MS, STAGGER_CAP_MS)}ms` }}
    >
      {children}
    </Tag>
  );
}
