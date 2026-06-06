import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  getCellValue,
  getColumnSize,
  toggleSelectionRange,
  themeToCssVars,
  defaultDarkTheme,
  isEditableElement,
  type ColumnDef,
  type GridOptions,
  type GridTheme,
  type RowModel,
} from '@zineddinebk09/grid-core';
import { useDataGrid } from '../hooks/useDataGrid';
import { useColumnResize } from '../hooks/useColumnResize';
import { useGridKeyboard } from '../hooks/useGridKeyboard';
import { GridToolbar } from './GridToolbar';
import { GridPagination } from './GridPagination';

export interface DataGridProps<T> extends GridOptions<T> {
  className?: string;
  dark?: boolean;
  theme?: GridTheme;
  height?: number | string;
  showToolbar?: boolean;
  showPagination?: boolean;
  showColumnFilters?: boolean;
  isLoading?: boolean;
  store?: import('@zineddinebk09/grid-core').GridStoreInstance<T>;
  toolbar?: ReactNode;
  onCellEdit?: (rowId: string, columnId: string, value: unknown) => void;
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;
}

function SortIndicator({ direction }: { direction: 'asc' | 'desc' | false }) {
  if (!direction) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
  return <span style={{ marginLeft: 4 }}>{direction === 'asc' ? '↑' : '↓'}</span>;
}

interface HeaderCellProps<T> {
  column: ColumnDef<T>;
  width: number;
  sortDirection: 'asc' | 'desc' | false;
  onSort: () => void;
  onResize: (e: React.MouseEvent) => void;
  enableResizing: boolean;
  pinClass?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

function HeaderCell<T>({
  column,
  width,
  sortDirection,
  onSort,
  store,
  enableResizing,
  pinClass = '',
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}: Omit<HeaderCellProps<T>, 'onResize'> & { store: { getState: () => import('@zineddinebk09/grid-core').GridStore<T> } }) {
  const { onMouseDown } = useColumnResize({
    columnId: column.id,
    store: store as { getState: () => import('@zineddinebk09/grid-core').GridStore<unknown> },
    minSize: column.minSize,
    maxSize: column.maxSize,
  });

  return (
    <HeaderCellInner
      column={column}
      width={width}
      sortDirection={sortDirection}
      onSort={onSort}
      onResize={onMouseDown}
      enableResizing={enableResizing}
      pinClass={pinClass}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    />
  );
}
function HeaderCellInner<T>({
  column,
  width,
  sortDirection,
  onSort,
  onResize,
  enableResizing,
  pinClass = '',
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}: HeaderCellProps<T>) {
  const sortable = column.enableSorting !== false;

  return (
    <th
      className={`osdg-header-cell ${sortable ? 'osdg-header-cell--sortable' : ''} ${pinClass}`}
      style={{ width, minWidth: width, maxWidth: width }}
      onClick={sortable ? onSort : undefined}
      aria-sort={
        sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none'
      }
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {column.header}
      {sortable && <SortIndicator direction={sortDirection} />}
      {enableResizing && column.enableResizing !== false && (
        <div
          className="osdg-resize-handle"
          onMouseDown={onResize}
          onClick={(e) => e.stopPropagation()}
          role="separator"
          aria-orientation="vertical"
        />
      )}
    </th>
  );
}

interface CellEditorProps<T> {
  row: T;
  column: ColumnDef<T>;
  value: unknown;
  onCommit: (value: unknown) => void;
  onCancel: () => void;
}

function DefaultCellEditor<T>({ value, onCommit, onCancel }: CellEditorProps<T>) {
  const [editValue, setEditValue] = useState(String(value ?? ''));

  return (
    <input
      className="osdg-input"
      style={{ width: '100%' }}
      value={editValue}
      autoFocus
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={() => onCommit(editValue)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onCommit(editValue);
        if (e.key === 'Escape') onCancel();
      }}
    />
  );
}

interface DataRowProps<T> {
  rowModel: RowModel<T>;
  columns: ColumnDef<T>[];
  columnSizing: Record<string, number>;
  rowSelection: Record<string, boolean>;
  enableRowSelection: boolean;
  editingCell: { rowId: string; columnId: string } | null;
  onToggleSelection: (rowId: string) => void;
  onStartEdit: (rowId: string, columnId: string) => void;
  onCommitEdit: (rowId: string, columnId: string, value: unknown) => void;
  onCancelEdit: () => void;
  onToggleGroup: (groupId: string) => void;
  onToggleTreeRow?: (rowId: string) => void;
  pinOffsets: Record<string, number>;
  leftPinnedLastId?: string;
  rightPinnedFirstId?: string;
  rowHeight: number;
  style?: React.CSSProperties;
}

