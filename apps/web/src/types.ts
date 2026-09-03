export type Theme = "dark" | "light";

export type Leadership = "director" | "lead" | "member" | "researcher" | "alumni" | string;
export type AlumniGroup = "phd" | "master" | "undergraduate" | string;

export interface Member {
  name: string;
  role: string;
  cardFooter?: string;
  leadership?: Leadership;
  alumniGroup?: AlumniGroup;
  years?: string;
  thesis?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  scholar?: string;
  researchgate?: string;
  scopus?: string;
  dblp?: string;
  homepage?: string;
  photo?: string;
  bio?: string;
  degree?: string;
  educationLevel?: string;
  studyLevel?: string;
  focus?: string[];
}

export interface GithubProfile {
  login?: string;
  name?: string;
  avatar_url?: string;
  html_url?: string;
  bio?: string;
  company?: string;
  location?: string;
  blog?: string;
  public_repos?: number;
}

export interface GithubStats {
  organization?: string;
  generatedAt?: string | null;
  repoCount?: number;
  totalCommits?: number;
  activeContributors?: unknown[];
  repositories?: unknown[];
  profiles?: Record<string, GithubProfile>;
  windowDays?: number;
  snapshot?: string;
}

export interface Presentation {
  member?: string;
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  link?: string;
  linkLabel?: string;
  series?: string;
}

export interface PresentationData {
  presentations?: Presentation[];
}

export interface ProjectLink {
  url?: string;
  label?: string;
  icon?: string;
}

export interface WorkItem {
  title?: string;
  status?: string;
  description?: string;
  tags?: string[];
  members?: string[];
}

export interface ProjectItem extends WorkItem {
  type?: string;
  links?: ProjectLink[];
}

export interface LabWork {
  currentWork?: WorkItem[];
  projects?: ProjectItem[];
}

export interface DegreeInfo {
  code: string;
  label: string;
  stars: number;
  className: string;
}
