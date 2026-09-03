import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@/components/ui/icons';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/providers/AuthProvider';
import type { CollectionItem, CollectionName } from '@/types/content';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { EntityList } from './EntityList';
import { touch } from './factories';
import { useCollectionEditor } from './useCollectionEditor';

interface FormRenderProps<T> {
  initial: T;
  pending: boolean;
  onSubmit: (entity: T) => void;
  onCancel: () => void;
}

interface CollectionManagerProps<K extends CollectionName> {
  collection: K;
  items: CollectionItem<K>[];
  labels: { create: string; edit: string; empty: string };
  labelOf: (item: CollectionItem<K>) => string;
  metaOf: (item: CollectionItem<K>) => ReactNode;
  createEmpty: (login: string) => CollectionItem<K>;
  renderForm: (props: FormRenderProps<CollectionItem<K>>) => ReactNode;
}

type Draft<T> = { mode: 'create' | 'edit'; entity: T } | null;

/**
 * The create / edit / delete shell shared by all four collections. Only the row
 * summary and the form differ, so those arrive as render props.
 */
export function CollectionManager<K extends CollectionName>({
  collection,
  items,
  labels,
  labelOf,
  metaOf,
  createEmpty,
  renderForm,
}: CollectionManagerProps<K>) {
  const { t } = useTranslation();
  const { session } = useAuth();
  const editor = useCollectionEditor(collection);

  const [draft, setDraft] = useState<Draft<CollectionItem<K>>>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const login = session?.login ?? '';
  const deletingItem = items.find((item) => item.id === deletingId) ?? null;

  const submit = async (entity: CollectionItem<K>) => {
    const stamped = touch(entity, login);
    const label = labelOf(stamped);

    const saved =
      draft?.mode === 'create'
        ? await editor.create(stamped, label)
        : await editor.update(stamped, label);

    if (saved) setDraft(null);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    if (await editor.remove(deletingItem.id, labelOf(deletingItem))) setDeletingId(null);
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button
          variant="primary"
          disabled={editor.pending}
          onClick={() => setDraft({ mode: 'create', entity: createEmpty(login) })}
        >
          <PlusIcon />
          {labels.create}
        </Button>
      </div>

      <EntityList
        rows={items.map((item) => ({ id: item.id, title: labelOf(item), meta: metaOf(item) }))}
        emptyMessage={labels.empty}
        disabled={editor.pending}
        onEdit={(id) => {
          const found = items.find((item) => item.id === id);
          if (found) setDraft({ mode: 'edit', entity: found });
        }}
        onDelete={setDeletingId}
      />

      {draft ? (
        <Modal
          open
          wide
          onClose={() => setDraft(null)}
          title={draft.mode === 'create' ? labels.create : labels.edit}
        >
          {renderForm({
            initial: draft.entity,
            pending: editor.pending,
            onSubmit: (entity) => void submit(entity),
            onCancel: () => setDraft(null),
          })}
        </Modal>
      ) : null}

      <ConfirmDeleteDialog
        title={deletingItem ? labelOf(deletingItem) : null}
        pending={editor.pending}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeletingId(null)}
      />

      <p className="sr-only" role="status">
        {editor.pending ? t('admin.saving') : ''}
      </p>
    </>
  );
}
