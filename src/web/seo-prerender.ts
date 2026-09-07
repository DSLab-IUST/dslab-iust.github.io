import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { LAB, SITE } from "./src/config";
import { memberPath, memberPhotoPath, memberSlug } from "./src/lib/members";
import {
  homeGraph,
  labGraph,
  memberGraph,
  peopleIndexGraph,
  publicationsGraph,
  researchGraph,
  serializeJsonLd,
} from "./src/lib/schema";
import {
  absoluteUrl,
  assetUrl,
  homeMeta,
  labMeta,
  memberMeta,
  peopleIndexMeta,
  publicationsMeta,
  researchMeta,
  type PageMeta,
} from "./src/lib/site";
import type { GithubStats, Member, ProjectItem } from "./src/types";

const repoRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Honest lastmod from git (YYYY-MM-DD). Omit when history is unavailable. */
function gitLastmod(...relativePaths: string[]): string | undefined {
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", ...relativePaths],
      { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : undefined;
  } catch {
    return undefined;
  }
}

function injectHead(html: string, meta: PageMeta, jsonLd: unknown, article: string) {
  const canonical = absoluteUrl(meta.path);
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="keywords" content="${escapeHtml((meta.keywords || []).join(", "))}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="${meta.type === "profile" ? "profile" : "website"}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:site_name" content="${LAB.name}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:locale:alternate" content="${SITE.localeFa}" />`,
    meta.image ? `<meta property="og:image" content="${escapeHtml(meta.image)}" />` : "",
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<script type="application/ld+json" id="json-ld-graph">${serializeJsonLd(jsonLd)}</script>`,
  ].filter(Boolean).join("\n    ");

  let next = html
    .replace(/<title>[^<]*<\/title>\s*/g, "")
    .replace(/<meta name="description"[^>]*>\s*/g, "")
    .replace(/<meta name="robots"[^>]*>\s*/g, "")
    .replace(/<meta name="keywords"[^>]*>\s*/g, "")
    .replace(/<meta name="twitter:[^"]+"[^>]*>\s*/g, "")
    .replace(/<meta property="og:[^"]+"[^>]*>\s*/g, "")
    .replace(/<link rel="canonical"[^>]*>\s*/g, "")
    .replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/g, "");
  next = next.replace("</head>", `    ${tags}\n  </head>`);
  next = next.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <noscript>${article}</noscript>`,
  );
  return next;
}

function article(title: string, body: string, links: Array<{ href: string; label: string }>) {
  const list = links.map((link) => `<li><a href="${link.href}">${escapeHtml(link.label)}</a></li>`).join("");
  return `<article><h1>${escapeHtml(title)}</h1><p>${escapeHtml(body)}</p><ul>${list}</ul></article>`;
}

