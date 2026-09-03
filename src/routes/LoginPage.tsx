import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';
import { AlertIcon, GitHubIcon, ShieldIcon } from '@/components/ui/icons';
import { Tabs } from '@/components/ui/Tabs';
import { siteConfig } from '@/config/site';
import { DeviceFlowPanel } from '@/features/auth/DeviceFlowPanel';
import { AuthError, type AuthErrorCode } from '@/features/auth/errors';
import { TokenPanel } from '@/features/auth/TokenPanel';
import { useAuth } from '@/providers/AuthProvider';

type Method = 'device' | 'token';

interface RedirectState {
  from?: string;
}

export function LoginPage() {
  const { t } = useTranslation();
  const { status, signIn } = useAuth();
  const location = useLocation();

  const relayEnabled = siteConfig.auth.deviceFlowRelay.length > 0;
  const [method, setMethod] = useState<Method>(relayEnabled ? 'device' : 'token');
  const [errorCode, setErrorCode] = useState<AuthErrorCode | null>(null);

  if (status === 'authenticated') {
    const target = (location.state as RedirectState | null)?.from ?? '/admin';
    return <Navigate to={target} replace />;
  }

  // A successful sign-in flips `status`, and the redirect above takes over.
  // A token that cannot push still signs in; the admin page warns about it.
  const handleToken = async (token: string) => {
    setErrorCode(null);
    await signIn(token);
  };

  const handleError = (code: AuthErrorCode) => setErrorCode(code);

  return (
    <div className="container-narrow py-16 lg:py-24">
      <div className="panel p-8 lg:p-10">
        <span className="brand-mark" aria-hidden="true">
          <GitHubIcon />
        </span>

        <h1 className="text-h2 mt-6">{t('auth.title')}</h1>
        <p className="lede text-body-sm mt-3">{t('auth.lede', { org: siteConfig.organization })}</p>

        {relayEnabled ? (
          <div className="mt-8">
            <Tabs
              label={t('auth.title')}
              value={method}
              onChange={setMethod}
              options={[
                { value: 'device', label: t('auth.deviceTab') },
                { value: 'token', label: t('auth.tokenTab') },
              ]}
            />
          </div>
        ) : null}

        <div className="mt-6">
          {method === 'device' ? (
            <DeviceFlowPanel
              onToken={(token) =>
                handleToken(token).catch((error: unknown) => {
                  handleError(error instanceof AuthError ? error.code : 'unknown');
                })
              }
              onError={handleError}
            />
          ) : (
            <TokenPanel onToken={handleToken} onError={handleError} />
          )}
        </div>

        {errorCode ? (
          <p
            role="alert"
            className="text-error-fg text-body-sm border-[var(--color-error-border)] bg-[var(--color-error-muted)] mt-6 flex items-start gap-3 rounded-md border p-4"
          >
            <AlertIcon className="mt-0.5 shrink-0" />
            {t(`auth.errors.${errorCode}`, { org: siteConfig.organization })}
          </p>
        ) : null}

        <p className="text-text-faint text-caption mt-8 flex items-center gap-2">
          <ShieldIcon />
          {t('auth.sessionNote', { days: String(siteConfig.auth.sessionDays) })}
        </p>
      </div>
    </div>
  );
}
