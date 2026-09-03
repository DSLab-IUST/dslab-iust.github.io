import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Section, SectionHeading } from '@/components/ui/Section';
import { CardSkeletonGrid, EmptyState, ErrorState } from '@/components/ui/States';
import { Tabs } from '@/components/ui/Tabs';
import { ProjectCard } from '@/features/projects/ProjectCard';
import { useContent } from '@/providers/ContentProvider';
import type { ProjectStatus } from '@/types/content';

type Filter = ProjectStatus | 'all';

const FILTERS: Filter[] = ['all', 'active', 'completed', 'archived'];

export function ProjectsSection() {
  const { t } = useTranslation();
  const { status, content } = useContent();
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () =>
      filter === 'all'
        ? content.projects
        : content.projects.filter((project) => project.status === filter),
    [content.projects, filter],
  );

  const countOf = (value: Filter) =>
    value === 'all'
      ? content.projects.length
      : content.projects.filter((project) => project.status === value).length;

  return (
    <Section id="projects" size="sm">
      <SectionHeading
        kicker={t('home.projectsKicker')}
        title={t('projects.title')}
        lede={t('projects.lede')}
      />

      <Tabs
        label={t('projects.title')}
        value={filter}
        onChange={setFilter}
        options={FILTERS.map((value) => ({
          value,
          label: t(`projects.status.${value}`),
          count: countOf(value),
        }))}
      />

      <div className="mt-9">
        {status === 'loading' ? (
          <CardSkeletonGrid />
        ) : status === 'failed' ? (
          <ErrorState message={t('state.loadFailed')} />
        ) : visible.length === 0 ? (
          <EmptyState message={t('projects.empty')} />
        ) : (
          <div className="grid-3">
            {visible.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                members={content.members}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
