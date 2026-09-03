import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/cn';

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: (props: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}

/** Label lives above the control; a placeholder is only ever an example. */
function FieldShell({ label, hint, error, className, children }: FieldShellProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn('field', className)} data-invalid={error ? '' : undefined}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {hint && !error ? (
        <p className="field-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type ControlProps = Omit<FieldShellProps, 'children'>;

export function TextField({
  label,
  hint,
  error,
  className,
  ...props
}: ControlProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell
      label={label}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
      {...(className ? { className } : {})}
    >
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          className="input"
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  className,
  ...props
}: ControlProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell
      label={label}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
      {...(className ? { className } : {})}
    >
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          className="textarea"
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          {...props}
        />
      )}
    </FieldShell>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

export function SelectField({
  label,
  hint,
  error,
  className,
  options,
  ...props
}: ControlProps & SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[] }) {
  return (
    <FieldShell
      label={label}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
      {...(className ? { className } : {})}
    >
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          className="select"
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function CheckboxField({ label, className, ...props }: CheckboxFieldProps) {
  const id = useId();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <input
        id={id}
        type="checkbox"
        className="size-[18px] shrink-0 cursor-pointer accent-[var(--color-accent)]"
        {...props}
      />
      <label className="field-label cursor-pointer" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
