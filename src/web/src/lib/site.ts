import { LAB, SITE } from "../config";
import { memberPath, memberSlug } from "./members";
import type { Member } from "../types";

export const PATHS = {
  home: "/",
  lab: "/lab",
  university: "/university",
  people: "/people",
} as const;

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("http")
    ? path
    : `${SITE.origin}${path.startsWith("/") ? path : `/${path}`}`;
  return normalized.replace(/\/+$/, "") || SITE.origin;
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
  return [LAB.universityUrl, LAB.universityWiki, LAB.universityWikiFa, LAB.schoolUrl, absoluteUrl(PATHS.university)];
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
    description: `${LAB.fullName} (${LAB.nameFa}) at ${LAB.university} (${LAB.universityFa}), directed by ${LAB.director}. Research in distributed operating systems, HPC, cloud, CEP, WSAN, and computer security.`,
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
    description: `${LAB.fullName} is the official ${LAB.nameFa} at the ${LAB.school}, ${LAB.university}. Directed by ${LAB.director} since ${LAB.foundingYear}.`,
    path: PATHS.lab,
    image: assetUrl("assets/images/mohsen-sharifi.jpg"),
    keywords: [LAB.name, LAB.fullName, LAB.nameFa, "DSLab", "distributed systems laboratory", LAB.director],
  };
}

export function universityMeta(): PageMeta {
  return {
    title: `${LAB.university} (${LAB.universityShort}) — ${LAB.name}`,
    description: `${LAB.university} (${LAB.universityFa}) is the home of ${LAB.fullName} (${LAB.name}) in the ${LAB.school}. The lab is directed by ${LAB.director}.`,
    path: PATHS.university,
    image: assetUrl("assets/images/mohsen-sharifi.jpg"),
    keywords: [LAB.university, LAB.universityFa, LAB.universityShort, LAB.school, LAB.schoolFa, LAB.name],
  };
}

export function peopleIndexMeta(): PageMeta {
  return {
    title: `People — ${LAB.name} researchers, students and alumni`,
    description: `Directory of ${LAB.fullName} at ${LAB.university}: ${LAB.director}, current researchers, students and alumni of ${LAB.name}.`,
    path: PATHS.people,
    keywords: [LAB.director, LAB.directorFa, "DSLab IUST members", "distributed systems researchers IUST"],
  };
}

export function memberMeta(member: Member): PageMeta {
  const focus = (member.focus || []).join(", ");
  const lead = member.leadership === "director"
    ? `${member.name} (${LAB.directorFa}) is ${member.role} and director of ${LAB.fullName} at ${LAB.university}.`
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
    description: `This page is not in the ${LAB.fullName} site. Browse the lab, university, or people directory.`,
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
  return `${member.name} is a ${member.role} at the ${LAB.fullName} (${LAB.name}) in the ${LAB.school}, ${LAB.university} (${LAB.universityFa}). The lab is directed by ${LAB.director}.${focus}${years}${thesis}`;
}

export { memberPath, memberSlug };
