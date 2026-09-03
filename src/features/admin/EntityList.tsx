import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { PencilIcon, TrashIcon } from '@/components/ui/icons';
import { EmptyState } from '@/components/ui/States';

export interface EntityRow {
  id: string;
  title: string;
  meta: ReactNode;
}

interface EntityListProps {
  rows: EntityRow[];
  emptyMessage: string;
  disabled: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EntityList({ rows, emptyMessage, disabled, onEdit, onDelete }: EntityListProps) {
  const { t } = useTranslation();

  if (rows.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <ul className="stack-xs">
      {rows.map((row) => (
        <li
          key={row.id}
          className="panel flex flex-wrap items-center justify-between gap-4 px-5 py-4"
        >
          <div className="min-w-0 flex-1">
            <p className="text-h5 truncate">{row.title}</p>
            <div className="text-text-muted text-caption cluster-xs mt-1">{row.meta}</div>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => onEdit(row.id)}
              aria-label={`${t('actions.edit')} — ${row.title}`}
            >
              <PencilIcon />
              <span className="max-sm:sr-only">{t('actions.edit')}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => onDelete(row.id)}
              aria-label={`${t('actions.delete')} — ${row.title}`}
              className="text-error-fg"
            >
              <TrashIcon />
              <span className="max-sm:sr-only">{t('actions.delete')}</span>
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
