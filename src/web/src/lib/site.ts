import { LAB, SITE } from "../config";
import { memberPath, memberSlug } from "./members";
import type { Member } from "../types";

export const PATHS = {
  home: "/",
  lab: "/lab",
  research: "/research",
  publications: "/publications",
  people: "/people",
} as const;

/** Canonical absolute URL. Home keeps a trailing slash; other paths never have one. */
export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${SITE.origin}/`;
  return `${SITE.origin}${normalized.replace(/\/+$/, "")}`;
}

export function assetUrl(path?: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return absoluteUrl(path.startsWith("/") ? path : `/${path}`);
}

export function sameAsFor(member: Member) {
  return [
    member.homepage,
    member.linkedin,
    member.scholar,
    member.researchgate,
    member.scopus,
    member.dblp,
    member.github ? `https://github.com/${member.github}` : "",
  ].filter(Boolean) as string[];
}

export function labSameAs() {
  return [LAB.github, LAB.dslabPage, LAB.homepage, absoluteUrl(PATHS.lab)];
}

export function universitySameAs() {
  return [LAB.universityUrl, LAB.universityWiki, LAB.universityWikiFa, LAB.schoolUrl];
}

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "profile" | "article";
  keywords?: string[];
}

export function homeMeta(): PageMeta {
  return {
    title: `${LAB.name} — ${LAB.fullName} at ${LAB.universityShort}`,
    description: `${LAB.fullName} (${LAB.name}) at ${LAB.university}, directed by ${LAB.director}. Research in distributed operating systems, HPC, cloud, CEP, WSAN, and computer security.`,
    path: PATHS.home,
    image: assetUrl("assets/images/mohsen-sharifi.jpg"),
    keywords: [
      LAB.name, LAB.fullName, LAB.nameFa, LAB.university, LAB.universityFa, LAB.universityShort,
      LAB.director, LAB.directorFa, "distributed systems lab", "distributed operating systems",
    ],
  };
}

export function labMeta(): PageMeta {
  return {
    title: `${LAB.fullName} (${LAB.name}) — ${LAB.universityShort}`,
    description: `${LAB.fullName} is a research laboratory at the ${LAB.school}, ${LAB.university}. Directed by ${LAB.director} since ${LAB.foundingYear}.`,
    path: PATHS.lab,
    image: assetUrl("assets/images/mohsen-sharifi.jpg"),
    keywords: [LAB.name, LAB.fullName, LAB.nameFa, "DSLab", "distributed systems laboratory", LAB.director],
  };
}

export function researchMeta(): PageMeta {
  return {
    title: `Research — ${LAB.name}`,
    description: `Research areas at ${LAB.fullName} (${LAB.name}): high-performance computing, distributed systems, cloud computing, complex event processing, wireless sensor-actor networks, and computer security.`,
    path: PATHS.research,
    image: assetUrl("assets/images/mohsen-sharifi.jpg"),
    keywords: [LAB.name, LAB.fullName, "distributed systems research", "HPC", "cloud computing", "WSAN"],
  };
}

export function publicationsMeta(): PageMeta {
  return {
    title: `Publications — ${LAB.name}`,
    description: `Selected journal and conference papers from ${LAB.fullName} (${LAB.name}) at ${LAB.universityShort}, with DOIs when they are available.`,
    path: PATHS.publications,
    image: assetUrl("assets/images/mohsen-sharifi.jpg"),
    keywords: [LAB.name, LAB.fullName, "publications", "research papers", "distributed systems", "HPC"],
  };
}

export function peopleIndexMeta(): PageMeta {
  return {
    title: `People — ${LAB.name} researchers, students and alumni`,
    description: `Directory of ${LAB.fullName} at ${LAB.university}: ${LAB.director}, current researchers, students and alumni of ${LAB.name}.`,
    path: PATHS.people,
    keywords: [LAB.director, LAB.directorFa, "DSLab CE-IUST members", "distributed systems researchers CE-IUST"],
  };
}

export function memberMeta(member: Member): PageMeta {
  const focus = (member.focus || []).join(", ");
  const lead = member.leadership === "director"
    ? `${member.name} is ${member.role} and director of ${LAB.fullName} at ${LAB.university}.`
    : `${member.name} is a ${member.role} at ${LAB.fullName} (${LAB.name}), ${LAB.university}.`;
  const extra = member.thesis || focus || member.bio || "";
  const description = extra ? `${lead} ${extra}`.slice(0, 220) : lead;

  return {
    title: `${member.name} — ${member.role} | ${LAB.name}`,
    description,
    path: memberPath(member.name),
    image: assetUrl(member.photo),
    type: "profile",
    keywords: [member.name, member.role, LAB.name, LAB.university, LAB.universityShort, ...focus.split(", ").filter(Boolean)],
  };
}

export function notFoundMeta(): PageMeta {
  return {
    title: `Page not found — ${LAB.name}`,
    description: `This page is not in the ${LAB.fullName} site. Browse the lab, research, publications, or people directory.`,
    path: "/404",
  };
}

export function memberAffiliation(member: Member) {
  if (member.leadership === "alumni") {
    return `Alumnus of ${LAB.fullName} at ${LAB.university}`;
  }
  if (member.leadership === "director") {
    return `Director, ${LAB.fullName}, ${LAB.school}, ${LAB.university}`;
  }
  return `${member.role} at ${LAB.fullName}, ${LAB.university}`;
}

export function memberAnswer(member: Member) {
  const focus = member.focus?.length ? ` Research focus: ${member.focus.join(", ")}.` : "";
  const years = member.years ? ` Years at the lab: ${member.years}.` : "";
  const thesis = member.thesis ? ` Thesis: ${member.thesis}.` : "";
  return `${member.name} is a ${member.role} at the ${LAB.fullName} (${LAB.name}) in the ${LAB.school}, ${LAB.university}. The lab is directed by ${LAB.director}.${focus}${years}${thesis}`;
}

export { memberPath, memberSlug };
