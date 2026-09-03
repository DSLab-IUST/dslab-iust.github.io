import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import { siteConfig } from '@/config/site';
import { useAuth } from '@/providers/AuthProvider';

/**
 * Route guard for the admin area. Membership was already verified when the
 * session was created; this only keeps non-members from reaching the screen.
 */
export function RequireMembership() {
  const { t } = useTranslation();
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'restoring') {
    return (
      <div className="container flex items-center justify-center gap-3 py-32">
        <Spinner className="text-accent size-6" />
        <span className="text-text-muted text-body-sm">{t('state.loading')}</span>
      </div>
    );
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function MembershipNotice() {
  const { t } = useTranslation();

  return (
    <div className="container-narrow py-24 text-center">
      <h1 className="text-h2">{t('admin.guardTitle')}</h1>
      <p className="lede mx-auto mt-4">{t('admin.guardBody', { org: siteConfig.organization })}</p>
    </div>
  );
}
