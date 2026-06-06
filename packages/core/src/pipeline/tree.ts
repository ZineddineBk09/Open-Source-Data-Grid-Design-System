import type { RowModel } from '../types';

export interface TreeOptions<T> {
  getSubRows?: (row: T) => T[] | undefined;
  getRowId: (row: T, index: number) => string;
  expandedRows: Record<string, boolean>;
}

export function flattenTreeData<T>(
  data: T[],
  { getSubRows, getRowId, expandedRows }: TreeOptions<T>,
): RowModel<T>[] {
  if (!getSubRows) {
    return data.map((row, index) => ({
      id: getRowId(row, index),
      type: 'data' as const,
      original: row,
      depth: 0,
    }));
  }

  const result: RowModel<T>[] = [];

  const subRowsFn = getSubRows;

  function walk(rows: T[], depth: number) {
    rows.forEach((row, index) => {
      const id = getRowId(row, index);
      const children = subRowsFn(row) ?? [];
      const hasChildren = children.length > 0;
      const isExpanded = expandedRows[id] !== false;

      result.push({
        id,
        type: hasChildren ? 'group' : 'data',
        original: row,
        depth,
        isExpanded: hasChildren ? isExpanded : undefined,
        groupValue: hasChildren ? getRowId(row, index) : undefined,
      });

      if (hasChildren && isExpanded) {
        walk(children, depth + 1);
      }
    });
  }

  walk(data, 0);
  return result;
}
