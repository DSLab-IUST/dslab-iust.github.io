import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AuthError } from '@/features/auth/errors';
import { clearSession, persistSession, readSession, type Session } from '@/features/auth/session';
import { canPushToRepository, fetchViewer, isOrganizationMember } from '@/lib/github/identity';

type AuthStatus = 'restoring' | 'anonymous' | 'authenticated';

interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  /** Signs in with an already-issued token, whatever flow produced it. */
  signIn: (token: string) => Promise<Session>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Turns a raw token into a session, refusing anyone outside the organization.
 * The token is discarded on rejection so it never reaches storage.
 */
async function establishSession(token: string, signal?: AbortSignal): Promise<Session> {
  const viewer = await fetchViewer(token, signal);

  if (!(await isOrganizationMember(token, viewer.login, signal))) {
    throw new AuthError('notMember');
  }

  return {
    token,
    login: viewer.login,
    name: viewer.name,
    avatarUrl: viewer.avatarUrl,
    profileUrl: viewer.profileUrl,
    canWrite: await canPushToRepository(token, signal),
    issuedAt: Date.now(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Read once at mount: the cookie decides whether there is anything to restore.
  const [storedSession] = useState(readSession);
  const [status, setStatus] = useState<AuthStatus>(storedSession ? 'restoring' : 'anonymous');
  const [session, setSession] = useState<Session | null>(null);

  // A cookie outlives the token inside it; confirm the token still works and
  // that the member is still in the organization before trusting the session.
  useEffect(() => {
    if (!storedSession) return undefined;

    const controller = new AbortController();

    establishSession(storedSession.token, controller.signal)
      .then((refreshed) => {
        persistSession(refreshed);
        setSession(refreshed);
        setStatus('authenticated');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        clearSession();
        setSession(null);
        setStatus('anonymous');
        if (import.meta.env.DEV) console.warn('Session restore failed:', error);
      });

    return () => controller.abort();
  }, [storedSession]);

  const signIn = useCallback(async (token: string) => {
    const established = await establishSession(token);
    persistSession(established);
    setSession(established);
    setStatus('authenticated');
    return established;
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo(
    () => ({ status, session, signIn, signOut }),
    [status, session, signIn, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const context = use(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>.');
  return context;
}
