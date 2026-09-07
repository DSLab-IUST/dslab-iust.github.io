import type { DegreeInfo, GithubStats, LinkedinPhotoIndex, Member } from "../types";

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

type MemberIdentity = Pick<Member, "github" | "photo" | "linkedin" | "leadership" | "linkedinPhoto"> & Partial<Member>;

export function profileFor(member?: MemberIdentity | null, githubStats?: GithubStats | null) {
  if (!member?.github) return {};
  const profiles = githubStats?.profiles ?? {};
  const exact = profiles[member.github];
  if (exact) return exact;
  const key = Object.keys(profiles).find((name) => name.toLowerCase() === member.github!.toLowerCase());
  return key ? profiles[key] : {};
}

/** Root-absolute src so photos work on nested routes like /people/:slug. */
export function publicAssetSrc(path?: string) {
  const src = String(path || "").trim();
  if (!src) return "";
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }
  return src.startsWith("/") ? src : `/${src}`;
}

const NAME_HONORIFICS = /^(prof\.?|dr\.?|professor|seyed(?:eh)?)\s+/i;

export function memberPlaceholderPath(name?: string) {
  const slug = memberSlug(name || "");
  return slug ? `assets/images/placeholders/${slug}.svg` : "";
}

function givenAndFamilyParts(name?: string) {
  return String(name || "")
    .replace(NAME_HONORIFICS, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/** First letter of given name + first letter of family name. */
export function memberInitials(name?: string) {
  const parts = givenAndFamilyParts(name);
  if (!parts.length) return "?";
  const first = Array.from(parts[0])[0] || "";
  const last = parts.length > 1
    ? (Array.from(parts[parts.length - 1])[0] || "")
    : (Array.from(parts[0])[1] || first);
  return `${first}${last}`.toLocaleUpperCase("en-US");
}

export const AVATAR_TONE_COUNT = 4;

/** Stable 0–3 tone so the same member keeps the same muted color. */
export function memberAvatarTone(name?: string) {
  const value = String(name || "");
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash % AVATAR_TONE_COUNT;
}

export function linkedinUsername(url?: string) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    const match = parsed.pathname.match(/\/in\/([^/]+)/i);
    return match ? decodeURIComponent(match[1]).replace(/\/+$/, "") : "";
  } catch {
    const match = raw.match(/linkedin\.com\/in\/([^/?#]+)/i);
    return match ? decodeURIComponent(match[1]).replace(/\/+$/, "") : "";
  }
}

/** Public LinkedIn avatar via unavatar; 404 when the profile has no photo. */
export function linkedinAvatarUrl(url?: string) {
  const username = linkedinUsername(url);
  if (!username) return "";
  return `https://unavatar.io/linkedin/user:${encodeURIComponent(username)}?fallback=false`;
}

export function applyAlumniLinkedinPhotos(members: Member[], index?: LinkedinPhotoIndex | null) {
  const photos = index?.photos ?? {};
  return members.map((member) => {
    if (!isAlumni(member)) return member;
    const username = linkedinUsername(member.linkedin);
    const photo = username ? photos[username] : "";
    return photo ? { ...member, linkedinPhoto: photo } : member;
  });
}

function collectPhotoCandidates(
  member?: (MemberIdentity & { name?: string }) | null,
  githubStats?: GithubStats | null,
  includeRemoteLinkedin = false,
) {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (value?: string) => {
    const src = String(value || "").trim();
    if (!src || seen.has(src)) return;
    seen.add(src);
    out.push(src);
  };

  if (isAlumni(member)) {
    push(member?.linkedinPhoto);
    if (includeRemoteLinkedin && !member?.linkedinPhoto) {
      push(linkedinAvatarUrl(member?.linkedin));
    }
  }
  push(member?.photo);
  push(profileFor(member, githubStats).avatar_url);
  return out;
}

export function memberPhotoPath(
  member?: (MemberIdentity & { name?: string }) | null,
  githubStats?: GithubStats | null,
) {
  return collectPhotoCandidates(member, githubStats, false)[0] || "";
}

export function memberPhotoSources(
  member?: (MemberIdentity & { name?: string }) | null,
  githubStats?: GithubStats | null,
) {
  return collectPhotoCandidates(member, githubStats, true).map(publicAssetSrc).filter(Boolean);
}

export function memberPhoto(member?: (MemberIdentity & { name?: string }) | null, githubStats?: GithubStats | null) {
  return memberPhotoSources(member, githubStats)[0] || "";
}

export function memberBio(member?: MemberIdentity | null, githubStats?: GithubStats | null, fallback = "No bio yet.") {
  const profile = profileFor(member, githubStats);
  return member?.bio || profile.bio || fallback;
}

export function isAlumni(member?: Pick<Member, "leadership"> | null) {
  return member?.leadership === "alumni";
}

export function memberNowLine(member?: Pick<Member, "position" | "affiliation"> | null) {
  const position = String(member?.position || "").trim();
  const affiliation = String(member?.affiliation || "").trim();
  if (position && affiliation) return `${position} · ${affiliation}`;
  return position || affiliation;
}

export function resolveDegree(member?: Member | null): DegreeInfo | null {
  const raw = String(member?.degree || member?.educationLevel || member?.studyLevel || "").trim();
  if (!raw) return null;

  const key = raw.toLowerCase().replace(/[.\s_-]+/g, "");
  const alumni = isAlumni(member);

  if (["bsc", "bs", "bachelor", "bachelors", "undergrad", "undergraduate"].includes(key) || raw === "کارشناسی") {
    return { code: "B.Sc", label: alumni ? "Bachelor's alumnus" : "Bachelor's student", stars: 1, className: "degree-bsc" };
  }
  if (["msc", "ms", "master", "masters", "graduate"].includes(key) || raw === "کارشناسی ارشد") {
    return { code: "M.Sc", label: alumni ? "Master's alumnus" : "Master's student", stars: 2, className: "degree-msc" };
  }
  if (["phd", "doctorate", "doctoral", "doctor"].includes(key) || raw === "دکترا" || raw === "دکتری") {
    return { code: "Ph.D", label: alumni ? "PhD alumnus" : "PhD candidate", stars: 3, className: "degree-phd" };
  }

  return null;
}

export function cardFooterLabel(member: Member) {
  return Object.prototype.hasOwnProperty.call(member, "cardFooter")
    ? String(member.cardFooter || "")
    : (member.role || "DSLab CE-IUST");
}
