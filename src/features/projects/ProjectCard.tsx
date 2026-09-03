import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/Avatar';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardFooter } from '@/components/ui/Card';
import { ExternalLinkIcon, GitHubIcon } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { useLocalized } from '@/hooks/useLocalized';
import { formatShortDate } from '@/lib/format';
import { useLocale } from '@/providers/LocaleProvider';
import type { Member, Project, ProjectStatus } from '@/types/content';

const STATUS_VARIANT: Record<ProjectStatus, BadgeVariant> = {
  active: 'live',
  completed: 'success',
  archived: 'neutral',
};

interface ProjectCardProps {
  project: Project;
  members: Member[];
  index?: number;
}

export function ProjectCard({ project, members, index = 0 }: ProjectCardProps) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const localized = useLocalized();

  const team = members.filter((member) => project.memberIds.includes(member.id));

  return (
    <Reveal index={index} className="h-full">
      <Card interactive className="h-full min-h-[255px]">
        <div className="cluster-xs mb-4">
          <Badge variant={STATUS_VARIANT[project.status]} size="sm">
            {t(`projects.status.${project.status}`)}
          </Badge>
          {project.startedAt ? (
            <span className="text-text-faint text-micro">
              {t('projects.startedAt')} {formatShortDate(project.startedAt, locale)}
            </span>
          ) : null}
        </div>

        <h3 className="text-h4 [overflow-wrap:anywhere]">{localized(project.title)}</h3>

        <p className="text-text-muted text-body-sm mt-3 line-clamp-3">
          {localized(project.summary)}
        </p>

        <div className="cluster-xs mt-4">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        <CardFooter className="mt-6 flex items-center justify-between gap-3">
          {team.length > 0 ? (
            <div className="avatar-stack" aria-label={t('projects.team')}>
              {team.slice(0, 4).map((member) => (
                <Avatar
                  key={member.id}
                  name={localized(member.name)}
                  src={member.avatarUrl}
                  size="xs"
                />
              ))}
            </div>
          ) : (
            <span />
          )}

          <div className="relative z-2 flex gap-1">
            {project.repositoryUrl ? (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={t('actions.openOnGitHub')}
                className="text-text-muted hover:text-accent grid size-9 place-items-center rounded-sm transition-colors duration-(--duration-fast)"
              >
                <GitHubIcon />
              </a>
            ) : null}
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={t('form.demoUrl')}
                className="text-text-muted hover:text-accent grid size-9 place-items-center rounded-sm transition-colors duration-(--duration-fast)"
              >
                <ExternalLinkIcon />
              </a>
            ) : null}
          </div>
        </CardFooter>
      </Card>
    </Reveal>
  );
}
