export type GitHubErrorCode =
  'unauthorized' | 'forbidden' | 'not-found' | 'conflict' | 'rate-limited' | 'network' | 'unknown';

export class GitHubError extends Error {
  readonly code: GitHubErrorCode;
  readonly status: number;

  constructor(code: GitHubErrorCode, status: number, message: string) {
    super(message);
    this.name = 'GitHubError';
    this.code = code;
    this.status = status;
  }

  /** A conflicting write is expected under concurrency and worth retrying. */
  get isRetryable(): boolean {
    return this.code === 'conflict' || this.code === 'network';
  }
}

export function errorCodeForStatus(status: number): GitHubErrorCode {
  switch (status) {
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 404:
      return 'not-found';
    case 409:
    case 412:
    case 422:
      return 'conflict';
    default:
      return status >= 500 ? 'network' : 'unknown';
  }
}
