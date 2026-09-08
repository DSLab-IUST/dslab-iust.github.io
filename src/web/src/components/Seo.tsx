import { useEffect } from "react";
import { BRAND, SITE, SITE_NAME } from "@/config";
import { serializeJsonLd } from "@/lib/schema";
import { absoluteUrl, type PageMeta } from "@/lib/site";

function setMeta(selector: string, attrs: Record<string, string>) {
  let node = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!node) {
    const tag = selector.startsWith("link") ? "link" : "meta";
    node = document.createElement(tag);
    document.head.appendChild(node);
  }
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
}

export function Seo({ meta, jsonLd }: { meta: PageMeta; jsonLd: unknown }) {
  useEffect(() => {
    document.title = meta.title;
    document.documentElement.lang = SITE.locale;

    setMeta('meta[name="description"]', { name: "description", content: meta.description });
    setMeta('meta[name="keywords"]', { name: "keywords", content: (meta.keywords || []).join(", ") });
    setMeta('meta[name="robots"]', { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" });
    setMeta('link[rel="robots"]', { rel: "robots", href: `${SITE.origin}/robots.txt` });
    setMeta('link[rel="sitemap"][type="application/xml"]', {
      rel: "sitemap",
      type: "application/xml",
      title: "Sitemap",
      href: `${SITE.origin}/sitemap.xml`,
    });
    setMeta('link[rel="sitemap"][type="text/plain"]', {
      rel: "sitemap",
      type: "text/plain",
      title: "Text Sitemap",
      href: `${SITE.origin}/sitemap.txt`,
    });
    setMeta('link[rel="canonical"]', { rel: "canonical", href: absoluteUrl(meta.path) });

    setMeta('link[rel="manifest"]', { rel: "manifest", href: BRAND.manifest });
    setMeta('link[rel="icon"][sizes="48x48"]', { rel: "icon", type: "image/png", sizes: "48x48", href: BRAND.icon48 });
    setMeta('link[rel="icon"][sizes="96x96"]', { rel: "icon", type: "image/png", sizes: "96x96", href: BRAND.icon96 });
    setMeta('link[rel="icon"][sizes="192x192"]', { rel: "icon", type: "image/png", sizes: "192x192", href: BRAND.icon192 });
    setMeta('link[rel="apple-touch-icon"]', { rel: "apple-touch-icon", sizes: "180x180", href: BRAND.appleTouchIcon });
    setMeta('meta[name="application-name"]', { name: "application-name", content: "DSLab" });
    setMeta('meta[name="apple-mobile-web-app-title"]', { name: "apple-mobile-web-app-title", content: "DSLab" });

    setMeta('meta[property="og:title"]', { property: "og:title", content: meta.title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: meta.description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: meta.type === "profile" ? "profile" : "website" });
    setMeta('meta[property="og:url"]', { property: "og:url", content: absoluteUrl(meta.path) });
    setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    setMeta('meta[property="og:locale"]', { property: "og:locale", content: "en_US" });
    setMeta('meta[property="og:locale:alternate"]', { property: "og:locale:alternate", content: SITE.localeFa });
    if (meta.image) {
      setMeta('meta[property="og:image"]', { property: "og:image", content: meta.image });
      setMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: meta.title });
      setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: meta.image });
    }

    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: meta.title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: meta.description });

    const existing = document.getElementById("json-ld-graph");
    const script = existing instanceof HTMLScriptElement ? existing : document.createElement("script");
    script.id = "json-ld-graph";
    script.type = "application/ld+json";
    script.textContent = serializeJsonLd(jsonLd);
    if (!existing) document.head.appendChild(script);
  }, [meta, jsonLd]);

  return null;
}
