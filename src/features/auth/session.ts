import { siteConfig } from '@/config/site';
import { deleteCookie, readCookie, writeCookie } from '@/lib/cookies';

const COOKIE_NAME = 'dslab:session';

export interface Session {
  token: string;
  login: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
  /** Whether the token may commit to the content repository. */
  canWrite: boolean;
  issuedAt: number;
}

const isSession = (value: unknown): value is Session => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Session>;
  return typeof candidate.token === 'string' && typeof candidate.login === 'string';
};

export function readSession(): Session | null {
  const raw = readCookie(COOKIE_NAME);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function persistSession(session: Session): void {
  writeCookie(COOKIE_NAME, JSON.stringify(session), { days: siteConfig.auth.sessionDays });
}

export function clearSession(): void {
  deleteCookie(COOKIE_NAME);
}
