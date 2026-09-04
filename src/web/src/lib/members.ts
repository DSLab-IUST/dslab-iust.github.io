import type { DegreeInfo, GithubStats, Member } from "../types";

export function normalizeMemberRef(value?: string) {
  return String(value || "").trim().toLocaleLowerCase();
}

export function memberSlug(name: string) {
  return String(name || "")
    .normalize("NFKD")
    .replace(/^(prof\.?|dr\.?|professor)\s+/i, "")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function memberPath(name: string) {
  return `/people/${memberSlug(name)}`;
}

export function findMemberBySlug(members: Member[], slug: string) {
  const wanted = normalizeMemberRef(slug);
  if (!wanted) return null;
  return members.find((member) => memberSlug(member.name) === wanted) ?? null;
}

export function resolveMember(members: Member[], ref?: string) {
  const wanted = normalizeMemberRef(ref);
  if (!wanted) return null;
  return members.find((member) =>
    normalizeMemberRef(member.name) === wanted
    || normalizeMemberRef(member.github) === wanted,
  ) ?? null;
}

export function resolveTeam(members: Member[], memberRefs: string[] = []) {
  const found: Member[] = [];
  const seen = new Set<string>();

  for (const ref of memberRefs) {
    const member = resolveMember(members, ref);
    if (!member) {
      console.warn(`[DSLab] Member "${ref}" from current-work.json or projects.json was not found in data/members.json.`);
      continue;
    }
    const key = normalizeMemberRef(member.github || member.name);
    if (!seen.has(key)) {
      seen.add(key);
      found.push(member);
    }
  }

  return found;
}

type MemberIdentity = Pick<Member, "github" | "photo"> & Partial<Member>;

export function profileFor(member?: MemberIdentity | null, githubStats?: GithubStats | null) {
  if (!member?.github) return {};
  const profiles = githubStats?.profiles ?? {};
  const exact = profiles[member.github];
  if (exact) return exact;
  const key = Object.keys(profiles).find((name) => name.toLowerCase() === member.github!.toLowerCase());
  return key ? profiles[key] : {};
}

export function memberPhoto(member?: MemberIdentity | null, githubStats?: GithubStats | null) {
  const profile = profileFor(member, githubStats);
  return member?.photo || profile.avatar_url || "";
}

export function memberBio(member?: MemberIdentity | null, githubStats?: GithubStats | null, fallback = "No bio yet.") {
  const profile = profileFor(member, githubStats);
  return member?.bio || profile.bio || fallback;
}

export function resolveDegree(member?: Member | null): DegreeInfo | null {
  const raw = String(member?.degree || member?.educationLevel || member?.studyLevel || "").trim();
  if (!raw) return null;

  const key = raw.toLowerCase().replace(/[.\s_-]+/g, "");

  if (["bsc", "bs", "bachelor", "bachelors", "undergrad", "undergraduate"].includes(key) || raw === "کارشناسی") {
    return { code: "B.Sc", label: "Bachelor's student", stars: 1, className: "degree-bsc" };
  }
  if (["msc", "ms", "master", "masters", "graduate"].includes(key) || raw === "کارشناسی ارشد") {
    return { code: "M.Sc", label: "Master's student", stars: 2, className: "degree-msc" };
  }
  if (["phd", "doctorate", "doctoral", "doctor"].includes(key) || raw === "دکترا" || raw === "دکتری") {
    return { code: "Ph.D", label: "PhD student", stars: 3, className: "degree-phd" };
  }

  return null;
}

export function cardFooterLabel(member: Member) {
  return Object.prototype.hasOwnProperty.call(member, "cardFooter")
    ? String(member.cardFooter || "")
    : (member.role || "DSLab IUST");
}
