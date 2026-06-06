import { useCallback } from 'react';
import { getKeyboardCommand, moveFocus, isEditableElement, type GridStore } from '@zineddinebk09/grid-core';

interface UseGridKeyboardOptions<T> {
  store: { getState: () => GridStore<T> };
  rowCount: number;
  columnCount: number;
  onEdit?: (rowId: string, columnId: string) => void;
}

export function useGridKeyboard<T>({
  store,
  rowCount,
  columnCount,
  onEdit,
}: UseGridKeyboardOptions<T>) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isEditableElement(e.target)) return;

      const state = store.getState();
      const command = getKeyboardCommand(e.key, e.ctrlKey || e.metaKey, e.shiftKey);
      if (!command) return;

      const focused = state.focusedCell ?? { rowIndex: 0, columnIndex: 0 };
      const orderedCols = state.columnOrder.length > 0
        ? state.columnOrder
        : state.columns.map((c) => c.id);

      switch (command) {
        case 'moveUp':
        case 'moveDown':
        case 'moveLeft':
        case 'moveRight':
        case 'pageUp':
        case 'pageDown': {
          e.preventDefault();
          const next = moveFocus(focused, command, rowCount, columnCount);
          state.setFocusedCell(next);
          break;
        }
        case 'selectRow': {
          e.preventDefault();
          const rows = state.data;
          if (focused.rowIndex < rows.length) {
            const rowId = state.getRowId(rows[focused.rowIndex], focused.rowIndex);
            state.toggleRowSelection(rowId);
          }
          break;
        }
        case 'editCell': {
          e.preventDefault();
          if (onEdit && focused.rowIndex < rowCount) {
            const colId = orderedCols[focused.columnIndex];
            const rows = state.data;
            const rowId = state.getRowId(rows[focused.rowIndex], focused.rowIndex);
            onEdit(rowId, colId);
          }
          break;
        }
        case 'cancelEdit':
          state.setEditingCell(null);
          break;
        case 'selectAll':
          e.preventDefault();
          if (state.enableRowSelection) {
            const ids = state.data.map((r, i) => state.getRowId(r, i));
            state.toggleAllRowsSelected(ids);
          }
          break;
      }
    },
    [store, rowCount, columnCount, onEdit],
  );

  return { handleKeyDown };
}
