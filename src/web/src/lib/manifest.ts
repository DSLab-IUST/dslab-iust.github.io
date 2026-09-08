import { BRAND, LAB, SITE, SITE_NAME } from "../config";

export function webAppManifest() {
  const icon = (src: string, sizes: string, purpose: "any" | "maskable") => ({
    src,
    sizes,
    type: "image/png",
    purpose,
  });

  return {
    id: `${SITE.origin}/`,
    name: SITE_NAME,
    short_name: "DSLab",
    description: `${LAB.fullName} (${LAB.name}) at ${LAB.university}, directed by ${LAB.director}. Research in distributed operating systems, high-performance computing, cloud environments, complex event processing, wireless sensor-actor networks, and computer security.`,
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui", "browser"],
    orientation: "any",
    background_color: "#10141F",
    theme_color: "#10141F",
    lang: SITE.locale,
    dir: "ltr",
    categories: ["education", "science"],
    icons: [
      icon(BRAND.icon48, "48x48", "any"),
      icon(BRAND.icon96, "96x96", "any"),
      icon(BRAND.icon192, "192x192", "any"),
      icon(BRAND.icon512, "512x512", "any"),
      icon(BRAND.maskable192, "192x192", "maskable"),
      icon(BRAND.maskable512, "512x512", "maskable"),
    ],
    shortcuts: [
      {
        name: LAB.fullName,
        short_name: "Lab",
        url: "/lab",
        description: `About ${LAB.fullName} at ${LAB.universityShort}.`,
        icons: [icon(BRAND.icon96, "96x96", "any")],
      },
      {
        name: "Research",
        short_name: "Research",
        url: "/research",
        description: `Research areas at ${LAB.fullName}.`,
        icons: [icon(BRAND.icon96, "96x96", "any")],
      },
      {
        name: "People",
        short_name: "People",
        url: "/people",
        description: `Researchers, students and alumni of ${LAB.name}.`,
        icons: [icon(BRAND.icon96, "96x96", "any")],
      },
      {
        name: "Publications",
        short_name: "Papers",
        url: "/publications",
        description: `Selected papers from ${LAB.fullName}.`,
        icons: [icon(BRAND.icon96, "96x96", "any")],
      },
    ],
  };
}

export function webAppManifestJson() {
  return `${JSON.stringify(webAppManifest(), null, 2)}\n`;
}
