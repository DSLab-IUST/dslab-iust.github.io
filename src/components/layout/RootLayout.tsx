import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Atmosphere } from './Atmosphere';
import { Footer } from './Footer';
import { Header } from './Header';
import { SectionNavProvider } from './SectionNav';

export function RootLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const firstRender = useRef(true);

  // A route change must move focus, or a keyboard visitor is left on the old
  // page. The initial load is skipped so the skip link stays the first stop.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <SectionNavProvider>
      <a className="skip-link" href="#main">
        {t('nav.skipToContent')}
      </a>

      <Atmosphere />
      <Header />

      <main id="main" tabIndex={-1} className="relative z-[var(--z-base)] outline-none">
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration
        getKey={(location) =>
          location.pathname === '/'
            ? `${location.pathname}${location.hash}`
            : location.pathname
        }
      />
    </SectionNavProvider>
  );
}