const DataRowInner = memo(function DataRowInner<T>({
  rowModel,
  columns,
  columnSizing,
  rowSelection,
  enableRowSelection,
  editingCell,
  onToggleSelection,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  onToggleGroup,
  onToggleTreeRow,
  pinOffsets,
  leftPinnedLastId,
  rightPinnedFirstId,
  rowHeight,
  style,
}: DataRowProps<T>) {
  const isGroupingHeader = rowModel.type === 'group' && !rowModel.original;
  const isSelected = !!rowSelection[rowModel.id];

  if (isGroupingHeader) {
    return (
      <tr
        className="osdg-row osdg-row--group"
        style={{ height: rowHeight, ...style }}
        role="row"
      >
        <td
          className="osdg-cell"
          colSpan={columns.length + (enableRowSelection ? 1 : 0)}
          style={{ paddingLeft: `${12 + rowModel.depth * 20}px`, cursor: 'pointer' }}
          onClick={() => onToggleGroup(rowModel.id)}
          role="gridcell"
        >
          <span style={{ marginRight: 8 }}>{rowModel.isExpanded !== false ? '▼' : '▶'}</span>
          {String(rowModel.groupValue ?? rowModel.id)}
        </td>
      </tr>
    );
  }

  const row = rowModel.original!;
  const isTreeParent = rowModel.type === 'group' && rowModel.original != null;
  const depthPad = rowModel.depth * 20;

  return (
    <tr
      className={`osdg-row ${isSelected ? 'osdg-row--selected' : ''}`}
      style={{ height: rowHeight, ...style }}
      role="row"
      aria-selected={isSelected}
    >
      {enableRowSelection && (
        <td className="osdg-cell" style={{ width: 48, textAlign: 'center' }} role="gridcell">
          <input
            type="checkbox"
            className="osdg-checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection(rowModel.id)}
            aria-label={`Select row ${rowModel.id}`}
          />
        </td>
      )}
      {columns.map((column, colIndex) => {
        const value = getCellValue(row, column);
        const isEditing =
          editingCell?.rowId === rowModel.id && editingCell?.columnId === column.id;
        const width = getColumnSize(column, columnSizing);
        const pinLeft = pinOffsets[`left-${column.id}`];
        const pinRight = pinOffsets[`right-${column.id}`];
        let pinClass = '';
        const cellStyle: React.CSSProperties = { width, minWidth: width, maxWidth: width };
        if (colIndex === 0) cellStyle.paddingLeft = `${12 + depthPad}px`;

        if (pinLeft != null) {
          pinClass = 'osdg-cell--pinned-left';
          if (column.id === leftPinnedLastId) pinClass += ' osdg-cell--pinned-left-last';
          cellStyle.left = pinLeft;
        }
        if (pinRight != null) {
          pinClass = 'osdg-cell--pinned-right';
          if (column.id === rightPinnedFirstId) pinClass += ' osdg-cell--pinned-right-first';
          cellStyle.right = pinRight;
        }

        return (
          <td
            key={column.id}
            className={`osdg-cell ${pinClass}`}
            style={cellStyle}
            role="gridcell"
            onDoubleClick={() => onStartEdit(rowModel.id, column.id)}
          >
            {isEditing ? (
              column.editCell ? (
                column.editCell({
                  row,
                  rowIndex: 0,
                  columnId: column.id,
                  value,
                  getValue: () => value,
                  onCommit: (v) => onCommitEdit(rowModel.id, column.id, v),
                  onCancel: onCancelEdit,
                }) as ReactNode
              ) : (
                <DefaultCellEditor
                  row={row}
                  column={column}
                  value={value}
                  onCommit={(v) => onCommitEdit(rowModel.id, column.id, v)}
                  onCancel={onCancelEdit}
                />
              )
            ) : column.cell ? (
              (column.cell({
                row,
                rowIndex: 0,
                columnId: column.id,
                value,
                getValue: () => value,
              }) as ReactNode)
            ) : (
              <>
                {isTreeParent && colIndex === 0 && (
                  <span
                    role="button"
                    tabIndex={0}
                    style={{ marginRight: 8, cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTreeRow?.(rowModel.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggleTreeRow?.(rowModel.id);
                      }
                    }}
                    aria-label={rowModel.isExpanded !== false ? 'Collapse row' : 'Expand row'}
                  >
                    {rowModel.isExpanded !== false ? '▼' : '▶'}
                  </span>
                )}
                {String(value ?? '')}
              </>
            )}
          </td>
        );
      })}
    </tr>
  );
}) as <T>(props: DataRowProps<T>) => ReactNode;

