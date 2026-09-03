import { useTranslation } from 'react-i18next';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowIcon } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { EventsSection } from '@/features/events/EventsSection';
import { MembersSection } from '@/features/members/MembersSection';
import { ProjectsSection } from '@/features/projects/ProjectsSection';
import { ResearchSection } from '@/features/research/ResearchSection';
import { formatNumber } from '@/lib/format';
import { useContent } from '@/providers/ContentProvider';
import { useLocale } from '@/providers/LocaleProvider';

function Hero() {
  const { t } = useTranslation();

  return (
    <section id="home" className="container pt-16 pb-8 lg:pt-24">
      <Reveal className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <p className="kicker">{t('home.kicker')}</p>

          <h1 className="text-display display mt-5 [overflow-wrap:anywhere]">
            {t('home.heroTitleLead')}{' '}
            <span className="accent-word">{t('home.heroTitleAccent')}</span>{' '}
            {t('home.heroTitleTrail')}
          </h1>

          <p className="lede mt-6">{t('home.heroLede')}</p>

          <div className="cluster mt-9">
            <ButtonLink to="/#research" variant="primary" size="lg">
              {t('home.exploreResearch')}
              <ArrowIcon className="flip-inline" />
            </ButtonLink>
            <ButtonLink to="/#events" variant="secondary" size="lg">
              {t('home.seeEvents')}
            </ButtonLink>
          </div>
        </div>

        <div
          className="hero-atmosphere border-border relative hidden aspect-square rounded-2xl border lg:block"
          aria-hidden="true"
        >
          <span className="border-border-accent absolute inset-[14%] rounded-full border" />
          <span className="border-border absolute inset-[28%] rounded-full border" />
          <span className="bg-accent absolute top-[14%] left-1/2 size-3 -translate-x-1/2 rounded-full" />
          <span className="bg-accent-400 absolute top-1/2 left-[14%] size-3 -translate-y-1/2 rounded-full" />
          <span className="bg-gold absolute top-1/2 right-[14%] size-3 -translate-y-1/2 rounded-full" />
          <span className="pulse-dot absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </Reveal>
    </section>
  );
}

function Stats() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { content } = useContent();

  const thisYear = new Date().getFullYear();

  const stats = [
    { key: 'members', value: content.members.length },
    { key: 'projects', value: content.projects.filter((p) => p.status === 'active').length },
    { key: 'research', value: content.research.length },
    {
      key: 'events',
      value: content.events.filter((e) => new Date(e.startsAt).getFullYear() === thisYear).length,
    },
  ] as const;

  return (
    <div className="container">
      <div className="grid-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.key} index={index}>
            <div className="panel px-6 py-7">
              <p className="metric text-h2">{formatNumber(stat.value, locale)}</p>
              <p className="text-text-muted text-caption mt-1">{t(`home.stats.${stat.key}`)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <EventsSection />
      <ResearchSection />
      <ProjectsSection />
      <MembersSection />
    </>
  );
}
