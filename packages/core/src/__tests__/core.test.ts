import { describe, it, expect } from 'vitest';
import { applyFilters } from '../pipeline/filter';
import { applySorting } from '../pipeline/sort';
import { applyGrouping } from '../pipeline/group';
import { applyPagination } from '../pipeline/paginate';
import { getVirtualRange, getVirtualItems } from '../virtual';
import { exportToCsv } from '../export/csv';
import { createGridStore, processGridData } from '../index';
import type { ColumnDef } from '../types';

interface Employee {
  id: string;
  name: string;
  department: string;
  salary: number;
  status: string;
}

const columns: ColumnDef<Employee>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
  { id: 'department', accessorKey: 'department', header: 'Department', enableGrouping: true },
  { id: 'salary', accessorKey: 'salary', header: 'Salary', enableSorting: true },
  { id: 'status', accessorKey: 'status', header: 'Status' },
];

const data: Employee[] = [
  { id: '1', name: 'Alice', department: 'Engineering', salary: 120000, status: 'Active' },
  { id: '2', name: 'Bob', department: 'Sales', salary: 80000, status: 'Active' },
  { id: '3', name: 'Charlie', department: 'Engineering', salary: 110000, status: 'Inactive' },
  { id: '4', name: 'Diana', department: 'Sales', salary: 95000, status: 'Active' },
  { id: '5', name: 'Eve', department: 'Marketing', salary: 75000, status: 'Active' },
];

describe('applyFilters', () => {
  it('filters by global search', () => {
    const result = applyFilters(data, columns, [], 'alice');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });

  it('filters by column filter contains', () => {
    const result = applyFilters(data, columns, [
      { id: 'department', operator: 'contains', value: 'Eng' },
    ], '');
    expect(result).toHaveLength(2);
  });

  it('filters by numeric gt', () => {
    const result = applyFilters(data, columns, [
      { id: 'salary', operator: 'gt', value: 90000 },
    ], '');
    expect(result).toHaveLength(3);
  });
});

describe('applySorting', () => {
  it('sorts ascending by salary', () => {
    const result = applySorting(data, columns, [{ id: 'salary', desc: false }]);
    expect(result[0].salary).toBe(75000);
    expect(result[4].salary).toBe(120000);
  });

  it('sorts descending by name', () => {
    const result = applySorting(data, columns, [{ id: 'name', desc: true }]);
    expect(result[0].name).toBe('Eve');
  });
});

describe('applyGrouping', () => {
  it('groups by department', () => {
    const rows = applyGrouping(data, columns, ['department'], {}, (r) => r.id);
    const groupRows = rows.filter((r) => r.type === 'group');
    expect(groupRows).toHaveLength(3);
  });

  it('collapses groups when not expanded', () => {
    const rows = applyGrouping(
      data,
      columns,
      ['department'],
      { 'root::department::Engineering': false },
      (r) => r.id,
    );
    const dataRows = rows.filter((r) => r.type === 'data');
    expect(dataRows).toHaveLength(3);
    expect(dataRows.every((r) => r.original?.department !== 'Engineering')).toBe(true);
  });
});

describe('applyPagination', () => {
  it('paginates rows', () => {
    const rows = data.map((r, i) => ({
      id: r.id,
      type: 'data' as const,
      original: r,
      depth: 0,
    }));
    const result = applyPagination(rows, { pageIndex: 0, pageSize: 2 });
    expect(result.rows).toHaveLength(2);
    expect(result.pageCount).toBe(3);
  });
});

describe('virtual scrolling', () => {
  it('computes virtual range', () => {
    const range = getVirtualRange(200, 400, 100, 40, 3);
    expect(range.startIndex).toBeGreaterThanOrEqual(0);
    expect(range.endIndex).toBeLessThan(100);
    expect(range.totalSize).toBe(4000);
  });

  it('returns virtual items', () => {
    const items = getVirtualItems(0, 400, 50, 40);
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].index).toBe(0);
  });
});

describe('exportToCsv', () => {
  it('exports data to CSV format', () => {
    const csv = exportToCsv(data, columns);
    expect(csv).toContain('Name,Department,Salary,Status');
    expect(csv).toContain('Alice,Engineering,120000,Active');
  });
});

describe('createGridStore', () => {
  it('creates store and processes data', () => {
    const store = createGridStore({ data, columns, getRowId: (r) => r.id });
    const state = store.getState();
    const result = processGridData(state);
    expect(result.rows.length).toBeGreaterThan(0);
  });

  it('toggles sorting', () => {
    const store = createGridStore({ data, columns, getRowId: (r) => r.id });
    store.getState().toggleSorting('salary');
    expect(store.getState().sorting).toEqual([{ id: 'salary', desc: false }]);
    store.getState().toggleSorting('salary');
    expect(store.getState().sorting).toEqual([{ id: 'salary', desc: true }]);
  });

  it('toggles row selection', () => {
    const store = createGridStore({
      data,
      columns,
      getRowId: (r) => r.id,
      enableRowSelection: true,
    });
    store.getState().toggleRowSelection('1');
    expect(store.getState().rowSelection['1']).toBe(true);
  });

  it('persists column filter operator before a value is entered', () => {
    const store = createGridStore({ data, columns, getRowId: (r) => r.id });
    store.getState().setColumnFilter('salary', 'lt', '');
    expect(store.getState().columnFilters).toEqual([
      { id: 'salary', operator: 'lt', value: '' },
    ]);
    // Empty value should not filter rows yet
    expect(processGridData(store.getState()).flatData).toHaveLength(data.length);
    store.getState().setColumnFilter('salary', 'lt', '90000');
    expect(processGridData(store.getState()).flatData).toHaveLength(2);
  });
});
