import { DeviceFlowError } from '@/lib/github/deviceFlow';
import { GitHubError } from '@/lib/github/errors';

export type AuthErrorCode =
  'notMember' | 'denied' | 'expired' | 'network' | 'invalidToken' | 'noPush' | 'unknown';

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.name = 'AuthError';
    this.code = code;
  }
}

export function toAuthErrorCode(error: unknown): AuthErrorCode {
  if (error instanceof AuthError) return error.code;

  if (error instanceof DeviceFlowError) {
    return error.reason === 'denied' || error.reason === 'expired' ? error.reason : 'network';
  }

  if (error instanceof GitHubError) {
    return error.code === 'unauthorized' ? 'invalidToken' : 'network';
  }

  return 'unknown';
}
