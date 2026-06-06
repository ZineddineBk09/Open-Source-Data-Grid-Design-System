import type { ColumnDef, RowModel } from '../types';
import { getCellValue } from '../utils';

function buildGroupKey(values: unknown[]): string {
  return values.map((v) => String(v ?? '')).join('::');
}

export function applyGrouping<T>(
  data: T[],
  columns: ColumnDef<T>[],
  grouping: string[],
  expandedGroups: Record<string, boolean>,
  getRowId: (row: T, index: number) => string,
): RowModel<T>[] {
  if (grouping.length === 0) {
    return data.map((row, index) => ({
      id: getRowId(row, index),
      type: 'data' as const,
      original: row,
      depth: 0,
    }));
  }

  const columnMap = new Map(columns.map((c) => [c.id, c]));

  function groupRows(rows: T[], level: number, parentKey: string): RowModel<T>[] {
    if (level >= grouping.length) {
      return rows.map((row, index) => ({
        id: getRowId(row, index),
        type: 'data' as const,
        original: row,
        depth: level,
      }));
    }

    const groupColumnId = grouping[level];
    const column = columnMap.get(groupColumnId);
    if (!column) {
      return rows.map((row, index) => ({
        id: getRowId(row, index),
        type: 'data' as const,
        original: row,
        depth: level,
      }));
    }

    const groups = new Map<string, T[]>();

    for (const row of rows) {
      const value = getCellValue(row, column);
      const key = String(value ?? '');
      const existing = groups.get(key) ?? [];
      existing.push(row);
      groups.set(key, existing);
    }

    const result: RowModel<T>[] = [];

    for (const [groupValue, groupRows_] of groups) {
      const groupKey = buildGroupKey([parentKey, groupColumnId, groupValue]);
      const isExpanded = expandedGroups[groupKey] !== false;

      result.push({
        id: groupKey,
        type: 'group',
        original: null,
        depth: level,
        groupValue,
        groupColumnId,
        isExpanded,
      });

      if (isExpanded) {
        result.push(...groupRows(groupRows_, level + 1, groupKey));
      }
    }

    return result;
  }

  return groupRows(data, 0, 'root');
}
