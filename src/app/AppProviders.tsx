import type { ReactNode } from 'react';
import { AuthProvider } from '@/providers/AuthProvider';
import { ContentProvider } from '@/providers/ContentProvider';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ToastProvider } from '@/providers/ToastProvider';

/** Content depends on auth for write access, so auth is mounted above it. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <ToastProvider>
          <AuthProvider>
            <ContentProvider>{children}</ContentProvider>
          </AuthProvider>
        </ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
