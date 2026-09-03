import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MoonIcon, SunIcon } from '@/components/ui/icons';
import { useTheme } from '@/providers/ThemeProvider';

/**
 * The circular wipe of the theme transition starts from the button itself, so
 * the new palette reads as spreading out from the control the visitor pressed.
 */
export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect();
    toggleTheme(
      rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined,
    );
  };

  return (
    <button
      ref={ref}
      type="button"
      className="theme-toggle"
      onClick={handleClick}
      aria-label={t('theme.label')}
      aria-pressed={theme === 'dark'}
    >
      <span className="theme-toggle-icons" aria-hidden="true">
        <SunIcon className="theme-icon icon-sun" />
        <MoonIcon className="theme-icon icon-moon" />
      </span>
      <span className="max-sm:sr-only">{t(theme === 'dark' ? 'theme.dark' : 'theme.light')}</span>
    </button>
  );
}
