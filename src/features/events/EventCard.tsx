import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { Card, CardFooter } from '@/components/ui/Card';
import { CalendarIcon, MapPinIcon, MicIcon, UsersIcon } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { useLocalized } from '@/hooks/useLocalized';
import { formatDateRange, formatNumber, formatRelative } from '@/lib/format';
import { useLocale } from '@/providers/LocaleProvider';
import type { LabEvent } from '@/types/content';
import { eventPhaseOf } from './eventPhase';

interface EventCardProps {
  event: LabEvent;
  index?: number;
  onOpen: (event: LabEvent) => void;
}

export function EventCard({ event, index = 0, onOpen }: EventCardProps) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const localized = useLocalized();

  const phase = eventPhaseOf(event);
  const title = localized(event.title);

  return (
    <Reveal index={index} className="h-full">
      <Card interactive className="h-full min-h-[255px]">
        <div className="cluster-xs mb-4">
          <Badge variant="accent" size="sm">
            {t(`events.kind.${event.kind}`)}
          </Badge>
          {phase === 'live' ? (
            <Badge variant="live" size="sm">
              {t('events.live')}
            </Badge>
          ) : null}
          {phase === 'upcoming' ? (
            <span className="text-text-faint text-micro">
              {t('events.startsIn', { when: formatRelative(event.startsAt, locale) })}
            </span>
          ) : null}
        </div>

        <h3 className="text-h4 [overflow-wrap:anywhere]">
          <button
            type="button"
            onClick={() => onOpen(event)}
            className="cursor-pointer text-start after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </button>
        </h3>

        <p className="text-text-muted text-body-sm mt-3 line-clamp-3">
          {localized(event.description)}
        </p>

        <CardFooter className="stack-xs text-text-secondary text-caption mt-6">
          <span className="inline-flex items-center gap-2">
            <CalendarIcon className="text-text-faint" />
            {formatDateRange(event.startsAt, event.endsAt, locale)}
          </span>

          {localized(event.location) ? (
            <span className="inline-flex items-center gap-2">
              <MapPinIcon className="text-text-faint" />
              {localized(event.location)}
            </span>
          ) : null}

          {localized(event.speaker) ? (
            <span className="inline-flex items-center gap-2">
              <MicIcon className="text-text-faint" />
              {localized(event.speaker)}
            </span>
          ) : null}

          <span className="inline-flex items-center gap-2">
            <UsersIcon className="text-text-faint" />
            {event.capacity > 0
              ? t('events.seats', { seats: formatNumber(event.capacity, locale) })
              : t('events.unlimited')}
          </span>
        </CardFooter>
      </Card>
    </Reveal>
  );
}
