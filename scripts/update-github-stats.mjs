import fs from "node:fs/promises";

const ORG = process.env.GITHUB_ORG || "DSLab-IUST";
const TOKEN = process.env.DSLAB_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";
const API = "https://api.github.com";
const API_VERSION = "2022-11-28";
const WINDOW_DAYS = Number(process.env.ACTIVITY_WINDOW_DAYS || 90);
const EXCLUDE_REPOS = new Set(
  (process.env.EXCLUDE_REPOS || "")
    .split(",")
    .map(x => x.trim().toLowerCase())
    .filter(Boolean)
);

if (!ORG || ORG === "YOUR_GITHUB_ORG") {
  throw new Error("Set GITHUB_ORG before running this script.");
}

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": API_VERSION,
  "User-Agent": "DSLab-IUST-public-stats",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function request(path, { allow202 = false, allow204 = false, allow409 = false } = {}) {
  const response = await fetch(`${API}${path}`, { headers });
  if (allow202 && response.status === 202) return { status: 202, data: null, headers: response.headers };
  if (allow204 && response.status === 204) return { status: 204, data: null, headers: response.headers };
  if (allow409 && response.status === 409) return { status: 409, data: null, headers: response.headers };
  if (!response.ok) {
    const err = new Error(`GitHub API returned HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }
  return { status: response.status, data: await response.json(), headers: response.headers };
}

function lastPageFromLink(linkHeader) {
  const match = String(linkHeader || "").match(/<([^>]+)>;\s*rel="last"/);
  if (!match) return 0;
  try {
    return Number(new URL(match[1]).searchParams.get("page") || 0);
  } catch {
    return 0;
  }
}

async function paginate(path) {
  const out = [];
  let page = 1;
  while (true) {
    const glue = path.includes("?") ? "&" : "?";
    const { data, headers: h } = await request(`${path}${glue}per_page=100&page=${page}`);
    out.push(...data);
    if (!h.get("link")?.includes('rel="next"') || data.length < 100) break;
    page += 1;
    await sleep(80);
  }
  return out;
}

async function listRepos() {
  return paginate(`/orgs/${encodeURIComponent(ORG)}/repos?type=public&sort=updated&direction=desc`);
}

async function readPreviousStats() {
  try {
    const previous = JSON.parse(await fs.readFile("data/github-stats.json", "utf8"));
    return previous && typeof previous === "object" ? previous : null;
  } catch {
    return null;
  }
}

async function readMembers() {
  try {
    return JSON.parse(await fs.readFile("data/members.json", "utf8"));
  } catch {
    return [];
  }
}

const AVATAR_DIR = "assets/images/avatars";

async function cacheAvatar(login, remoteUrl) {
  if (!login || !remoteUrl || !/^https?:\/\//.test(remoteUrl)) {
    return remoteUrl || "";
  }

  await fs.mkdir(AVATAR_DIR, { recursive: true });
  const ext = remoteUrl.toLowerCase().includes(".png") ? "png" : "jpg";
  const fileName = `${login}.${ext}`;
  const diskPath = `${AVATAR_DIR}/${fileName}`;
  const publicPath = `${AVATAR_DIR}/${fileName}`;

  try {
    const response = await fetch(remoteUrl);
    if (!response.ok) return "";
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(diskPath, buffer);
    return publicPath;
  } catch {
    try {
      await fs.access(diskPath);
      return publicPath;
    } catch {
      return "";
    }
  }
}

async function fetchProfiles(members) {
  const usernames = [...new Set(members.map(m => m.github).filter(Boolean))];
  const profiles = {};

  for (const username of usernames) {
    try {
      const { data } = await request(`/users/${encodeURIComponent(username)}`);
      profiles[username] = {
        login: data.login,
        name: data.name,
        avatar_url: await cacheAvatar(data.login, data.avatar_url),
        html_url: data.html_url,
        bio: data.bio,
        company: data.company,
        location: data.location,
        blog: data.blog,
        public_repos: data.public_repos,
      };
    } catch {
      console.warn(`Could not refresh public profile for @${username}.`);
    }
    await sleep(50);
  }

  return profiles;
}

async function repoCommitCount(repoName, defaultBranch) {
  const sha = defaultBranch ? `&sha=${encodeURIComponent(defaultBranch)}` : "";
  const path = `/repos/${encodeURIComponent(ORG)}/${encodeURIComponent(repoName)}/commits?per_page=1${sha}`;
  const result = await request(path, { allow409: true });
  if (result.status === 409) return 0;
  const lastPage = lastPageFromLink(result.headers.get("link"));
  if (lastPage > 0) return lastPage;
  return Array.isArray(result.data) ? result.data.length : 0;
}

async function repoCommitCountFromContributors(repoName) {
  const contributors = await paginate(
    `/repos/${encodeURIComponent(ORG)}/${encodeURIComponent(repoName)}/contributors?anon=1`
  );
  return contributors.reduce((sum, contributor) => sum + Number(contributor.contributions || 0), 0);
}

async function repoCommitsSince(repoName, defaultBranch, sinceIso) {
  const sha = defaultBranch ? `&sha=${encodeURIComponent(defaultBranch)}` : "";
  try {
    return await paginate(
      `/repos/${encodeURIComponent(ORG)}/${encodeURIComponent(repoName)}/commits?since=${encodeURIComponent(sinceIso)}${sha}`
    );
  } catch (error) {
    if (error.status === 409) return [];
    throw error;
  }
}

async function main() {
  console.log(`Collecting public GitHub statistics for ${ORG}${TOKEN ? " (authenticated)" : " (unauthenticated)"} ...`);

  const previousStats = await readPreviousStats();
  const allRepos = await listRepos();
  const repos = allRepos.filter(repo =>
    !repo.archived &&
    !repo.fork &&
    !EXCLUDE_REPOS.has(String(repo.name || "").toLowerCase())
  );

  const members = await readMembers();
  const configuredUsers = new Set(members.map(m => String(m.github || "").toLowerCase()).filter(Boolean));
  const profiles = await fetchProfiles(members);
  const sinceIso = new Date(Date.now() - WINDOW_DAYS * 86400000).toISOString();
  const activity = new Map();
  let totalCommits = 0;
  let countedRepos = 0;
  let reposWithStats = 0;

  for (let i = 0; i < repos.length; i += 1) {
    const repo = repos[i];
    console.log(`[${i + 1}/${repos.length}] Reading statistics for ${repo.name} ...`);

    try {
      totalCommits += await repoCommitCount(repo.name, repo.default_branch);
      countedRepos += 1;
    } catch (error) {
      try {
        totalCommits += await repoCommitCountFromContributors(repo.name);
        countedRepos += 1;
      } catch {
        console.warn(`[${i + 1}/${repos.length}] Commit count unavailable (HTTP ${error.status || "error"}).`);
      }
    }

    let recentCommits = [];
    try {
      recentCommits = await repoCommitsSince(repo.name, repo.default_branch, sinceIso);
      reposWithStats += 1;
    } catch (error) {
      console.warn(`[${i + 1}/${repos.length}] Recent commit activity unavailable (HTTP ${error.status || "error"}).`);
    }

    for (const commit of recentCommits) {
      const login = String(commit.author?.login || "");
      if (!login || !configuredUsers.has(login.toLowerCase())) continue;

      const existing = activity.get(login.toLowerCase()) || {
        login,
        name: profiles[login]?.name || login,
        avatar_url: profiles[login]?.avatar_url || "",
        commits: 0,
      };
      if (!existing.avatar_url && commit.author?.avatar_url) {
        existing.avatar_url = await cacheAvatar(login, commit.author.avatar_url);
      }
      existing.commits += 1;
      activity.set(login.toLowerCase(), existing);
    }
  }

  const activeContributors = [...activity.values()].sort((a, b) => b.commits - a.commits);

  const previousCommitTotal = Number(previousStats?.totalCommits || 0);
  const previousRepoCount = Number(previousStats?.repoCount || 0);
  if (repos.length === 0 && previousRepoCount > 0) {
    throw new Error("GitHub returned zero public repositories; refusing to overwrite the last good statistics snapshot.");
  }
  if (countedRepos === 0 && previousCommitTotal > 0) {
    console.warn("Commit counts were unavailable; preserving the last known commit total.");
    totalCommits = previousCommitTotal;
  }

  const output = {
    organization: ORG,
    generatedAt: new Date().toISOString(),
    windowDays: WINDOW_DAYS,
    repoCount: repos.length,
    totalCommits,
    activeContributors,
    repositories: [],
    profiles,
    privacy: {
      repositoryDetailsPublished: false,
      sourceContentsPermissionRequired: false,
      statsMode: "public-metadata-only",
      repositoriesWithStats: reposWithStats,
    },
    notes: {
      totalCommits: "Sum of default-branch commit counts across included public repositories, matching GitHub's repository commit listing (includes merge commits).",
      activeContributors: `Configured DSLab members with at least one default-branch commit in the last ${WINDOW_DAYS} days.`,
      repositories: "Repository names, URLs, descriptions and source contents are not written to the public JSON output.",
    },
  };

  await fs.mkdir("data", { recursive: true });
  await fs.writeFile("data/github-stats.json", JSON.stringify(output, null, 2) + "\n");
  console.log(`Done: ${repos.length} public repositories counted, ${totalCommits} tracked commits, ${activeContributors.length} active configured members.`);
}

main().catch(err => {
  console.error(`Stats workflow failed: ${err.message}`);
  process.exit(1);
});
