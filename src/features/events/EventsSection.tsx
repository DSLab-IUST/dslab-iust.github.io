import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Section, SectionHeading } from '@/components/ui/Section';
import { CardSkeletonGrid, EmptyState, ErrorState } from '@/components/ui/States';
import { Tabs } from '@/components/ui/Tabs';
import { EventCard } from '@/features/events/EventCard';
import { EventDetailModal } from '@/features/events/EventDetailModal';
import { partitionEvents } from '@/features/events/eventPhase';
import { useContent } from '@/providers/ContentProvider';
import type { LabEvent } from '@/types/content';

type Phase = 'upcoming' | 'past';

export function EventsSection() {
  const { t } = useTranslation();
  const { status, content } = useContent();
  const [phase, setPhase] = useState<Phase>('upcoming');
  const [activeEvent, setActiveEvent] = useState<LabEvent | null>(null);

  const partitioned = useMemo(() => partitionEvents(content.events), [content.events]);
  const visible = partitioned[phase];

  return (
    <Section id="events">
      <SectionHeading
        kicker={t('home.upcomingKicker')}
        title={t('events.title')}
        lede={t('events.lede')}
      />

      <Tabs
        label={t('events.title')}
        value={phase}
        onChange={setPhase}
        options={[
          { value: 'upcoming', label: t('events.upcoming'), count: partitioned.upcoming.length },
          { value: 'past', label: t('events.past'), count: partitioned.past.length },
        ]}
      />

      <div className="mt-9">
        {status === 'loading' ? (
          <CardSkeletonGrid />
        ) : status === 'failed' ? (
          <ErrorState message={t('state.loadFailed')} />
        ) : visible.length === 0 ? (
          <EmptyState message={t('events.empty')} />
        ) : (
          <div className="grid-3">
            {visible.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} onOpen={setActiveEvent} />
            ))}
          </div>
        )}
      </div>

      <EventDetailModal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </Section>
  );
}
