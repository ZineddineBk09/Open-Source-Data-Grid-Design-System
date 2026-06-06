import type { GridState, RowModel } from '../types';
import { applyFilters } from '../pipeline/filter';
import { applyGrouping } from '../pipeline/group';
import { applyPagination } from '../pipeline/paginate';
import { applySorting } from '../pipeline/sort';
import { flattenTreeData } from '../pipeline/tree';

export interface ProcessedGridResult<T> {
  rows: RowModel<T>[];
  flatData: T[];
  pageCount: number;
  rowCount: number;
}

export function processGridData<T>(state: GridState<T>): ProcessedGridResult<T> {
  let data = state.data;

  if (!state.manualFiltering) {
    data = applyFilters(data, state.columns, state.columnFilters, state.globalFilter);
  }

  if (!state.manualSorting) {
    data = applySorting(data, state.columns, state.sorting);
  }

  let rows: RowModel<T>[];

  if (state.enableTreeData && state.getSubRows) {
    rows = flattenTreeData(data, {
      getSubRows: state.getSubRows,
      getRowId: state.getRowId,
      expandedRows: state.expandedTreeRows,
    });
  } else if (state.enableGrouping && state.grouping.length > 0) {
    rows = applyGrouping(
      data,
      state.columns,
      state.grouping,
      state.expandedGroups,
      state.getRowId,
    );
  } else {
    rows = data.map((row, index) => ({
      id: state.getRowId(row, index),
      type: 'data' as const,
      original: row,
      depth: 0,
    }));
  }

  if (!state.manualPagination) {
    const paginated = applyPagination(rows, state.pagination);
    return {
      rows: paginated.rows,
      flatData: data,
      pageCount: paginated.pageCount,
      rowCount: paginated.rowCount,
    };
  }

  return {
    rows,
    flatData: data,
    pageCount: state.pageCount ?? 1,
    rowCount: data.length,
  };
}

export function getVisibleRows<T>(state: GridState<T>): RowModel<T>[] {
  return processGridData(state).rows;
}

export function getOrderedColumns<T>(state: GridState<T>) {
  const columnMap = new Map(state.columns.map((c) => [c.id, c]));
  const order =
    state.columnOrder.length > 0
      ? state.columnOrder
      : state.columns.map((c) => c.id);

  const ordered = order
    .map((id) => columnMap.get(id))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const leftPinned = state.columnPinning.left
    .map((id) => columnMap.get(id))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const rightPinned = state.columnPinning.right
    .map((id) => columnMap.get(id))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const center = ordered.filter(
    (c) =>
      !state.columnPinning.left.includes(c.id) &&
      !state.columnPinning.right.includes(c.id),
  );

  return { left: leftPinned, center, right: rightPinned, all: [...leftPinned, ...center, ...rightPinned] };
}

export function getSelectedRows<T>(state: GridState<T>): T[] {
  const selectedIds = new Set(
    Object.entries(state.rowSelection)
      .filter(([, v]) => v)
      .map(([id]) => id),
  );

  return state.data.filter((row, index) => selectedIds.has(state.getRowId(row, index)));
}
