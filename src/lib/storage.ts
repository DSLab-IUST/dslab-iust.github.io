/**
 * localStorage wrapper that degrades to a no-op when storage is unavailable
 * (private windows, blocked third-party storage, quota exhaustion).
 */

const STORAGE_PREFIX = 'dslab:';

export const storageKeys = {
  theme: `${STORAGE_PREFIX}theme`,
  locale: `${STORAGE_PREFIX}locale`,
} as const;

export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* Preference persistence is a nicety, never a requirement. */
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* See writeStorage. */
  }
}
