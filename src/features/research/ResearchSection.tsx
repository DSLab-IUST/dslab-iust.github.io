import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Section, SectionHeading } from '@/components/ui/Section';
import { CardSkeletonGrid, EmptyState, ErrorState } from '@/components/ui/States';
import { ResearchCard } from '@/features/research/ResearchCard';
import { useContent } from '@/providers/ContentProvider';

export function ResearchSection() {
  const { t } = useTranslation();
  const { status, content } = useContent();

  const areas = useMemo(
    () => [...content.research].sort((a, b) => a.order - b.order),
    [content.research],
  );

  return (
    <Section id="research" size="sm">
      <SectionHeading
        kicker={t('home.researchKicker')}
        title={t('research.title')}
        lede={t('research.lede')}
      />

      {status === 'loading' ? (
        <CardSkeletonGrid />
      ) : status === 'failed' ? (
        <ErrorState message={t('state.loadFailed')} />
      ) : areas.length === 0 ? (
        <EmptyState message={t('research.empty')} />
      ) : (
        <div className="grid-3">
          {areas.map((area, index) => (
            <ResearchCard key={area.id} area={area} index={index} />
          ))}
        </div>
      )}
    </Section>
  );
}
