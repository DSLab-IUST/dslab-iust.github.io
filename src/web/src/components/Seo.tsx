import { useEffect } from "react";
import { SITE } from "@/config";
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
    setMeta('link[rel="canonical"]', { rel: "canonical", href: absoluteUrl(meta.path) });

    setMeta('meta[property="og:title"]', { property: "og:title", content: meta.title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: meta.description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: meta.type === "profile" ? "profile" : "website" });
    setMeta('meta[property="og:url"]', { property: "og:url", content: absoluteUrl(meta.path) });
    setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "DSLab IUST" });
    setMeta('meta[property="og:locale"]', { property: "og:locale", content: "en_US" });
    setMeta('meta[property="og:locale:alternate"]', { property: "og:locale:alternate", content: SITE.localeFa });
    if (meta.image) {
      setMeta('meta[property="og:image"]', { property: "og:image", content: meta.image });
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
