import { cn } from '@/lib/cn';

export interface TabOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

/** Segmented filter used for event phases, project status and member degrees. */
export function Tabs<T extends string>({ options, value, onChange, label }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="border-border bg-surface-glass inline-flex gap-1 rounded-pill border p-1 backdrop-blur-[18px]"
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex h-8 cursor-pointer items-center gap-2 rounded-pill px-4 text-caption font-semibold transition-colors duration-(--duration-base) ease-hover',
              selected
                ? 'bg-accent text-text-on-accent'
                : 'text-text-muted hover:text-text hover:bg-[color-mix(in_srgb,var(--color-text)_6%,transparent)]',
            )}
          >
            {option.label}
            {option.count === undefined ? null : (
              <span className="metric text-micro opacity-80">{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