function writePage(dist: string, filePath: string, html: string) {
  const full = resolve(dist, filePath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
}

interface SitemapImage {
  loc: string;
  title?: string;
}

interface SitemapEntry {
  path: string;
  lastmod?: string;
  images?: SitemapImage[];
}

/**
 * Google-oriented sitemap:
 * - absolute canonical locs only
 * - honest lastmod (omit when unknown)
 * - no priority / changefreq (Google ignores both)
 * - optional image extension for profile photos
 * - XML entity-escaped values
 */
function sitemapXml(entries: SitemapEntry[]) {
  const hasImages = entries.some((entry) => entry.images?.length);
  const rootAttrs = hasImages
    ? [
        'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
      ].join(" ")
    : 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

  const urls = entries.map((entry) => {
    const lines = [
      "  <url>",
      `    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>`,
    ];
    if (entry.lastmod) {
      lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    }
    for (const image of entry.images || []) {
      lines.push("    <image:image>");
      lines.push(`      <image:loc>${escapeXml(image.loc)}</image:loc>`);
      if (image.title) {
        lines.push(`      <image:title>${escapeXml(image.title)}</image:title>`);
      }
      lines.push("    </image:image>");
    }
    lines.push("  </url>");
    return lines.join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset ${rootAttrs}>`,
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

/** Text sitemap fallback — useful when GSC fails to parse XML on some hosts. */
function sitemapTxt(entries: SitemapEntry[]) {
  return `${entries.map((entry) => absoluteUrl(entry.path)).join("\n")}\n`;
}

function robotsTxt() {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    "User-agent: GPTBot",
    "Allow: /",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "User-agent: Google-Extended",
    "Allow: /",
    "User-agent: PerplexityBot",
    "Allow: /",
    "User-agent: ClaudeBot",
    "Allow: /",
    "User-agent: Anthropic-Ai",
    "Allow: /",
    "User-agent: Applebot-Extended",
    "Allow: /",
    "",
    `Sitemap: ${SITE.origin}/sitemap.xml`,
    `Sitemap: ${SITE.origin}/sitemap.txt`,
    "",
  ].join("\n");
}

function buildSitemapEntries(members: Member[], githubStats?: GithubStats | null): SitemapEntry[] {
  const homeLastmod = gitLastmod(
    "data/members.json",
    "data/projects.json",
    "data/current-work.json",
    "data/presentations.json",
    "data/github-stats.json",
    "src/web/src/config.ts",
  );
  const labLastmod = gitLastmod("src/web/src/config.ts", "src/web/src/pages/LabPage.tsx");
  const researchLastmod = gitLastmod("src/web/src/config.ts", "src/web/src/pages/ResearchPage.tsx", "src/web/src/components/Research.tsx");
  const publicationsLastmod = gitLastmod("data/projects.json", "src/web/src/pages/PublicationsPage.tsx", "src/web/src/components/Work.tsx");
  const peopleLastmod = gitLastmod("data/members.json", "src/web/src/pages/PeopleIndexPage.tsx", "src/web/src/pages/MemberPage.tsx");

  const director = members.find((member) => member.leadership === "director");
  const homeImage = director?.photo
    ? [{ loc: assetUrl(director.photo), title: director.name }]
    : undefined;

  return [
    { path: "/", lastmod: homeLastmod, images: homeImage },
    { path: "/lab", lastmod: labLastmod, images: homeImage },
    { path: "/research", lastmod: researchLastmod },
    { path: "/publications", lastmod: publicationsLastmod },
    { path: "/people", lastmod: peopleLastmod },
    ...members.map((member) => {
      const photoPath = memberPhotoPath(member, githubStats);
      const images = photoPath
        ? [{ loc: assetUrl(photoPath), title: member.name }]
        : undefined;
      return {
        path: memberPath(member.name),
        lastmod: peopleLastmod,
        images,
      };
    }),
  ];
}

function llmsTxt(members: Member[]) {
  const people = members.map((member) => `- [${member.name}](${SITE.origin}${memberPath(member.name)}): ${member.role}`).join("\n");
  return `# ${LAB.name}

> ${LAB.fullName} (${LAB.nameFa}) at ${LAB.university} (${LAB.universityFa}). Directed by ${LAB.director} (${LAB.directorFa}) since ${LAB.foundingYear}.

## Site
- [Home](${SITE.origin}/)
- [Lab](${SITE.origin}/lab): ${LAB.fullName} / ${LAB.nameFa}
- [Research](${SITE.origin}/research)
- [Publications](${SITE.origin}/publications)
- [People](${SITE.origin}/people)

## People
${people}

## Optional
- [GitHub](${LAB.github})
- [Faculty lab page](${LAB.dslabPage})
`;
}

export function seoPrerender(): Plugin {
  return {
    name: "dslab-seo-prerender",
    apply: "build",
    closeBundle() {
      const dist = resolve(__dirname, "dist");
      const members = JSON.parse(
        readFileSync(resolve(__dirname, "../../data/members.json"), "utf8"),
      ) as Member[];
      const projects = JSON.parse(
        readFileSync(resolve(__dirname, "../../data/projects.json"), "utf8"),
      ) as ProjectItem[];
      let githubStats: GithubStats | null = null;
      try {
        githubStats = JSON.parse(
          readFileSync(resolve(__dirname, "../../data/github-stats.json"), "utf8"),
        ) as GithubStats;
      } catch {
        githubStats = null;
      }
      const template = readFileSync(resolve(dist, "index.html"), "utf8");

      const pages: Array<{ file: string; meta: PageMeta; jsonLd: unknown; article: string }> = [
        {
          file: "index.html",
          meta: homeMeta(),
          jsonLd: homeGraph(members),
          article: article(homeMeta().title, homeMeta().description, [
            { href: "/lab", label: LAB.fullName },
            { href: "/research", label: "Research" },
            { href: "/publications", label: "Publications" },
            { href: "/people", label: "People" },
          ]),
        },
        {
          file: "lab/index.html",
          meta: labMeta(),
          jsonLd: labGraph(members),
          article: article(labMeta().title, labMeta().description, [
            { href: "/research", label: "Research" },
            { href: "/publications", label: "Publications" },
            { href: "/people", label: "People" },
            ...members.slice(0, 12).map((member) => ({ href: memberPath(member.name), label: member.name })),
          ]),
        },
        {
          file: "research/index.html",
          meta: researchMeta(),
          jsonLd: researchGraph(members),
          article: article(researchMeta().title, researchMeta().description, [
            { href: "/lab", label: LAB.fullName },
            { href: "/publications", label: "Publications" },
            { href: "/people", label: "People" },
          ]),
        },
        {
          file: "publications/index.html",
          meta: publicationsMeta(),
          jsonLd: publicationsGraph(members, projects),
          article: article(publicationsMeta().title, publicationsMeta().description, [
            { href: "/lab", label: LAB.fullName },
            { href: "/research", label: "Research" },
            { href: "/people", label: "People" },
            ...projects.slice(0, 8).map((item) => ({
              href: item.links?.[0]?.url || "/publications",
              label: item.title || "Publication",
            })),
          ]),
        },
        {
          file: "people/index.html",
          meta: peopleIndexMeta(),
          jsonLd: peopleIndexGraph(members),
          article: article(peopleIndexMeta().title, peopleIndexMeta().description, members.map((member) => ({
            href: memberPath(member.name),
            label: member.name,
          }))),
        },
        ...members.map((member) => ({
          file: `people/${memberSlug(member.name)}/index.html`,
          meta: memberMeta(member, githubStats),
          jsonLd: memberGraph(member, members),
          article: article(memberMeta(member, githubStats).title, memberMeta(member, githubStats).description, [
            { href: "/lab", label: LAB.fullName },
            { href: "/research", label: "Research" },
            { href: "/publications", label: "Publications" },
            { href: "/people", label: "People" },
          ]),
        })),
      ];

      for (const page of pages) {
        writePage(dist, page.file, injectHead(template, page.meta, page.jsonLd, page.article));
      }

      writeFileSync(resolve(dist, "404.html"), template);
      writeFileSync(resolve(dist, ".nojekyll"), "");
      writeFileSync(resolve(dist, "robots.txt"), robotsTxt());

      const sitemapEntries = buildSitemapEntries(members, githubStats);
      // UTF-8 without BOM — required by the sitemaps protocol / Google.
      writeFileSync(resolve(dist, "sitemap.xml"), sitemapXml(sitemapEntries), "utf8");
      writeFileSync(resolve(dist, "sitemap.txt"), sitemapTxt(sitemapEntries), "utf8");
      writeFileSync(resolve(dist, "llms.txt"), llmsTxt(members));
    },
  };
}
