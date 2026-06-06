import type { ColumnDef, ColumnFilter, FilterOperator } from '../types';
import { getCellValue } from '../utils';

function matchesFilter(value: unknown, operator: FilterOperator, filterValue: unknown): boolean {
  if (filterValue === '' || filterValue == null) return true;

  switch (operator) {
    case 'equals':
      return String(value).toLowerCase() === String(filterValue).toLowerCase();
    case 'contains':
      return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
    case 'gt':
      return Number(value) > Number(filterValue);
    case 'lt':
      return Number(value) < Number(filterValue);
    case 'gte':
      return Number(value) >= Number(filterValue);
    case 'lte':
      return Number(value) <= Number(filterValue);
    case 'in': {
      const values = Array.isArray(filterValue) ? filterValue : String(filterValue).split(',');
      return values.map(String).includes(String(value));
    }
    default:
      return true;
  }
}

export function applyFilters<T>(
  data: T[],
  columns: ColumnDef<T>[],
  columnFilters: ColumnFilter[],
  globalFilter: string,
): T[] {
  let result = data;

  if (globalFilter.trim()) {
    const query = globalFilter.toLowerCase();
    result = result.filter((row) =>
      columns.some((col) => {
        const value = getCellValue(row, col);
        return value != null && String(value).toLowerCase().includes(query);
      }),
    );
  }

  if (columnFilters.length === 0) return result;

  const columnMap = new Map(columns.map((c) => [c.id, c]));

  return result.filter((row) =>
    columnFilters.every((filter) => {
      const column = columnMap.get(filter.id);
      if (!column) return true;
      const value = getCellValue(row, column);
      return matchesFilter(value, filter.operator, filter.value);
    }),
  );
}

export { matchesFilter };
