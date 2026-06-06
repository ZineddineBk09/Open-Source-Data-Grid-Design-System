import type { ColumnDef, SortingState } from '../types';
import { compareValues, getCellValue } from '../utils';

export function applySorting<T>(
  data: T[],
  columns: ColumnDef<T>[],
  sorting: SortingState[],
): T[] {
  if (sorting.length === 0) return data;

  const columnMap = new Map(columns.map((c) => [c.id, c]));

  return [...data].sort((rowA, rowB) => {
    for (const sort of sorting) {
      const column = columnMap.get(sort.id);
      if (!column) continue;

      const valueA = getCellValue(rowA, column);
      const valueB = getCellValue(rowB, column);
      const cmp = compareValues(valueA, valueB);

      if (cmp !== 0) {
        return sort.desc ? -cmp : cmp;
      }
    }
    return 0;
  });
}
