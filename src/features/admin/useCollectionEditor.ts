import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/providers/AuthProvider';
import { useContent } from '@/providers/ContentProvider';
import { useToast } from '@/providers/ToastProvider';
import type { CollectionItem, CollectionName, ContentSchema } from '@/types/content';

type Operation = 'create' | 'update' | 'delete';

type Items<K extends CollectionName> = ContentSchema[K];

const COMMIT_VERB: Record<Operation, string> = {
  create: 'add',
  update: 'update',
  delete: 'remove',
};

const COMMIT_TYPE: Record<Operation, string> = {
  create: 'feat',
  update: 'chore',
  delete: 'chore',
};

interface CollectionEditor<K extends CollectionName> {
  pending: boolean;
  create: (item: CollectionItem<K>, label: string) => Promise<boolean>;
  update: (item: CollectionItem<K>, label: string) => Promise<boolean>;
  remove: (id: string, label: string) => Promise<boolean>;
}

/**
 * Turns an edit into a commit on the content repository.
 *
 * Each operation is expressed as a transform over the whole list rather than a
 * positional patch, so the retry inside `commitJson` can replay it against
 * whatever the file looks like after a colleague's concurrent commit.
 */
export function useCollectionEditor<K extends CollectionName>(collection: K): CollectionEditor<K> {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { mutateCollection } = useContent();
  const { notify } = useToast();
  const [pending, setPending] = useState(false);

  const run = useCallback(
    async (
      operation: Operation,
      label: string,
      mutate: (items: Items<K>) => Items<K>,
    ): Promise<boolean> => {
      if (!session) return false;

      setPending(true);
      try {
        const result = await mutateCollection(collection, {
          mutate,
          message: `${COMMIT_TYPE[operation]}(${collection}): ${COMMIT_VERB[operation]} "${label}" (@${session.login})`,
          onRetry: (attempt) =>
            notify({
              message: t('admin.retrying', { attempt: String(attempt) }),
              variant: 'warning',
            }),
        });

        notify({
          message:
            result.attempts > 1
              ? `${t('admin.publishNotice')} ${t('admin.savedWithRetries', { count: result.attempts })}`
              : t('admin.publishNotice'),
          variant: 'success',
          durationMs: 8000,
          action: { label: t('admin.viewCommit'), href: result.url },
        });

        return true;
      } catch (error) {
        notify({
          message: error instanceof Error ? error.message : t('auth.errors.unknown'),
          variant: 'error',
          durationMs: 7000,
        });
        return false;
      } finally {
        setPending(false);
      }
    },
    [collection, mutateCollection, notify, session, t],
  );

  return {
    pending,

    create: (item, label) => run('create', label, (items) => [...items, item] as Items<K>),

    update: (item, label) =>
      run(
        'update',
        label,
        (items) => items.map((existing) => (existing.id === item.id ? item : existing)) as Items<K>,
      ),

    remove: (id, label) =>
      run('delete', label, (items) => items.filter((item) => item.id !== id) as Items<K>),
  };
}
