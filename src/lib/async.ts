const abortReason = (signal: AbortSignal | undefined): Error => {
  const reason: unknown = signal?.reason;
  return reason instanceof Error ? reason : new Error('The operation was aborted.');
};

export const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortReason(signal));
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      reject(abortReason(signal));
    }

    signal?.addEventListener('abort', onAbort, { once: true });
  });

interface BackoffOptions {
  attempt: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

/**
 * Exponential backoff with full jitter, so that two members saving at the same
 * moment do not retry in lockstep and collide again.
 */
export function backoffDelay({ attempt, baseDelayMs, maxDelayMs }: BackoffOptions): number {
  const ceiling = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
  return Math.round(Math.random() * ceiling);
}
