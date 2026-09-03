import { useEffect, useState } from 'react';

/** Remaining whole seconds until `deadline`, ticking once per second. */
export function useCountdown(deadline: number | null): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (deadline === null) return undefined;

    const tick = () => setNow(Date.now());
    // Re-sync immediately: `now` was captured when the component mounted, which
    // may be well before the deadline was known.
    const frame = requestAnimationFrame(tick);
    const timer = window.setInterval(tick, 1000);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, [deadline]);

  return deadline === null ? 0 : Math.max(0, Math.ceil((deadline - now) / 1000));
}

export const formatCountdown = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
