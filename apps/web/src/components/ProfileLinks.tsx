import { Icon } from "@/components/icons";
import type { Member } from "@/types";

export function ProfileLinks({
  member,
  mini = false,
  className = "mini-links",
}: {
  member: Member;
  mini?: boolean;
  className?: string;
}) {
  const links = [
    member.homepage
      ? { href: member.homepage, icon: "globe", label: `${member.name} faculty page` }
      : null,
    member.email
      ? { href: `mailto:${member.email}`, icon: "mail", label: `Email ${member.name}` }
      : null,
    member.github
      ? { href: `https://github.com/${encodeURIComponent(member.github)}`, icon: "github", label: `${member.name} on GitHub` }
      : null,
    member.scholar
      ? { href: member.scholar, icon: "scholar", label: `${member.name} on Google Scholar` }
      : null,
    member.linkedin
      ? { href: member.linkedin, icon: "linkedin", label: `${member.name} on LinkedIn` }
      : null,
    member.researchgate
      ? { href: member.researchgate, icon: "researchgate", label: `${member.name} on ResearchGate` }
      : null,
    member.scopus
      ? { href: member.scopus, icon: "scopus", label: `${member.name} on Scopus` }
      : null,
    member.dblp
      ? { href: member.dblp, icon: "dblp", label: `${member.name} on DBLP` }
      : null,
  ].filter(Boolean) as Array<{ href: string; icon: string; label: string }>;

  const shown = mini ? links.filter((link) => ["github", "linkedin", "scholar"].includes(link.icon)).slice(0, 3) : links;

  if (!shown.length && !mini) {
    return <span className="t-mono" style={{ color: "var(--muted)" }}>Add profile links</span>;
  }

  return (
    <div className={className} onClick={(event) => event.stopPropagation()}>
      {shown.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
          aria-label={link.label}
        >
          <Icon name={link.icon} />
        </a>
      ))}
    </div>
  );
}
