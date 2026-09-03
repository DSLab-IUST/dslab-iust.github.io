import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/AppProviders';
import { ErrorBoundary } from '@/app/ErrorBoundary';
import { router } from '@/app/router';
import '@/i18n';
import '@/styles/index.css';

/**
 * GitHub Pages serves `404.html` for unknown paths, which stashes the original
 * URL. Restore it before the router reads `location` so a deep link, a refresh
 * and a shared link all resolve to the same view.
 */
function restoreDeepLink(): void {
  const target = sessionStorage.getItem('dslab:redirect');
  if (!target) return;

  sessionStorage.removeItem('dslab:redirect');
  if (target !== location.pathname + location.search + location.hash) {
    history.replaceState(null, '', target);
  }
}

restoreDeepLink();

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element.');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  </StrictMode>,
);
