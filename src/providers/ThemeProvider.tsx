import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { readStorage, removeStorage, storageKeys, writeStorage } from '@/lib/storage';
import { runViewTransition } from '@/lib/viewTransition';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  /** `true` while the theme follows the operating system. */
  isSystem: boolean;
  toggleTheme: (origin?: { x: number; y: number }) => void;
  useSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const SYSTEM_QUERY = '(prefers-color-scheme: dark)';

const readSystemTheme = (): Theme => (window.matchMedia(SYSTEM_QUERY).matches ? 'dark' : 'light');

const readDocumentTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readDocumentTheme);
  const [isSystem, setIsSystem] = useState(() => readStorage(storageKeys.theme) === null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!isSystem) return undefined;

    const media = window.matchMedia(SYSTEM_QUERY);
    const onChange = (event: MediaQueryListEvent) => setTheme(event.matches ? 'dark' : 'light');

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [isSystem]);

  const toggleTheme = useCallback<ThemeContextValue['toggleTheme']>((origin) => {
    const next: Theme = readDocumentTheme() === 'dark' ? 'light' : 'dark';

    runViewTransition(
      'theme',
      () => {
        setTheme(next);
        setIsSystem(false);
        writeStorage(storageKeys.theme, next);
      },
      {
        originX: origin ? `${origin.x}px` : '50%',
        originY: origin ? `${origin.y}px` : '50%',
      },
    );
  }, []);

  const useSystemTheme = useCallback(() => {
    removeStorage(storageKeys.theme);
    setIsSystem(true);
    setTheme(readSystemTheme());
  }, []);

  const value = useMemo(
    () => ({ theme, isSystem, toggleTheme, useSystemTheme }),
    [theme, isSystem, toggleTheme, useSystemTheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return context;
}
