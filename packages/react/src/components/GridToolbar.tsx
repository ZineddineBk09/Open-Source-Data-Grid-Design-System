import { useSyncExternalStore } from 'react';
import type { GridStore, Density } from '@zineddinebk/grid-core';
import { downloadCsv, exportToCsv, getSelectedRows } from '@zineddinebk/grid-core';
import { ColumnFilterBar } from './ColumnFilterBar';

interface GridToolbarProps<T> {
  store: { getState: () => GridStore<T>; subscribe: (fn: () => void) => () => void };
  className?: string;
  showExport?: boolean;
  showGlobalFilter?: boolean;
  showColumnFilters?: boolean;
  showDensity?: boolean;
  showUndoRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function GridToolbar<T>({
  store,
  className = '',
  showExport = true,
  showGlobalFilter = true,
  showColumnFilters = true,
  showDensity = true,
  showUndoRedo = true,
  onUndo,
  onRedo,
}: GridToolbarProps<T>) {
  const state = useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.getState(),
    () => store.getState(),
  );
  const canUndo = state.editHistory.past.length > 0;
  const canRedo = state.editHistory.future.length > 0;

  return (
    <div className={`osdg-toolbar-wrap ${className}`}>
      <div className="osdg-toolbar" role="toolbar" aria-label="Grid toolbar">
        {showGlobalFilter && state.enableGlobalFilter && (
          <input
            type="search"
            className="osdg-input"
            placeholder="Search all columns..."
            value={state.globalFilter}
            onChange={(e) => state.setGlobalFilter(e.target.value)}
            aria-label="Global search"
          />
        )}

        <div style={{ flex: 1 }} />

        {showUndoRedo && (
          <>
            <button
              type="button"
              className="osdg-btn"
              disabled={!canUndo}
              onClick={onUndo}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              ↶ Undo
            </button>
            <button
              type="button"
              className="osdg-btn"
              disabled={!canRedo}
              onClick={onRedo}
              title="Redo (Ctrl+Shift+Z)"
              aria-label="Redo"
            >
              ↷ Redo
            </button>
          </>
        )}

        {showDensity && (
          <select
            className="osdg-input"
            value={state.density}
            onChange={(e) => state.setDensity(e.target.value as Density)}
            aria-label="Row density"
          >
            <option value="compact">Compact</option>
            <option value="default">Default</option>
            <option value="comfortable">Comfortable</option>
          </select>
        )}

        {showExport && (
          <button
            type="button"
            className="osdg-btn osdg-btn--primary"
            onClick={() => {
              const s = store.getState();
              const selected = getSelectedRows(s);
              const rows = selected.length > 0 ? selected : s.data;
              const csv = exportToCsv(rows, s.columns);
              downloadCsv(csv, 'grid-export.csv');
            }}
          >
            Export CSV
          </button>
        )}
      </div>

      {showColumnFilters && (
        <ColumnFilterBar store={store} columns={state.columns} />
      )}
    </div>
  );
}
