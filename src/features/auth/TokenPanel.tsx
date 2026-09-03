import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonLink } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { ExternalLinkIcon } from '@/components/ui/icons';
import { siteConfig } from '@/config/site';
import { toAuthErrorCode, type AuthErrorCode } from './errors';

interface TokenPanelProps {
  onToken: (token: string) => Promise<void>;
  onError: (code: AuthErrorCode) => void;
}

const TOKEN_SETTINGS_URL = 'https://github.com/settings/personal-access-tokens/new';

/**
 * Fallback for deployments without a Device Flow relay: the member pastes a
 * fine-grained token. It is verified against the organization exactly like a
 * Device Flow token before any session is created.
 */
export function TokenPanel({ onToken, onError }: TokenPanelProps) {
  const { t } = useTranslation();
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token.trim()) return;

    setBusy(true);
    try {
      await onToken(token.trim());
    } catch (error) {
      onError(toAuthErrorCode(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="stack-sm" onSubmit={(event) => void submit(event)}>
      <TextField
        label={t('auth.tokenLabel')}
        hint={t('auth.tokenHint')}
        type="password"
        autoComplete="off"
        spellCheck={false}
        placeholder={t('auth.tokenPlaceholder')}
        value={token}
        onChange={(event) => setToken(event.target.value)}
      />

      <Button type="submit" variant="primary" size="lg" loading={busy} disabled={!token.trim()}>
        {t('actions.signIn')}
      </Button>

      <ButtonLink
        to={`${TOKEN_SETTINGS_URL}?owner=${siteConfig.organization}`}
        external
        variant="ghost"
        size="sm"
      >
        {t('auth.createToken')}
        <ExternalLinkIcon />
      </ButtonLink>
    </form>
  );
}
