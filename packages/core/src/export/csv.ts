import type { ColumnDef } from '../types';
import { escapeCsvValue, getCellValue } from '../utils';

export function exportToCsv<T>(rows: T[], columns: ColumnDef<T>[]): string {
  const exportColumns = columns.filter((c) => c.id !== '__selection__');

  const header = exportColumns.map((c) => escapeCsvValue(c.header)).join(',');
  const body = rows
    .map((row) =>
      exportColumns.map((col) => escapeCsvValue(getCellValue(row, col))).join(','),
    )
    .join('\n');

  return `${header}\n${body}`;
}

export function downloadCsv(content: string, filename = 'export.csv'): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
