import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Section, SectionHeading } from '@/components/ui/Section';
import { CardSkeletonGrid, EmptyState, ErrorState } from '@/components/ui/States';
import { Tabs } from '@/components/ui/Tabs';
import { MemberCard } from '@/features/members/MemberCard';
import { useContent } from '@/providers/ContentProvider';
import type { MemberDegree } from '@/types/content';

type Filter = MemberDegree | 'all';

const FILTERS: Filter[] = ['all', 'faculty', 'phd', 'msc', 'bsc'];

/** Leads first, then by degree seniority, so the roster reads top-down. */
const DEGREE_ORDER: Record<MemberDegree, number> = { faculty: 0, phd: 1, msc: 2, bsc: 3 };

export function MembersSection() {
  const { t } = useTranslation();
  const { status, content } = useContent();
  const [filter, setFilter] = useState<Filter>('all');

  const sorted = useMemo(
    () =>
      [...content.members].sort(
        (a, b) =>
          Number(b.lead) - Number(a.lead) || DEGREE_ORDER[a.degree] - DEGREE_ORDER[b.degree],
      ),
    [content.members],
  );

  const visible = useMemo(
    () => (filter === 'all' ? sorted : sorted.filter((member) => member.degree === filter)),
    [sorted, filter],
  );

  const countOf = (value: Filter) =>
    value === 'all'
      ? content.members.length
      : content.members.filter((member) => member.degree === value).length;

  return (
    <Section id="members" size="sm">
      <SectionHeading
        kicker={t('home.leadsKicker')}
        title={t('members.title')}
        lede={t('members.lede')}
      />

      <Tabs
        label={t('members.title')}
        value={filter}
        onChange={setFilter}
        options={FILTERS.map((value) => ({
          value,
          label: t(`members.degree.${value}`),
          count: countOf(value),
        }))}
      />

      <div className="mt-9">
        {status === 'loading' ? (
          <CardSkeletonGrid />
        ) : status === 'failed' ? (
          <ErrorState message={t('state.loadFailed')} />
        ) : visible.length === 0 ? (
          <EmptyState message={t('members.empty')} />
        ) : (
          <div className="grid-3">
            {visible.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
