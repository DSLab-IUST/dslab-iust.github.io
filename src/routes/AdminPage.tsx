import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { AlertIcon } from '@/components/ui/icons';
import { PageHeader } from '@/components/ui/Section';
import { CardSkeletonGrid, ErrorState } from '@/components/ui/States';
import { Tabs } from '@/components/ui/Tabs';
import { CollectionManager } from '@/features/admin/CollectionManager';
import { EventForm } from '@/features/admin/EventForm';
import {
  createEmptyEvent,
  createEmptyMember,
  createEmptyProject,
  createEmptyResearch,
} from '@/features/admin/factories';
import { MemberForm } from '@/features/admin/MemberForm';
import { ProjectForm } from '@/features/admin/ProjectForm';
import { ResearchForm } from '@/features/admin/ResearchForm';
import { eventPhaseOf } from '@/features/events/eventPhase';
import { useLocalized } from '@/hooks/useLocalized';
import { formatShortDate } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { useContent } from '@/providers/ContentProvider';
import { useLocale } from '@/providers/LocaleProvider';
import type { CollectionName } from '@/types/content';

const TABS: CollectionName[] = ['events', 'members', 'projects', 'research'];

export function AdminPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { session } = useAuth();
  const { status, content } = useContent();
  const localized = useLocalized();

  const [tab, setTab] = useState<CollectionName>('events');

  if (status === 'loading') {
    return (
      <div className="container py-24">
        <CardSkeletonGrid count={3} />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container py-24">
        <ErrorState message={t('state.loadFailed')} />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        kicker={t('nav.admin')}
        title={t('admin.title')}
        lede={t('admin.lede')}
        action={
          session ? (
            <Badge variant="accent" size="lg">
              {t('auth.signedInAs', { name: session.login })}
            </Badge>
          ) : null
        }
      />

      <div className="container pb-[var(--space-section-sm)]">
        {session && !session.canWrite ? (
          <p
            role="alert"
            className="text-warning-fg text-body-sm border-[var(--color-warning-border)] bg-[var(--color-warning-muted)] mb-6 flex items-start gap-3 rounded-md border p-4"
          >
            <AlertIcon className="mt-0.5 shrink-0" />
            {t('auth.errors.noPush')}
          </p>
        ) : null}

        <Tabs
          label={t('admin.title')}
          value={tab}
          onChange={setTab}
          options={TABS.map((name) => ({
            value: name,
            label: t(`admin.tabs.${name}`),
            count: content[name].length,
          }))}
        />

        <div className="mt-9">
          {tab === 'events' ? (
            <CollectionManager
              collection="events"
              items={content.events}
              labels={{
                create: t('admin.newEvent'),
                edit: t('admin.editEvent'),
                empty: t('events.empty'),
              }}
              labelOf={(event) => localized(event.title)}
              metaOf={(event) => (
                <>
                  <Badge size="sm">{t(`events.kind.${event.kind}`)}</Badge>
                  <span>{formatShortDate(event.startsAt, locale)}</span>
                  <span>{t(`events.${eventPhaseOf(event) === 'past' ? 'past' : 'upcoming'}`)}</span>
                </>
              )}
              createEmpty={createEmptyEvent}
              renderForm={(props) => <EventForm {...props} />}
            />
          ) : null}

          {tab === 'members' ? (
            <CollectionManager
              collection="members"
              items={content.members}
              labels={{
                create: t('admin.newMember'),
                edit: t('admin.editMember'),
                empty: t('members.empty'),
              }}
              labelOf={(member) => localized(member.name)}
              metaOf={(member) => (
                <>
                  <Badge size="sm">{t(`members.degree.${member.degree}`)}</Badge>
                  <span>{localized(member.role)}</span>
                  {member.lead ? (
                    <Badge variant="gold" size="sm">
                      {t('members.lead')}
                    </Badge>
                  ) : null}
                </>
              )}
              createEmpty={createEmptyMember}
              renderForm={(props) => <MemberForm {...props} />}
            />
          ) : null}

          {tab === 'projects' ? (
            <CollectionManager
              collection="projects"
              items={content.projects}
              labels={{
                create: t('admin.newProject'),
                edit: t('admin.editProject'),
                empty: t('projects.empty'),
              }}
              labelOf={(project) => localized(project.title)}
              metaOf={(project) => (
                <>
                  <Badge size="sm">{t(`projects.status.${project.status}`)}</Badge>
                  <span>{project.tags.join('، ')}</span>
                </>
              )}
              createEmpty={createEmptyProject}
              renderForm={(props) => <ProjectForm {...props} members={content.members} />}
            />
          ) : null}

          {tab === 'research' ? (
            <CollectionManager
              collection="research"
              items={content.research}
              labels={{
                create: t('admin.newResearch'),
                edit: t('admin.editResearch'),
                empty: t('research.empty'),
              }}
              labelOf={(area) => localized(area.title)}
              metaOf={(area) => (
                <>
                  <span aria-hidden="true">{area.glyph}</span>
                  <span>{area.tags.join('، ')}</span>
                </>
              )}
              createEmpty={(login) => createEmptyResearch(login, content.research.length)}
              renderForm={(props) => <ResearchForm {...props} />}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
