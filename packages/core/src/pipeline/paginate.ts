import type { PaginationState, RowModel } from '../types';

export function applyPagination<T>(
  rows: RowModel<T>[],
  pagination: PaginationState,
): { rows: RowModel<T>[]; pageCount: number; rowCount: number } {
  const rowCount = rows.length;
  const pageCount = Math.max(1, Math.ceil(rowCount / pagination.pageSize));
  const start = pagination.pageIndex * pagination.pageSize;
  const end = start + pagination.pageSize;

  return {
    rows: rows.slice(start, end),
    pageCount,
    rowCount,
  };
}

export function paginateFlatData<T>(
  data: T[],
  pagination: PaginationState,
): { data: T[]; pageCount: number; rowCount: number } {
  const rowCount = data.length;
  const pageCount = Math.max(1, Math.ceil(rowCount / pagination.pageSize));
  const start = pagination.pageIndex * pagination.pageSize;
  const end = start + pagination.pageSize;

  return {
    data: data.slice(start, end),
    pageCount,
    rowCount,
  };
}

export function getSelectedRowIds(selection: Record<string, boolean>): string[] {
  return Object.entries(selection)
    .filter(([, selected]) => selected)
    .map(([id]) => id);
}

export function toggleSelectionRange(
  current: Record<string, boolean>,
  rowIds: string[],
  fromId: string,
  toId: string,
): Record<string, boolean> {
  const fromIndex = rowIds.indexOf(fromId);
  const toIndex = rowIds.indexOf(toId);
  if (fromIndex === -1 || toIndex === -1) return current;

  const start = Math.min(fromIndex, toIndex);
  const end = Math.max(fromIndex, toIndex);
  const next = { ...current };

  for (let i = start; i <= end; i++) {
    next[rowIds[i]] = true;
  }

  return next;
}
