import { useEffect, useState } from "react";
import { classNames } from "@/lib/format";
import { memberPhoto } from "@/lib/members";
import { useLab } from "@/context/LabContext";
import type { Member } from "@/types";

export function MemberPhoto({
  member,
  className = "member-avatar",
}: {
  member: Pick<Member, "name" | "photo" | "github">;
  className?: string;
}) {
  const { githubStats } = useLab();
  const src = memberPhoto(member, githubStats);
  const [failed, setFailed] = useState(false);
  const missing = !src || failed;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div
      className={classNames(className, missing && "photo-missing")}
      aria-label={missing ? member.name : undefined}
    >
      {src && !failed ? (
        <img src={src} alt={member.name} onError={() => setFailed(true)} />
      ) : null}
    </div>
  );
}
