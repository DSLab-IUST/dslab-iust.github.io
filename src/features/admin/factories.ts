import { createId } from '@/lib/id';
import type { LabEvent, Member, Project, ResearchArea, Timestamped } from '@/types/content';

const EMPTY_LOCALIZED = { fa: '', en: '' };

const stamp = (login: string): Timestamped => {
  const now = new Date().toISOString();
  return { createdAt: now, updatedAt: now, updatedBy: login };
};

/** Two hours from now, rounded to the next whole hour. */
function defaultStart(): string {
  const date = new Date(Date.now() + 2 * 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  return date.toISOString();
}

export const createEmptyEvent = (login: string): LabEvent => ({
  id: createId('evt'),
  title: { ...EMPTY_LOCALIZED },
  description: { ...EMPTY_LOCALIZED },
  kind: 'seminar',
  startsAt: defaultStart(),
  endsAt: '',
  location: { ...EMPTY_LOCALIZED },
  capacity: 0,
  speaker: { ...EMPTY_LOCALIZED },
  registrationUrl: '',
  tags: [],
  featured: false,
  ...stamp(login),
});

export const createEmptyMember = (login: string): Member => ({
  id: createId('mbr'),
  name: { ...EMPTY_LOCALIZED },
  role: { ...EMPTY_LOCALIZED },
  bio: { ...EMPTY_LOCALIZED },
  degree: 'msc',
  lead: false,
  avatarUrl: '',
  email: '',
  githubUsername: '',
  scholarUrl: '',
  interests: [],
  ...stamp(login),
});

export const createEmptyProject = (login: string): Project => ({
  id: createId('prj'),
  title: { ...EMPTY_LOCALIZED },
  summary: { ...EMPTY_LOCALIZED },
  status: 'active',
  repositoryUrl: '',
  demoUrl: '',
  memberIds: [],
  tags: [],
  startedAt: new Date().toISOString().slice(0, 10),
  ...stamp(login),
});

export const createEmptyResearch = (login: string, order: number): ResearchArea => ({
  id: createId('res'),
  title: { ...EMPTY_LOCALIZED },
  summary: { ...EMPTY_LOCALIZED },
  glyph: '🔬',
  tags: [],
  order,
  ...stamp(login),
});

/** Records who last touched the entry without disturbing its creation time. */
export const touch = <T extends Timestamped>(entity: T, login: string): T => ({
  ...entity,
  updatedAt: new Date().toISOString(),
  updatedBy: login,
});