export function DataGrid<T>({
  className = '',
  dark = false,
  theme,
  height = 500,
  showToolbar = true,
  showPagination = true,
  showColumnFilters = true,
  isLoading = false,
  toolbar,
  onCellEdit,
  onRowSelectionChange,
  enableRowSelection,
  store: externalStore,
  ...gridOptions
}: DataGridProps<T>) {
  const { store, state, processed, orderedColumns, rowHeight } = useDataGrid(
    {
      ...gridOptions,
      enableRowSelection: enableRowSelection ?? false,
    },
    externalStore,
  );

  const parentRef = useRef<HTMLDivElement>(null);
  const [dragColumnId, setDragColumnId] = useState<string | null>(null);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const columns = orderedColumns.all;

  const pinOffsets = useMemo(() => {
    const offsets: Record<string, number> = {};
    let leftOffset = enableRowSelection ? 48 : 0;

    for (const col of orderedColumns.left) {
      offsets[`left-${col.id}`] = leftOffset;
      leftOffset += getColumnSize(col, state.columnSizing);
    }

    let rightOffset = 0;
    for (const col of [...orderedColumns.right].reverse()) {
      offsets[`right-${col.id}`] = rightOffset;
      rightOffset += getColumnSize(col, state.columnSizing);
    }

    return offsets;
  }, [orderedColumns, state.columnSizing, enableRowSelection]);

  const rowVirtualizer = useVirtualizer({
    count: processed.rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  });

  const { handleKeyDown } = useGridKeyboard({
    store,
    rowCount: processed.rows.length,
    columnCount: columns.length,
    onEdit: (rowId, columnId) => store.getState().setEditingCell({ rowId, columnId }),
  });

  const getSortDirection = useCallback(
    (columnId: string): 'asc' | 'desc' | false => {
      const sort = state.sorting.find((s) => s.id === columnId);
      if (!sort) return false;
      return sort.desc ? 'desc' : 'asc';
    },
    [state.sorting],
  );

  const handleToggleSelection = useCallback(
    (rowId: string, shiftKey = false) => {
      if (shiftKey && lastSelectedId && state.enableMultiRowSelection) {
        const ids = processed.rows.filter((r) => r.type === 'data').map((r) => r.id);
        const next = toggleSelectionRange(state.rowSelection, ids, lastSelectedId, rowId);
        store.getState().setRowSelection(next);
      } else {
        store.getState().toggleRowSelection(rowId);
      }
      setLastSelectedId(rowId);
      onRowSelectionChange?.(store.getState().rowSelection);
    },
    [store, state, lastSelectedId, processed.rows, onRowSelectionChange],
  );

  const handleCommitEdit = useCallback(
    (rowId: string, columnId: string, value: unknown) => {
      const row = state.data.find((r, i) => state.getRowId(r, i) === rowId);
      const col = state.columns.find((c) => c.id === columnId);
      if (row && col) {
        const prev = getCellValue(row, col);
        store.getState().pushEditHistory({ rowId, columnId, previousValue: prev, nextValue: value });
      }
      onCellEdit?.(rowId, columnId, value);
      store.getState().setEditingCell(null);
    },
    [store, onCellEdit, state.data, state.columns, state.getRowId],
  );

  const handleUndo = useCallback(() => {
    const action = store.getState().undo();
    if (action) onCellEdit?.(action.rowId, action.columnId, action.previousValue);
  }, [store, onCellEdit]);

  const handleRedo = useCallback(() => {
    const action = store.getState().redo();
    if (action) onCellEdit?.(action.rowId, action.columnId, action.nextValue);
  }, [store, onCellEdit]);

  const gridThemeStyle = useMemo(() => {
    const t = theme ?? (dark ? defaultDarkTheme : undefined);
    return t ? themeToCssVars(t) : undefined;
  }, [theme, dark]);

  const leftPinnedLastId = orderedColumns.left.at(-1)?.id;
  const rightPinnedFirstId = orderedColumns.right[0]?.id;

  const densityClass =
    state.density === 'compact'
      ? 'osdg-density-compact'
      : state.density === 'comfortable'
        ? 'osdg-density-comfortable'
        : '';

  const tableWidth = useMemo(() => {
    let total = enableRowSelection ? 48 : 0;
    for (const col of columns) {
      total += getColumnSize(col, state.columnSizing);
    }
    return total;
  }, [columns, state.columnSizing, enableRowSelection]);

  return (
    <div
      className={`osdg-grid ${dark ? 'osdg-grid--dark' : ''} ${densityClass} ${className}`}
      style={{ height, ...gridThemeStyle }}
      role="grid"
      aria-rowcount={processed.rowCount}
      aria-colcount={columns.length}
      aria-busy={isLoading || state.isLoading}
      onKeyDown={(e) => {
        if (isEditableElement(e.target)) return;
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) {
          e.preventDefault();
          handleRedo();
        } else {
          handleKeyDown(e);
        }
      }}
      tabIndex={0}
    >
      {showToolbar &&
        (toolbar ?? (
          <GridToolbar
            store={store}
            showColumnFilters={showColumnFilters}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
        ))}

      <div ref={parentRef} className="osdg-table-wrapper" style={{ position: 'relative' }}>
        {(isLoading || state.isLoading) && (
          <div className="osdg-loading-overlay" role="status" aria-live="polite">
            <div className="osdg-loading-spinner" />
            Loading...
          </div>
        )}
        <table className="osdg-table" style={{ width: tableWidth, minWidth: '100%' }}>
          <thead className="osdg-header">
            <tr role="row">
              {enableRowSelection && (
                <th className="osdg-header-cell" style={{ width: 48 }} role="columnheader">
                  <input
                    type="checkbox"
                    className="osdg-checkbox"
                    checked={
                      processed.rows.filter((r) => r.type === 'data').length > 0 &&
                      processed.rows
                        .filter((r) => r.type === 'data')
                        .every((r) => state.rowSelection[r.id])
                    }
                    onChange={() => {
                      const ids = processed.rows.filter((r) => r.type === 'data').map((r) => r.id);
                      store.getState().toggleAllRowsSelected(ids);
                      onRowSelectionChange?.(store.getState().rowSelection);
                    }}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => {
                const width = getColumnSize(column, state.columnSizing);
                const pinLeft = pinOffsets[`left-${column.id}`];
                const pinRight = pinOffsets[`right-${column.id}`];
                let pinClass = '';
                if (pinLeft != null) {
                  pinClass = 'osdg-cell--pinned-left';
                  if (column.id === leftPinnedLastId) pinClass += ' osdg-cell--pinned-left-last';
                }
                if (pinRight != null) {
                  pinClass = 'osdg-cell--pinned-right';
                  if (column.id === rightPinnedFirstId) pinClass += ' osdg-cell--pinned-right-first';
                }

                return (
                  <HeaderCell
                    key={column.id}
                    column={column}
                    width={width}
                    sortDirection={getSortDirection(column.id)}
                    onSort={() => store.getState().toggleSorting(column.id, true)}
                    store={store}
                    enableResizing={state.enableColumnResizing}
                    pinClass={pinClass}
                    draggable
                    onDragStart={() => setDragColumnId(column.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (!dragColumnId || dragColumnId === column.id) return;
                      const order = [...state.columnOrder];
                      const fromIdx = order.indexOf(dragColumnId);
                      const toIdx = order.indexOf(column.id);
                      if (fromIdx === -1 || toIdx === -1) return;
                      order.splice(fromIdx, 1);
                      order.splice(toIdx, 0, dragColumnId);
                      store.getState().setColumnOrder(order);
                      setDragColumnId(null);
                    }}
                  />
                );
              })}
            </tr>
          </thead>
          <tbody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const rowModel = processed.rows[virtualRow.index];
              return (
                <DataRowInner
                  key={rowModel.id}
                  rowModel={rowModel}
                  columns={columns}
                  columnSizing={state.columnSizing}
                  rowSelection={state.rowSelection}
                  enableRowSelection={!!enableRowSelection}
                  editingCell={state.editingCell}
                  onToggleSelection={(id) => handleToggleSelection(id)}
                  onStartEdit={(rowId, columnId) =>
                    store.getState().setEditingCell({ rowId, columnId })
                  }
                  onCommitEdit={handleCommitEdit}
                  onCancelEdit={() => store.getState().setEditingCell(null)}
                  onToggleGroup={(groupId) => store.getState().toggleGroupExpanded(groupId)}
                  onToggleTreeRow={(rowId) => store.getState().toggleTreeRowExpanded(rowId)}
                  pinOffsets={pinOffsets}
                  leftPinnedLastId={leftPinnedLastId}
                  rightPinnedFirstId={rightPinnedFirstId}
                  rowHeight={rowHeight}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <GridPagination
          store={store}
          pageCount={processed.pageCount}
          rowCount={processed.rowCount}
        />
      )}
    </div>
  );
}

export { GridToolbar } from './GridToolbar';
export { GridPagination } from './GridPagination';
