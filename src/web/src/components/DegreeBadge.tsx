import { resolveDegree } from "@/lib/members";
import type { Member } from "@/types";

export function DegreeBadge({ member }: { member: Member }) {
  const degree = resolveDegree(member);
  if (!degree) return null;

  return (
    <span className={`degree-badge ${degree.className}`} title={degree.label} aria-label={degree.label}>
      <span className="degree-stars" aria-hidden="true">{"★".repeat(degree.stars)}</span>
      <span className="degree-code">{degree.code}</span>
    </span>
  );
}
