import type { fa } from '@/i18n/locales/fa';

type NavKey = keyof typeof fa.nav;

export const SECTION_IDS = ['home', 'events', 'research', 'projects', 'members'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface NavItem {
  hash: SectionId;
  labelKey: `nav.${NavKey}`;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { hash: 'home', labelKey: 'nav.home' },
  { hash: 'events', labelKey: 'nav.events' },
  { hash: 'research', labelKey: 'nav.research' },
  { hash: 'projects', labelKey: 'nav.projects' },
  { hash: 'members', labelKey: 'nav.members' },
] as const;

export const sectionTo = (hash: SectionId): { pathname: '/'; hash: `#${SectionId}` } => ({
  pathname: '/',
  hash: `#${hash}`,
});

const SECTION_ID_SET: ReadonlySet<string> = new Set(SECTION_IDS);

export function sectionFromHash(hash: string): SectionId {
  const id = hash.replace(/^#/, '');
  return SECTION_ID_SET.has(id) ? (id as SectionId) : 'home';
}
