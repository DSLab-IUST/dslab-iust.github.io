import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { siteConfig } from '@/config/site';
import { commitJson, type CommitResult } from '@/lib/github/contents';
import type { CollectionName, ContentSchema } from '@/types/content';
import { useAuth } from './AuthProvider';

type LoadStatus = 'loading' | 'ready' | 'failed';

interface MutateOptions<K extends CollectionName> {
  /** Pure transform replayed against the latest remote file on every retry. */
  mutate: (items: ContentSchema[K]) => ContentSchema[K];
  message: string;
  onRetry?: (attempt: number) => void;
}

interface ContentContextValue {
  status: LoadStatus;
  content: ContentSchema;
  reload: () => void;
  mutateCollection: <K extends CollectionName>(
    collection: K,
    options: MutateOptions<K>,
  ) => Promise<CommitResult>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

const EMPTY_CONTENT: ContentSchema = { events: [], members: [], projects: [], research: [] };

const collectionUrl = (name: CollectionName): string =>
  `/${siteConfig.repository.dataDirectory}/${name}.json`;

async function fetchCollection<K extends CollectionName>(
  name: K,
  signal: AbortSignal,
): Promise<ContentSchema[K]> {
  const response = await fetch(collectionUrl(name), { signal, cache: 'no-cache' });
  if (!response.ok) throw new Error(`Failed to load ${name}.json (${response.status}).`);

  return (await response.json()) as ContentSchema[K];
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [content, setContent] = useState<ContentSchema>(EMPTY_CONTENT);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetchCollection('events', controller.signal),
      fetchCollection('members', controller.signal),
      fetchCollection('projects', controller.signal),
      fetchCollection('research', controller.signal),
    ])
      .then(([events, members, projects, research]) => {
        setContent({ events, members, projects, research });
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setStatus('failed');
        if (import.meta.env.DEV) console.error(error);
      });

    return () => controller.abort();
  }, [revision]);

  const reload = useCallback(() => {
    setStatus('loading');
    setRevision((value) => value + 1);
  }, []);

  /**
   * Commits the change to the repository first; the in-memory copy is only
   * updated once GitHub accepted it, so the UI never claims a save that the
   * repository rejected.
   */
  const mutateCollection = useCallback<ContentContextValue['mutateCollection']>(
    async (collection, { mutate, message, onRetry }) => {
      if (!session) throw new Error('A session is required to modify content.');

      const result = await commitJson<ContentSchema[typeof collection]>({
        name: collection,
        token: session.token,
        message,
        mutate,
        ...(onRetry ? { onRetry } : {}),
      });

      setContent((current) => ({ ...current, [collection]: mutate(current[collection]) }));
      return result;
    },
    [session],
  );

  const value = useMemo(
    () => ({ status, content, reload, mutateCollection }),
    [status, content, reload, mutateCollection],
  );

  return <ContentContext value={value}>{children}</ContentContext>;
}

export function useContent(): ContentContextValue {
  const context = use(ContentContext);
  if (!context) throw new Error('useContent must be used inside <ContentProvider>.');
  return context;
}
