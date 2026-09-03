import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { Button, ButtonLink } from '@/components/ui/Button';
import { LogOutIcon, MenuIcon, ShieldIcon } from '@/components/ui/icons';
import { useAuth } from '@/providers/AuthProvider';
import { LocaleToggle } from './LocaleToggle';
import { MobileNav } from './MobileNav';
import { NAV_ITEMS } from './navigation';
import { SectionLink } from './SectionNav';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { t } = useTranslation();
  const { status, session, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <SectionLink hash="home" markCurrent={false} className="flex shrink-0 items-center gap-2.5">
          <span className="brand-mark" aria-hidden="true">
            DS
          </span>
          <span className="flex flex-col">
            <strong className="text-h6 leading-tight tracking-wide">{t('brand.short')}</strong>
            <small className="text-text-muted mt-1 text-[10px] leading-none max-sm:hidden">
              {t('brand.university')}
            </small>
          </span>
        </SectionLink>

        <nav aria-label={t('nav.home')} className="flex gap-[26px] max-lg:hidden">
          {NAV_ITEMS.map((item) => (
            <SectionLink key={item.hash} hash={item.hash} className="nav-link">
              {t(item.labelKey)}
            </SectionLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />

          {status === 'authenticated' && session ? (
            <div className="flex items-center gap-2">
              <ButtonLink
                to="/admin"
                variant="secondary"
                className="max-sm:hidden"
                aria-label={t('nav.admin')}
              >
                <ShieldIcon />
                <span className="max-lg:sr-only">{t('nav.admin')}</span>
              </ButtonLink>

              <Avatar name={session.name} src={session.avatarUrl} size="sm" ring />

              <Button
                variant="ghost"
                iconOnly
                onClick={signOut}
                aria-label={t('actions.signOut')}
                className="max-sm:hidden"
              >
                <LogOutIcon />
              </Button>
            </div>
          ) : (
            <ButtonLink to="/login" variant="primary" className="max-sm:hidden">
              {t('actions.signIn')}
            </ButtonLink>
          )}

          <Button
            variant="ghost"
            iconOnly
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label={t('nav.openMenu')}
            aria-expanded={menuOpen}
          >
            <MenuIcon />
          </Button>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
