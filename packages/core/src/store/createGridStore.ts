import { createStore } from 'zustand/vanilla';
import {
  createEditHistory,
  pushEdit,
  redoEdit,
  undoEdit,
  type EditAction,
} from '../history/editHistory';
import type {
  ColumnDef,
  ColumnPinningState,
  Density,
  EditingCell,
  FilterOperator,
  FocusedCell,
  GridOptions,
  GridState,
  GridStore,
  GridStoreActions,
  PaginationState,
  SortingState,
} from '../types';

function defaultGetRowId<T>(row: T, index: number): string {
  return String((row as Record<string, unknown>).id ?? index);
}

function buildInitialPinning<T>(columns: ColumnDef<T>[]): ColumnPinningState {
  const left: string[] = [];
  const right: string[] = [];

  for (const col of columns) {
    if (col.pin === 'left') left.push(col.id);
    if (col.pin === 'right') right.push(col.id);
  }

  return { left, right };
}

function createInitialState<T>(options: GridOptions<T>): GridState<T> {
  const getRowId = options.getRowId ?? defaultGetRowId;

  return {
    data: options.data,
    columns: options.columns,
    getRowId,
    getSubRows: options.getSubRows,
    sorting: options.initialState?.sorting ?? [],
    columnFilters: options.initialState?.columnFilters ?? [],
    globalFilter: options.initialState?.globalFilter ?? '',
    pagination: options.initialState?.pagination ?? { pageIndex: 0, pageSize: 50 },
    rowSelection: options.initialState?.rowSelection ?? {},
    columnSizing: options.initialState?.columnSizing ?? {},
    columnOrder: options.initialState?.columnOrder ?? options.columns.map((c) => c.id),
    columnPinning: options.initialState?.columnPinning ?? buildInitialPinning(options.columns),
    grouping: options.initialState?.grouping ?? options.grouping ?? [],
    expandedGroups: options.initialState?.expandedGroups ?? {},
    expandedTreeRows: options.initialState?.expandedTreeRows ?? {},
    editingCell: options.initialState?.editingCell ?? null,
    focusedCell: options.initialState?.focusedCell ?? null,
    density: options.initialState?.density ?? options.density ?? 'default',
    enableRowSelection: options.enableRowSelection ?? false,
    enableMultiRowSelection: options.enableMultiRowSelection ?? true,
    enableColumnResizing: options.enableColumnResizing ?? true,
    enableGrouping: options.enableGrouping ?? false,
    enableGlobalFilter: options.enableGlobalFilter ?? true,
    enableTreeData: options.enableTreeData ?? !!options.getSubRows,
    manualPagination: options.manualPagination ?? false,
    manualSorting: options.manualSorting ?? false,
    manualFiltering: options.manualFiltering ?? false,
    isLoading: false,
    pageCount: options.pageCount,
    editHistory: createEditHistory(),
  };
}

