import { CONFIG, STATS_CACHE_KEY } from "@/config";
import type { GithubStats, LabWork, Member, PresentationData, ProjectItem, WorkItem } from "@/types";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

function statsAreUseful(stats?: GithubStats | null) {
  return Boolean(stats && (Number(stats.totalCommits || 0) > 0 || Number(stats.repoCount || 0) > 0));
}

function readCachedStats(): GithubStats | null {
  try {
    const cached = JSON.parse(localStorage.getItem(STATS_CACHE_KEY) || "null") as GithubStats | null;
    return statsAreUseful(cached) ? cached : null;
  } catch {
    return null;
  }
}

function cacheStats(stats: GithubStats) {
  if (!statsAreUseful(stats)) return;
  try {
    localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(stats));
  } catch {
    /* localStorage may be unavailable; live data still works. */
  }
}

const emptyStats: GithubStats = {
  organization: "",
  repoCount: 0,
  totalCommits: 0,
  activeContributors: [],
  repositories: [],
  profiles: {},
  windowDays: 90,
};

export async function loadGithubStats() {
  const cached = readCachedStats();
  try {
    const fresh = await getJson<GithubStats>(CONFIG.statsUrl);
    if (statsAreUseful(fresh)) {
      cacheStats(fresh);
      return fresh;
    }
    if (cached) {
      console.warn("[DSLab] GitHub stats returned an empty snapshot; keeping the last good snapshot.");
      return cached;
    }
    return fresh;
  } catch (error) {
    console.error(error);
    if (cached) {
      console.warn("[DSLab] GitHub stats could not be loaded; using the last good browser snapshot.");
      return cached;
    }
    return emptyStats;
  }
}

export async function loadLabData() {
  let members: Member[] = [];
  let labWork: LabWork = { currentWork: [], projects: [] };
  let presentationData: PresentationData = { presentations: [] };

  try {
    members = await getJson<Member[]>(CONFIG.membersUrl);
  } catch (error) {
    console.error(error);
  }

  const githubStats = await loadGithubStats();

  const [currentWork, projects] = await Promise.all([
    getJson<WorkItem[]>(CONFIG.currentWorkUrl).catch((error) => {
      console.error(error);
      return [] as WorkItem[];
    }),
    getJson<ProjectItem[]>(CONFIG.projectsUrl).catch((error) => {
      console.error(error);
      return [] as ProjectItem[];
    }),
  ]);

  labWork = {
    currentWork: Array.isArray(currentWork) ? currentWork : [],
    projects: Array.isArray(projects) ? projects : [],
  };

  try {
    presentationData = await getJson<PresentationData>(CONFIG.presentationsUrl);
  } catch (error) {
    console.error(error);
  }

  return { members, githubStats, labWork, presentationData };
}

export function coffeeStats(totalCommits = 0, commitsPerCoffee = CONFIG.commitsPerCoffee) {
  const coffeeRate = Math.max(1, Number(commitsPerCoffee || 20));
  const coffees = Math.floor(totalCommits / coffeeRate);
  const remainder = totalCommits % coffeeRate;
  const toNextCoffee = remainder === 0 ? coffeeRate : coffeeRate - remainder;
  return { coffeeRate, coffees, toNextCoffee };
}
