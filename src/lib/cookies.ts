/**
 * Cookie helpers for the session record.
 *
 * A static site has no server, so `HttpOnly` is impossible; `SameSite=Strict`
 * plus `Secure` is the strongest posture available and blocks the session from
 * ever being attached to a cross-site request.
 */

interface CookieOptions {
  days: number;
}

const encode = encodeURIComponent;

export function readCookie(name: string): string | null {
  const target = `${encode(name)}=`;
  const match = document.cookie.split('; ').find((entry) => entry.startsWith(target));

  return match ? decodeURIComponent(match.slice(target.length)) : null;
}

export function writeCookie(name: string, value: string, { days }: CookieOptions): void {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  const secure = location.protocol === 'https:' ? '; Secure' : '';

  document.cookie = `${encode(name)}=${encode(value)}; Expires=${expires}; Path=/; SameSite=Strict${secure}`;
}

export function deleteCookie(name: string): void {
  document.cookie = `${encode(name)}=; Max-Age=0; Path=/; SameSite=Strict`;
}
