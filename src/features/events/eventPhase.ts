import type { LabEvent } from '@/types/content';

export type EventPhase = 'upcoming' | 'live' | 'past';

/** Falls back to a two-hour window when an event declares no end time. */
const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

export function eventPhaseOf(event: LabEvent, now = Date.now()): EventPhase {
  const start = new Date(event.startsAt).getTime();
  const end = event.endsAt ? new Date(event.endsAt).getTime() : start + DEFAULT_DURATION_MS;

  if (now < start) return 'upcoming';
  return now <= end ? 'live' : 'past';
}

export const isPast = (event: LabEvent, now = Date.now()): boolean =>
  eventPhaseOf(event, now) === 'past';

const byStartAscending = (a: LabEvent, b: LabEvent): number =>
  new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

export interface PartitionedEvents {
  upcoming: LabEvent[];
  past: LabEvent[];
}

/** Upcoming reads soonest-first; past reads most-recent-first. */
export function partitionEvents(events: LabEvent[], now = Date.now()): PartitionedEvents {
  const upcoming: LabEvent[] = [];
  const past: LabEvent[] = [];

  for (const event of events) {
    (isPast(event, now) ? past : upcoming).push(event);
  }

  return {
    upcoming: upcoming.sort(byStartAscending),
    past: past.sort((a, b) => byStartAscending(b, a)),
  };
}
