import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Plugin } from "vite";
import { LAB, SITE } from "./src/config";
import { memberPath, memberSlug } from "./src/lib/members";
import {
  homeGraph,
  labGraph,
  memberGraph,
  peopleIndexGraph,
  serializeJsonLd,
  universityGraph,
} from "./src/lib/schema";
import {
  homeMeta,
  labMeta,
  memberMeta,
  peopleIndexMeta,
  universityMeta,
  type PageMeta,
} from "./src/lib/site";
import type { Member } from "./src/types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function injectHead(html: string, meta: PageMeta, jsonLd: unknown, article: string) {
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="keywords" content="${escapeHtml((meta.keywords || []).join(", "))}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    `<link rel="canonical" href="${SITE.origin}${meta.path === "/" ? "/" : meta.path}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="${meta.type === "profile" ? "profile" : "website"}" />`,
    `<meta property="og:url" content="${SITE.origin}${meta.path === "/" ? "/" : meta.path}" />`,
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

function sitemapXml(paths: string[]) {
  const urls = paths.map((path) => {
    const loc = path === "/" ? `${SITE.origin}/` : `${SITE.origin}${path}`;
    return `  <url><loc>${loc}</loc><changefreq>weekly</changefreq></url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
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
    "",
  ].join("\n");
}

function llmsTxt(members: Member[]) {
  const people = members.map((member) => `- [${member.name}](${SITE.origin}${memberPath(member.name)}): ${member.role}`).join("\n");
  return `# ${LAB.name}

> ${LAB.fullName} (${LAB.nameFa}) at ${LAB.university} (${LAB.universityFa}). Directed by ${LAB.director} (${LAB.directorFa}) since ${LAB.foundingYear}.

## Site
- [Home](${SITE.origin}/)
- [Lab](${SITE.origin}/lab): ${LAB.fullName} / ${LAB.nameFa}
- [University](${SITE.origin}/university): ${LAB.university} / ${LAB.universityFa}
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
      const template = readFileSync(resolve(dist, "index.html"), "utf8");

      const pages: Array<{ file: string; meta: PageMeta; jsonLd: unknown; article: string }> = [
        {
          file: "index.html",
          meta: homeMeta(),
          jsonLd: homeGraph(members),
          article: article(homeMeta().title, homeMeta().description, [
            { href: "/lab", label: LAB.fullName },
            { href: "/university", label: LAB.university },
            { href: "/people", label: "People" },
          ]),
        },
        {
          file: "lab/index.html",
          meta: labMeta(),
          jsonLd: labGraph(members),
          article: article(labMeta().title, labMeta().description, [
            { href: "/university", label: LAB.university },
            { href: "/people", label: "People" },
            ...members.slice(0, 12).map((member) => ({ href: memberPath(member.name), label: member.name })),
          ]),
        },
        {
          file: "university/index.html",
          meta: universityMeta(),
          jsonLd: universityGraph(members),
          article: article(universityMeta().title, universityMeta().description, [
            { href: "/lab", label: LAB.fullName },
            { href: "/people", label: "People" },
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
          meta: memberMeta(member),
          jsonLd: memberGraph(member, members),
          article: article(memberMeta(member).title, memberMeta(member).description, [
            { href: "/lab", label: LAB.fullName },
            { href: "/university", label: LAB.university },
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
      writeFileSync(resolve(dist, "sitemap.xml"), sitemapXml([
        "/",
        "/lab",
        "/university",
        "/people",
        ...members.map((member) => memberPath(member.name)),
      ]));
      writeFileSync(resolve(dist, "llms.txt"), llmsTxt(members));
    },
  };
}
