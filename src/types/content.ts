/** Every visitor-facing string is authored in both languages. */
export interface Localized {
  fa: string;
  en: string;
}

export interface Timestamped {
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export type EventKind = 'seminar' | 'workshop' | 'defense' | 'meetup' | 'course';

export interface LabEvent extends Timestamped {
  id: string;
  title: Localized;
  description: Localized;
  kind: EventKind;
  /** ISO-8601 instant the session starts. */
  startsAt: string;
  /** ISO-8601 instant the session ends; empty when open-ended. */
  endsAt: string;
  location: Localized;
  /** Zero means unlimited seating. */
  capacity: number;
  speaker: Localized;
  registrationUrl: string;
  tags: string[];
  featured: boolean;
}

export type MemberDegree = 'faculty' | 'phd' | 'msc' | 'bsc';

export interface Member extends Timestamped {
  id: string;
  name: Localized;
  role: Localized;
  bio: Localized;
  degree: MemberDegree;
  /** Core members are framed in gold and surfaced on the home page. */
  lead: boolean;
  avatarUrl: string;
  email: string;
  githubUsername: string;
  scholarUrl: string;
  interests: string[];
}

export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface Project extends Timestamped {
  id: string;
  title: Localized;
  summary: Localized;
  status: ProjectStatus;
  repositoryUrl: string;
  demoUrl: string;
  /** Member ids collaborating on the project. */
  memberIds: string[];
  tags: string[];
  startedAt: string;
}

export interface ResearchArea extends Timestamped {
  id: string;
  title: Localized;
  summary: Localized;
  /** Single emoji used as the section kicker glyph. */
  glyph: string;
  tags: string[];
  order: number;
}

export interface ContentSchema {
  events: LabEvent[];
  members: Member[];
  projects: Project[];
  research: ResearchArea[];
}

export type CollectionName = keyof ContentSchema;

export type CollectionItem<K extends CollectionName> = ContentSchema[K][number];
