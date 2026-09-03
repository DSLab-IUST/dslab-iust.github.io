import { LOCALE_TAG, type Locale } from '@/i18n/config';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const dateFormatter = (locale: Locale, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(LOCALE_TAG[locale], options);

export const formatDate = (iso: string, locale: Locale): string =>
  dateFormatter(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));

export const formatShortDate = (iso: string, locale: Locale): string =>
  dateFormatter(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));

export const formatTime = (iso: string, locale: Locale): string =>
  dateFormatter(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export const formatDateTime = (iso: string, locale: Locale): string =>
  `${formatDate(iso, locale)} — ${formatTime(iso, locale)}`;

export function formatDateRange(startIso: string, endIso: string, locale: Locale): string {
  if (!endIso) return formatDateTime(startIso, locale);

  const sameDay = new Date(startIso).toDateString() === new Date(endIso).toDateString();
  return sameDay
    ? `${formatDate(startIso, locale)} — ${formatTime(startIso, locale)} … ${formatTime(endIso, locale)}`
    : `${formatDateTime(startIso, locale)} … ${formatDateTime(endIso, locale)}`;
}

export function formatRelative(iso: string, locale: Locale): string {
  const formatter = new Intl.RelativeTimeFormat(LOCALE_TAG[locale], { numeric: 'auto' });
  const delta = new Date(iso).getTime() - Date.now();
  const absolute = Math.abs(delta);

  if (absolute < HOUR) return formatter.format(Math.round(delta / MINUTE), 'minute');
  if (absolute < DAY) return formatter.format(Math.round(delta / HOUR), 'hour');
  if (absolute < 30 * DAY) return formatter.format(Math.round(delta / DAY), 'day');
  return formatter.format(Math.round(delta / (30 * DAY)), 'month');
}

export const formatNumber = (value: number, locale: Locale): string =>
  new Intl.NumberFormat(LOCALE_TAG[locale]).format(value);

/** `<input type="datetime-local">` expects a naive local timestamp. */
export function toDateTimeLocalValue(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * MINUTE;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export const fromDateTimeLocalValue = (value: string): string =>
  value ? new Date(value).toISOString() : '';

export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => [...part][0] ?? '')
    .join('');
}
