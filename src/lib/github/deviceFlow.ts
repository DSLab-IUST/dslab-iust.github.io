import { siteConfig } from '@/config/site';
import { sleep } from '@/lib/async';

/**
 * GitHub's Device Authorization Grant (RFC 8628). It is the only OAuth flow a
 * static site can run honestly, because it never requires a client secret.
 *
 * The endpoints live on `github.com`, which — unlike `api.github.com` — returns
 * no `Access-Control-Allow-Origin` header. A browser therefore cannot call them
 * directly; `siteConfig.auth.deviceFlowRelay` must point at a minimal relay that
 * forwards the two requests verbatim. See README §Auth for a ready-made worker.
 */

const GITHUB_ORIGIN = 'https://github.com';

export interface DeviceCodeGrant {
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  expiresAt: number;
  intervalMs: number;
}

export class DeviceFlowError extends Error {
  readonly reason: 'unconfigured' | 'denied' | 'expired' | 'network';

  constructor(reason: DeviceFlowError['reason'], message: string) {
    super(message);
    this.name = 'DeviceFlowError';
    this.reason = reason;
  }
}

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

interface TokenResponse {
  access_token?: string;
  /** RFC 8628 codes: authorization_pending, slow_down, expired_token, access_denied. */
  error?: string;
  interval?: number;
}

const endpoint = (path: string): string => {
  const relay = siteConfig.auth.deviceFlowRelay.replace(/\/$/, '');
  if (!relay) {
    throw new DeviceFlowError(
      'unconfigured',
      'No Device Flow relay is configured for this deployment.',
    );
  }
  return `${relay}${path}`;
};

async function postForm<T>(path: string, params: Record<string, string>): Promise<T> {
  let response: Response;

  try {
    response = await fetch(endpoint(path), {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  } catch {
    throw new DeviceFlowError('network', 'The Device Flow relay is unreachable.');
  }

  if (!response.ok) {
    throw new DeviceFlowError('network', `The relay answered with ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function requestDeviceCode(): Promise<DeviceCodeGrant> {
  const grant = await postForm<DeviceCodeResponse>('/login/device/code', {
    client_id: siteConfig.auth.clientId,
    scope: siteConfig.auth.scopes.join(' '),
  });

  return {
    deviceCode: grant.device_code,
    userCode: grant.user_code,
    verificationUri: grant.verification_uri || `${GITHUB_ORIGIN}/login/device`,
    expiresAt: Date.now() + grant.expires_in * 1000,
    intervalMs: Math.max(grant.interval, 5) * 1000,
  };
}

/**
 * Polls until the member approves the code in their browser. GitHub answers
 * `slow_down` when polled too eagerly, and the interval must widen permanently
 * from that point on.
 */
export async function pollForAccessToken(
  grant: DeviceCodeGrant,
  signal?: AbortSignal,
): Promise<string> {
  let intervalMs = grant.intervalMs;

  while (Date.now() < grant.expiresAt) {
    await sleep(intervalMs, signal);

    const result = await postForm<TokenResponse>('/login/oauth/access_token', {
      client_id: siteConfig.auth.clientId,
      device_code: grant.deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    });

    if (result.access_token) return result.access_token;

    switch (result.error) {
      case 'authorization_pending':
        break;
      case 'slow_down':
        intervalMs = (result.interval ? result.interval : intervalMs / 1000 + 5) * 1000;
        break;
      case 'access_denied':
        throw new DeviceFlowError('denied', 'The authorization request was declined.');
      case 'expired_token':
        throw new DeviceFlowError('expired', 'The device code expired before approval.');
      default:
        throw new DeviceFlowError('network', result.error ?? 'Unexpected Device Flow response.');
    }
  }

  throw new DeviceFlowError('expired', 'The device code expired before approval.');
}
