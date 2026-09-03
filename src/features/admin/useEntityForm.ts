import { useCallback, useState, type FormEvent } from 'react';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

interface EntityForm<T> {
  draft: T;
  errors: FieldErrors<T>;
  setField: <K extends keyof T>(key: K, value: T[K]) => void;
  handleSubmit: (onValid: (draft: T) => Promise<void> | void) => (event: FormEvent) => void;
}

/**
 * Minimal controlled-form state: a draft, per-field errors, and validation that
 * only runs on submit so typing is never interrupted by a message.
 */
export function useEntityForm<T extends object>(
  initial: T,
  validate: (draft: T) => FieldErrors<T>,
): EntityForm<T> {
  const [draft, setDraft] = useState<T>(initial);
  const [errors, setErrors] = useState<FieldErrors<T>>({});

  const setField = useCallback<EntityForm<T>['setField']>((key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  }, []);

  const handleSubmit = useCallback<EntityForm<T>['handleSubmit']>(
    (onValid) => (event) => {
      event.preventDefault();

      const found = validate(draft);
      setErrors(found);

      if (Object.values(found).every((message) => !message)) void onValid(draft);
    },
    [draft, validate],
  );

  return { draft, errors, setField, handleSubmit };
}

/** Accepts both the Latin and the Persian comma as separators. */
export const parseList = (value: string): string[] =>
  value
    .split(/[,،]/)
    .map((entry) => entry.trim())
    .filter(Boolean);

export const formatList = (values: string[]): string => values.join('، ');

export const isBlank = (value: string): boolean => value.trim().length === 0;

export const isValidUrl = (value: string): boolean => {
  if (isBlank(value)) return true;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

export const isValidEmail = (value: string): boolean =>
  isBlank(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
