export type Density = 'compact' | 'default' | 'comfortable';

export type SortDirection = 'asc' | 'desc';

export type FilterOperator = 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in';

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface ColumnFilter {
  id: string;
  operator: FilterOperator;
  value: unknown;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface ColumnPinningState {
  left: string[];
  right: string[];
}

export interface CellContext<T> {
  row: T;
  rowIndex: number;
  columnId: string;
  value: unknown;
  getValue: () => unknown;
}

export interface ColumnDef<T> {
  id: string;
  accessorKey?: keyof T & string;
  accessorFn?: (row: T) => unknown;
  header: string;
  size?: number;
  minSize?: number;
  maxSize?: number;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableGrouping?: boolean;
  enableResizing?: boolean;
  pin?: 'left' | 'right';
  cell?: (ctx: CellContext<T>) => unknown;
  editCell?: (ctx: CellContext<T> & { onCommit: (value: unknown) => void; onCancel: () => void }) => unknown;
}

export type RowType = 'data' | 'group' | 'tree';

export interface RowModel<T> {
  id: string;
  type: RowType;
  original: T | null;
  depth: number;
  groupValue?: unknown;
  groupColumnId?: string;
  subRows?: RowModel<T>[];
  isExpanded?: boolean;
}

export interface EditingCell {
  rowId: string;
  columnId: string;
}

export interface FocusedCell {
  rowIndex: number;
  columnIndex: number;
}

export interface GridOptions<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId?: (row: T, index: number) => string;
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  enableColumnResizing?: boolean;
  enableGrouping?: boolean;
  enableGlobalFilter?: boolean;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  pageCount?: number;
  density?: Density;
  grouping?: string[];
  getSubRows?: (row: T) => T[] | undefined;
  enableTreeData?: boolean;
  initialState?: Partial<GridState<T>>;
}

export interface GridState<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T, index: number) => string;
  getSubRows?: (row: T) => T[] | undefined;
  sorting: SortingState[];
  columnFilters: ColumnFilter[];
  globalFilter: string;
  pagination: PaginationState;
  rowSelection: Record<string, boolean>;
  columnSizing: Record<string, number>;
  columnOrder: string[];
  columnPinning: ColumnPinningState;
  grouping: string[];
  expandedGroups: Record<string, boolean>;
  expandedTreeRows: Record<string, boolean>;
  editingCell: EditingCell | null;
  focusedCell: FocusedCell | null;
  density: Density;
  enableRowSelection: boolean;
  enableMultiRowSelection: boolean;
  enableColumnResizing: boolean;
  enableGrouping: boolean;
  enableGlobalFilter: boolean;
  enableTreeData: boolean;
  manualPagination: boolean;
  manualSorting: boolean;
  manualFiltering: boolean;
  isLoading: boolean;
  pageCount?: number;
  editHistory: { past: import('../history/editHistory').EditAction[]; future: import('../history/editHistory').EditAction[] };
}

export interface VirtualRange {
  startIndex: number;
  endIndex: number;
  totalSize: number;
  offsetY: number;
}

export interface VirtualItem {
  index: number;
  start: number;
  size: number;
}

export type KeyboardCommand =
  | 'moveUp'
  | 'moveDown'
  | 'moveLeft'
  | 'moveRight'
  | 'selectRow'
  | 'editCell'
  | 'cancelEdit'
  | 'commitEdit'
  | 'selectAll'
  | 'pageUp'
  | 'pageDown';

export interface GridStoreActions<T> {
  setData: (data: T[]) => void;
  setColumns: (columns: ColumnDef<T>[]) => void;
  setSorting: (sorting: SortingState[]) => void;
  toggleSorting: (columnId: string, multi?: boolean) => void;
  setColumnFilters: (filters: ColumnFilter[]) => void;
  setColumnFilter: (columnId: string, operator: FilterOperator, value: unknown) => void;
  clearColumnFilter: (columnId: string) => void;
  setGlobalFilter: (value: string) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setPageCount: (pageCount: number) => void;
  toggleRowSelection: (rowId: string) => void;
  setRowSelection: (selection: Record<string, boolean>) => void;
  toggleAllRowsSelected: (rowIds: string[]) => void;
  setColumnSizing: (columnId: string, size: number) => void;
  setColumnOrder: (order: string[]) => void;
  setColumnPinning: (pinning: Partial<ColumnPinningState>) => void;
  pinColumn: (columnId: string, position: 'left' | 'right' | false) => void;
  setGrouping: (grouping: string[]) => void;
  toggleGroupExpanded: (groupId: string) => void;
  toggleTreeRowExpanded: (rowId: string) => void;
  setEditingCell: (cell: EditingCell | null) => void;
  setFocusedCell: (cell: FocusedCell | null) => void;
  setDensity: (density: Density) => void;
  setIsLoading: (isLoading: boolean) => void;
  pushEditHistory: (action: import('../history/editHistory').EditAction) => void;
  undo: () => import('../history/editHistory').EditAction | null;
  redo: () => import('../history/editHistory').EditAction | null;
  resetState: () => void;
}

export type GridStore<T> = GridState<T> & GridStoreActions<T>;

export const DENSITY_ROW_HEIGHT: Record<Density, number> = {
  compact: 32,
  default: 40,
  comfortable: 48,
};

export const DEFAULT_COLUMN_SIZE = 150;
export const DEFAULT_MIN_COLUMN_SIZE = 50;
export const DEFAULT_MAX_COLUMN_SIZE = 600;
