export function formatNumber(n: number) {
  return new Intl.NumberFormat("en", {
    notation: n > 9999 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(n || 0);
}

export function formatDate(iso?: string | null) {
  if (!iso) return "Run the stats script to populate live data";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  const diffHours = Math.round((d.getTime() - Date.now()) / 3_600_000);
  return `Updated ${new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(diffHours, "hour")}`;
}

export function safeUrl(value = "") {
  try {
    const raw = String(value).trim();
    if (!raw) return "";
    const url = new URL(raw, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

export function githubOrgHref(org?: string, fallback = "DSLab-IUST") {
  const name = (org || fallback || "DSLab-IUST").trim();
  return `https://github.com/${encodeURIComponent(name)}`;
}

export function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function statusKind(status = "") {
  const value = status.toLowerCase();
  if (/(archiv|complete|done|inactive|publish)/.test(value)) return "idle";
  if (/(fail|error|fault|partition)/.test(value)) return "fault";
  return "active";
}