export function createGridStore<T>(options: GridOptions<T>) {
  const initialState = createInitialState(options);

  return createStore<GridStore<T>>((set, get) => ({
    ...initialState,

    setData: (data) => set({ data }),

    setColumns: (columns) =>
      set({
        columns,
        columnOrder: columns.map((c) => c.id),
        columnPinning: buildInitialPinning(columns),
      }),

    setSorting: (sorting) => set({ sorting, pagination: { ...get().pagination, pageIndex: 0 } }),

    toggleSorting: (columnId, multi = false) => {
      const current = get().sorting;
      const existing = current.find((s) => s.id === columnId);

      let next: SortingState[];

      if (!existing) {
        next = multi ? [...current, { id: columnId, desc: false }] : [{ id: columnId, desc: false }];
      } else if (!existing.desc) {
        next = multi
          ? current.map((s) => (s.id === columnId ? { ...s, desc: true } : s))
          : [{ id: columnId, desc: true }];
      } else {
        next = multi ? current.filter((s) => s.id !== columnId) : [];
      }

      set({ sorting: next, pagination: { ...get().pagination, pageIndex: 0 } });
    },

    setColumnFilters: (columnFilters) =>
      set({ columnFilters, pagination: { ...get().pagination, pageIndex: 0 } }),

    setColumnFilter: (columnId, operator, value) => {
      const filters = get().columnFilters.filter((f) => f.id !== columnId);
      const normalizedValue = value ?? '';
      // Persist operator even before a value is entered; empty values are ignored by applyFilters
      if (normalizedValue !== '' || operator !== 'contains') {
        filters.push({ id: columnId, operator, value: normalizedValue });
      }
      set({ columnFilters: filters, pagination: { ...get().pagination, pageIndex: 0 } });
    },

    clearColumnFilter: (columnId) => {
      set({
        columnFilters: get().columnFilters.filter((f) => f.id !== columnId),
        pagination: { ...get().pagination, pageIndex: 0 },
      });
    },

    setGlobalFilter: (globalFilter) =>
      set({ globalFilter, pagination: { ...get().pagination, pageIndex: 0 } }),

    setPagination: (pagination) =>
      set({ pagination: { ...get().pagination, ...pagination } }),

    setPageIndex: (pageIndex) =>
      set({ pagination: { ...get().pagination, pageIndex } }),

    setPageSize: (pageSize) =>
      set({ pagination: { ...get().pagination, pageSize, pageIndex: 0 } }),

    setPageCount: (pageCount) => set({ pageCount }),

    toggleRowSelection: (rowId) => {
      const { rowSelection, enableMultiRowSelection } = get();
      const isSelected = !!rowSelection[rowId];

      if (!enableMultiRowSelection) {
        set({ rowSelection: isSelected ? {} : { [rowId]: true } });
        return;
      }

      const next = { ...rowSelection };
      if (isSelected) {
        delete next[rowId];
      } else {
        next[rowId] = true;
      }
      set({ rowSelection: next });
    },

    setRowSelection: (rowSelection) => set({ rowSelection }),

    toggleAllRowsSelected: (rowIds) => {
      const { rowSelection } = get();
      const allSelected = rowIds.length > 0 && rowIds.every((id) => rowSelection[id]);

      if (allSelected) {
        const next = { ...rowSelection };
        for (const id of rowIds) delete next[id];
        set({ rowSelection: next });
      } else {
        const next = { ...rowSelection };
        for (const id of rowIds) next[id] = true;
        set({ rowSelection: next });
      }
    },

    setColumnSizing: (columnId, size) => {
      const column = get().columns.find((c) => c.id === columnId);
      const minSize = column?.minSize ?? 50;
      const maxSize = column?.maxSize ?? 600;
      const clamped = Math.max(minSize, Math.min(maxSize, size));
      set({ columnSizing: { ...get().columnSizing, [columnId]: clamped } });
    },

    setColumnOrder: (columnOrder) => set({ columnOrder }),

    setColumnPinning: (pinning) =>
      set({ columnPinning: { ...get().columnPinning, ...pinning } }),

    pinColumn: (columnId, position) => {
      const { columnPinning } = get();
      const left = columnPinning.left.filter((id) => id !== columnId);
      const right = columnPinning.right.filter((id) => id !== columnId);

      if (position === 'left') left.push(columnId);
      if (position === 'right') right.push(columnId);

      set({ columnPinning: { left, right } });
    },

    setGrouping: (grouping) => set({ grouping }),

    toggleGroupExpanded: (groupId) => {
      const { expandedGroups } = get();
      const isExpanded = expandedGroups[groupId] !== false;
      set({ expandedGroups: { ...expandedGroups, [groupId]: !isExpanded } });
    },

    toggleTreeRowExpanded: (rowId) => {
      const { expandedTreeRows } = get();
      const isExpanded = expandedTreeRows[rowId] !== false;
      set({ expandedTreeRows: { ...expandedTreeRows, [rowId]: !isExpanded } });
    },

    setEditingCell: (editingCell) => set({ editingCell }),

    setFocusedCell: (focusedCell) => set({ focusedCell }),

    setDensity: (density) => set({ density }),

    setIsLoading: (isLoading) => set({ isLoading }),

    pushEditHistory: (action: EditAction) => {
      set({ editHistory: pushEdit(get().editHistory, action) });
    },

    undo: () => {
      const { history, action } = undoEdit(get().editHistory);
      if (action) set({ editHistory: history });
      return action;
    },

    redo: () => {
      const { history, action } = redoEdit(get().editHistory);
      if (action) set({ editHistory: history });
      return action;
    },

    resetState: () => set(createInitialState(options)),
  }));
}

export type GridStoreInstance<T> = ReturnType<typeof createGridStore<T>>;

export function subscribeToStore<T>(
  store: GridStoreInstance<T>,
  listener: (state: GridStore<T>) => void,
): () => void {
  return store.subscribe(listener);
}

export type { GridStoreActions, FilterOperator, SortingState, PaginationState, EditingCell, FocusedCell, Density };
