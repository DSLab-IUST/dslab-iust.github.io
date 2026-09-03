import { errorCodeForStatus, GitHubError } from './errors';

const API_ORIGIN = 'https://api.github.com';
const API_VERSION = '2022-11-28';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string | undefined;
  body?: unknown;
  signal?: AbortSignal;
}

interface ErrorPayload {
  message?: string;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ErrorPayload;
    return payload.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

/**
 * `api.github.com` sends permissive CORS headers, which is what makes a
 * fully client-side integration possible.
 */
export async function githubRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', token, body, signal } = options;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': API_VERSION,
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(`${API_ORIGIN}${path}`, {
      method,
      headers,
      signal,
      body: body === undefined ? null : JSON.stringify(body),
    });
  } catch (cause) {
    if (signal?.aborted) throw cause;
    throw new GitHubError('network', 0, 'Unable to reach the GitHub API.');
  }

  if (response.status === 204) return undefined as T;

  if (!response.ok) {
    const rateLimited =
      response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0';

    throw new GitHubError(
      rateLimited ? 'rate-limited' : errorCodeForStatus(response.status),
      response.status,
      await readErrorMessage(response),
    );
  }

  return (await response.json()) as T;
}

/** Distinguishes "membership confirmed" (204) from "not a member" (404). */
export async function githubRequestNoContent(
  path: string,
  options: RequestOptions = {},
): Promise<boolean> {
  try {
    await githubRequest<void>(path, options);
    return true;
  } catch (error) {
    if (error instanceof GitHubError && error.code === 'not-found') return false;
    throw error;
  }
}
