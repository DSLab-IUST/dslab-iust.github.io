import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import {
  CalendarIcon,
  ExternalLinkIcon,
  MapPinIcon,
  MicIcon,
  UsersIcon,
} from '@/components/ui/icons';
import { Modal } from '@/components/ui/Modal';
import { useLocalized } from '@/hooks/useLocalized';
import { formatDateRange, formatNumber } from '@/lib/format';
import { useLocale } from '@/providers/LocaleProvider';
import type { LabEvent } from '@/types/content';
import { eventPhaseOf } from './eventPhase';

interface EventDetailModalProps {
  event: LabEvent | null;
  onClose: () => void;
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-border flex items-start gap-3 border-b py-3 last:border-b-0">
      <span className="text-text-faint mt-0.5">{icon}</span>
      <span className="text-text-muted text-caption w-24 shrink-0">{label}</span>
      <span className="text-body-sm min-w-0 flex-1 [overflow-wrap:anywhere]">{value}</span>
    </div>
  );
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const localized = useLocalized();

  if (!event) return null;

  const phase = eventPhaseOf(event);

  return (
    <Modal open onClose={onClose} title={localized(event.title)}>
      <div className="cluster-xs mb-6">
        <Badge variant="accent" size="sm">
          {t(`events.kind.${event.kind}`)}
        </Badge>
        {phase === 'live' ? (
          <Badge variant="live" size="sm">
            {t('events.live')}
          </Badge>
        ) : null}
        {event.tags.map((tag) => (
          <Badge key={tag} size="sm">
            {tag}
          </Badge>
        ))}
      </div>

      <p className="prose text-body-sm text-text-secondary whitespace-pre-line">
        {localized(event.description)}
      </p>

      <div className="mt-7">
        <DetailRow
          icon={<CalendarIcon />}
          label={t('form.startsAt')}
          value={formatDateRange(event.startsAt, event.endsAt, locale)}
        />
        {localized(event.location) ? (
          <DetailRow
            icon={<MapPinIcon />}
            label={t('events.location')}
            value={localized(event.location)}
          />
        ) : null}
        {localized(event.speaker) ? (
          <DetailRow
            icon={<MicIcon />}
            label={t('events.speaker')}
            value={localized(event.speaker)}
          />
        ) : null}
        <DetailRow
          icon={<UsersIcon />}
          label={t('events.capacity')}
          value={
            event.capacity > 0
              ? t('events.seats', { seats: formatNumber(event.capacity, locale) })
              : t('events.unlimited')
          }
        />
      </div>

      {event.registrationUrl && phase !== 'past' ? (
        <ButtonLink to={event.registrationUrl} external variant="primary" className="mt-7 w-full">
          {t('actions.register')}
          <ExternalLinkIcon />
        </ButtonLink>
      ) : null}
    </Modal>
  );
}
