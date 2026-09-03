import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { Badge, DegreeBadge } from '@/components/ui/Badge';
import { Card, LeadCard } from '@/components/ui/Card';
import { GitHubIcon, MailIcon, ScholarIcon } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { useLocalized } from '@/hooks/useLocalized';
import type { Member } from '@/types/content';

interface MemberCardProps {
  member: Member;
  index?: number;
}

function MemberBody({ member }: { member: Member }) {
  const { t } = useTranslation();
  const localized = useLocalized();

  const name = localized(member.name);
  const links = [
    member.githubUsername
      ? { key: 'github', href: `https://github.com/${member.githubUsername}`, icon: <GitHubIcon /> }
      : null,
    member.email ? { key: 'email', href: `mailto:${member.email}`, icon: <MailIcon /> } : null,
    member.scholarUrl ? { key: 'scholar', href: member.scholarUrl, icon: <ScholarIcon /> } : null,
  ].filter((link) => link !== null);

  return (
    <>
      {member.lead ? <span className="lead-badge">{t('members.lead')}</span> : null}

      <Avatar name={name} src={member.avatarUrl} size="lg" />

      <h3 className="text-h4 mt-4 [overflow-wrap:anywhere]">{name}</h3>
      <p className="text-accent text-caption mt-1">{localized(member.role)}</p>

      {localized(member.bio) ? (
        <p className="text-text-muted text-body-sm mt-3 line-clamp-3">{localized(member.bio)}</p>
      ) : null}

      <div className="cluster-xs mt-4">
        <DegreeBadge degree={member.degree} label={t(`members.degree.${member.degree}`)} />
        {member.interests.slice(0, 2).map((interest) => (
          <Badge key={interest} size="sm">
            {interest}
          </Badge>
        ))}
      </div>

      {links.length > 0 ? (
        <div className="border-border mt-auto flex gap-1 border-t pt-4">
          {links.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${name} — ${link.key}`}
              className="text-text-muted hover:text-accent hover:bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] relative z-2 grid size-9 place-items-center rounded-sm transition-colors duration-(--duration-fast)"
            >
              {link.icon}
            </a>
          ))}
        </div>
      ) : null}
    </>
  );
}

export function MemberCard({ member, index = 0 }: MemberCardProps) {
  const Wrapper = member.lead ? LeadCard : Card;

  return (
    <Reveal index={index} className="h-full">
      <Wrapper interactive className="h-full min-h-[240px]">
        <MemberBody member={member} />
      </Wrapper>
    </Reveal>
  );
}
