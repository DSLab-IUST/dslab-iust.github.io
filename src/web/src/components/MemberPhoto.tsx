import { useEffect, useMemo, useState } from "react";
import { classNames } from "@/lib/format";
import { memberAvatarTone, memberInitials, memberPhotoSources } from "@/lib/members";
import { useLab } from "@/context/LabContext";
import type { Member } from "@/types";

type PhotoMember = Pick<Member, "name" | "photo" | "github" | "linkedin" | "leadership" | "linkedinPhoto">;

export function InitialsMark({ name }: { name: string }) {
  return (
    <span className="photo-initials" aria-hidden="true">
      {memberInitials(name)}
    </span>
  );
}

export function useMemberPhoto(member: PhotoMember) {
  const { githubStats } = useLab();
  const sources = useMemo(
    () => memberPhotoSources(member, githubStats),
    [githubStats, member.github, member.leadership, member.linkedin, member.linkedinPhoto, member.photo],
  );
  const sourceKey = sources.join("\n");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [sourceKey]);

  const src = sources[index] || "";
  return {
    src,
    missing: !src,
    onError: () => setIndex((current) => current + 1),
  };
}

export function MemberPhoto({
  member,
  className = "member-avatar",
}: {
  member: PhotoMember;
  className?: string;
}) {
  const { src, missing, onError } = useMemberPhoto(member);

  return (
    <div
      className={classNames(className, missing && "photo-missing")}
      data-tone={missing ? memberAvatarTone(member.name) : undefined}
      aria-label={missing ? member.name : undefined}
    >
      {src ? (
        <img src={src} alt={member.name} referrerPolicy="no-referrer" onError={onError} />
      ) : (
        <InitialsMark name={member.name} />
      )}
    </div>
  );
}
