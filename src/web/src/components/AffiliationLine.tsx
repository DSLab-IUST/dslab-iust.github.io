import { Icon } from "@/components/icons";
import { classNames } from "@/lib/format";
import { memberNowLine } from "@/lib/members";
import type { Member } from "@/types";

export function AffiliationLine({
  member,
  className,
}: {
  member: Member;
  className?: string;
}) {
  const now = memberNowLine(member);
  if (!now && !member.location) return null;

  return (
    <div className={classNames("affiliation-line", className)}>
      {now ? <span className="affiliation-now">{now}</span> : null}
      {member.location ? (
        <span className="affiliation-location">
          <Icon name="map-pin" />
          {member.location}
        </span>
      ) : null}
    </div>
  );
}
