import { useState } from "react";
import { Icon } from "@/components/icons";
import { useLab } from "@/context/LabContext";
import { classNames } from "@/lib/format";
import { memberPhoto, resolveTeam } from "@/lib/members";
import type { Member } from "@/types";

function StackAvatar({ member }: { member: Member }) {
  const { githubStats, openMember } = useLab();
  const src = memberPhoto(member, githubStats);
  const [failed, setFailed] = useState(false);
  const missing = !src || failed;

  return (
    <button
      className={classNames("stack-avatar", missing && "photo-missing")}
      type="button"
      title={member.name}
      aria-label={`Open ${member.name} profile`}
      onClick={() => openMember(member)}
    >
      {src && !failed ? <img src={src} alt="" onError={() => setFailed(true)} /> : null}
    </button>
  );
}

export function WorkTeam({ memberRefs = [], compact = false }: { memberRefs?: string[]; compact?: boolean }) {
  const { members } = useLab();
  const team = resolveTeam(members, memberRefs);

  if (!team.length) {
    return (
      <div className="work-team-empty">
        <Icon name="users" />
        <span>Add member names in current-work.json or projects.json</span>
      </div>
    );
  }

  const visible = team.slice(0, compact ? 5 : 7);
  const extra = Math.max(0, team.length - visible.length);
  const names = team.map((member) => member.name).join(", ");

  return (
    <div className="work-team">
      <div className="avatar-stack" aria-label={`Team: ${names}`}>
        {visible.map((member) => (
          <StackAvatar key={member.name} member={member} />
        ))}
        {extra ? <span className="stack-avatar stack-extra">+{extra}</span> : null}
      </div>
      <div className="team-copy">
        <span>{team.length === 1 ? "Researcher" : `${team.length} researchers`}</span>
        <strong>
          {team.slice(0, 3).map((member) => member.name).join(", ")}
          {team.length > 3 ? `, +${team.length - 3}` : ""}
        </strong>
      </div>
    </div>
  );
}

export function WorkTags({ tags = [], limit = 4 }: { tags?: string[]; limit?: number }) {
  return (
    <div className="work-tags">
      {tags.slice(0, limit).map((tag) => <span key={tag}>{tag}</span>)}
    </div>
  );
}
