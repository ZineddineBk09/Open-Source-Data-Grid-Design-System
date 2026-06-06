import { useSyncExternalStore } from 'react';
import type { ColumnDef, FilterOperator, GridStore } from '@zineddinebk/grid-core';

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Equals' },
  { value: 'gt', label: 'Greater than' },
  { value: 'lt', label: 'Less than' },
  { value: 'gte', label: '≥' },
  { value: 'lte', label: '≤' },
];

interface ColumnFilterBarProps<T> {
  store: { getState: () => GridStore<T>; subscribe: (fn: () => void) => () => void };
  columns: ColumnDef<T>[];
}

export function ColumnFilterBar<T>({ store, columns }: ColumnFilterBarProps<T>) {
  const state = useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.getState(),
    () => store.getState(),
  );
  const filterable = columns.filter((c) => c.enableFiltering !== false);

  if (filterable.length === 0) return null;

  return (
    <div className="osdg-filter-bar" role="group" aria-label="Column filters">
      {filterable.map((column) => {
        const existing = state.columnFilters.find((f) => f.id === column.id);
        const operator = existing?.operator ?? 'contains';
        const value = existing?.value ?? '';

        return (
          <label key={column.id} className="osdg-filter-item">
            <span className="osdg-filter-label">{column.header}</span>
            <select
              className="osdg-input osdg-filter-operator"
              value={operator}
              onChange={(e) =>
                state.setColumnFilter(column.id, e.target.value as FilterOperator, value)
              }
              aria-label={`${column.header} filter operator`}
            >
              {OPERATORS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
            <input
              className="osdg-input osdg-filter-value"
              type="text"
              value={String(value ?? '')}
              placeholder={`Filter ${column.header}...`}
              onChange={(e) =>
                state.setColumnFilter(column.id, operator, e.target.value)
              }
              aria-label={`Filter ${column.header}`}
            />
          </label>
        );
      })}
      {state.columnFilters.length > 0 && (
        <button
          type="button"
          className="osdg-btn"
          onClick={() => state.setColumnFilters([])}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
