import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonLink } from '@/components/ui/Button';
import { CheckIcon, CopyIcon, ExternalLinkIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site';
import {
  pollForAccessToken,
  requestDeviceCode,
  type DeviceCodeGrant,
} from '@/lib/github/deviceFlow';
import { toAuthErrorCode, type AuthErrorCode } from './errors';
import { formatCountdown, useCountdown } from './useCountdown';

interface DeviceFlowPanelProps {
  onToken: (token: string) => Promise<void>;
  onError: (code: AuthErrorCode) => void;
}

/**
 * Device Flow needs no client secret and no redirect URI, which is what makes
 * it viable on a host that can keep no secrets.
 */
export function DeviceFlowPanel({ onToken, onError }: DeviceFlowPanelProps) {
  const { t } = useTranslation();
  const [grant, setGrant] = useState<DeviceCodeGrant | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const remaining = useCountdown(grant?.expiresAt ?? null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const start = async () => {
    setBusy(true);
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const issued = await requestDeviceCode();
      setGrant(issued);

      const token = await pollForAccessToken(issued, controller.signal);
      await onToken(token);
    } catch (error) {
      if (!controller.signal.aborted) {
        setGrant(null);
        onError(toAuthErrorCode(error));
      }
    } finally {
      setBusy(false);
    }
  };

  const copyCode = async () => {
    if (!grant) return;
    await navigator.clipboard.writeText(grant.userCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (!siteConfig.auth.deviceFlowRelay) {
    return (
      <p className="text-text-muted text-body-sm bg-[var(--color-info-muted)] text-info-fg rounded-md p-4">
        {t('auth.relayMissing')}
      </p>
    );
  }

  if (!grant) {
    return (
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        loading={busy}
        onClick={() => void start()}
      >
        {t('auth.startDeviceFlow')}
      </Button>
    );
  }

  return (
    <div className="stack-sm">
      <p className="text-text-secondary text-body-sm">{t('auth.deviceStep1')}</p>

      <div className="border-border-accent bg-accent-50 flex items-center justify-between gap-4 rounded-md border p-4 dark:bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)]">
        <code className="text-h3 text-accent-500 font-mono tracking-[0.2em] tabular-nums">
          {grant.userCode}
        </code>
        <Button variant="ghost" size="sm" onClick={() => void copyCode()}>
          {copied ? <CheckIcon /> : <CopyIcon />}
          {t(copied ? 'actions.copied' : 'actions.copy')}
        </Button>
      </div>

      <p className="text-text-secondary text-body-sm">{t('auth.deviceStep2')}</p>

      <ButtonLink to={grant.verificationUri} external variant="primary" className="w-full">
        {t('auth.openVerification')}
        <ExternalLinkIcon />
      </ButtonLink>

      <div className="text-text-muted text-caption flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2">
          <span className="pulse-dot" aria-hidden="true" />
          {t('auth.waiting')}
        </span>
        <span className="metric">{t('auth.expiresIn', { time: formatCountdown(remaining) })}</span>
      </div>
    </div>
  );
}
