import { siteConfig } from '@/config/site';
import { backoffDelay, sleep } from '@/lib/async';
import { decodeBase64, encodeBase64 } from './base64';
import { githubRequest } from './client';
import { GitHubError } from './errors';

const { repository, commit } = siteConfig;

interface ContentsResponse {
  content: string;
  sha: string;
}

interface CommitResponse {
  commit: { sha: string; html_url: string };
}

export interface CommitResult {
  sha: string;
  url: string;
  /** How many times the write had to be replayed against fresher content. */
  attempts: number;
}

const filePath = (name: string): string => `${repository.dataDirectory}/${name}.json`;

const contentsUrl = (name: string): string =>
  `/repos/${repository.owner}/${repository.name}/contents/${encodeURIComponent(filePath(name))}`;

/** Trailing newline keeps the file diff-friendly for hand edits. */
const serialize = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

interface RemoteFile<T> {
  data: T;
  sha: string;
}

async function readRemote<T>(
  name: string,
  token: string,
  signal?: AbortSignal,
): Promise<RemoteFile<T>> {
  const response = await githubRequest<ContentsResponse>(
    `${contentsUrl(name)}?ref=${encodeURIComponent(repository.branch)}`,
    { token, signal },
  );

  return { data: JSON.parse(decodeBase64(response.content)) as T, sha: response.sha };
}

export interface CommitOptions<T> {
  /** File base name inside the data directory, e.g. `events`. */
  name: string;
  token: string;
  message: string;
  /**
   * Pure transform applied to the *latest* remote content. It is re-run from
   * scratch on every retry, so a concurrent commit is merged rather than
   * clobbered by a stale snapshot.
   */
  mutate: (current: T) => T;
  signal?: AbortSignal;
  onRetry?: (attempt: number) => void;
}

/**
 * Read-modify-write against the Contents API with a bounded retry policy.
 *
 * GitHub rejects a `PUT` whose `sha` no longer matches HEAD, which is exactly
 * the signal that somebody else committed in between. Rather than forcing the
 * write, the cycle restarts: fetch the new content, replay `mutate`, commit
 * again — after an exponentially backed-off, jittered pause.
 */
export async function commitJson<T>({
  name,
  token,
  message,
  mutate,
  signal,
  onRetry,
}: CommitOptions<T>): Promise<CommitResult> {
  let lastError: unknown;

  for (let attempt = 0; attempt < commit.maxAttempts; attempt += 1) {
    if (attempt > 0) {
      onRetry?.(attempt);
      await sleep(
        backoffDelay({ attempt, baseDelayMs: commit.baseDelayMs, maxDelayMs: commit.maxDelayMs }),
        signal,
      );
    }

    try {
      const { data, sha } = await readRemote<T>(name, token, signal);

      const response = await githubRequest<CommitResponse>(contentsUrl(name), {
        method: 'PUT',
        token,
        signal,
        body: {
          message,
          content: encodeBase64(serialize(mutate(data))),
          sha,
          branch: repository.branch,
        },
      });

      return { sha: response.commit.sha, url: response.commit.html_url, attempts: attempt + 1 };
    } catch (error) {
      lastError = error;
      if (!(error instanceof GitHubError) || !error.isRetryable) throw error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new GitHubError('conflict', 409, 'Exhausted commit retries.');
}
