<script setup lang="ts" generic="T">
import { computed, ref } from 'vue';
import {
  getCellValue,
  getColumnSize,
  getVirtualItems,
  toggleSelectionRange,
  exportToCsv,
  downloadCsv,
  getSelectedRows,
  themeToCssVars,
  defaultDarkTheme,
  isEditableElement,
  type GridOptions,
  type Density,
  type GridTheme,
  type RowModel,
  type ColumnDef,
} from '@zineddinebk09/grid-core';
import { useDataGrid } from '../composables/useDataGrid';
import ColumnFilterBar from './ColumnFilterBar.vue';

export interface DataGridProps<T> extends GridOptions<T> {
  dark?: boolean;
  theme?: GridTheme;
  height?: number | string;
  showToolbar?: boolean;
  showPagination?: boolean;
  showColumnFilters?: boolean;
  showUndoRedo?: boolean;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<DataGridProps<T>>(), {
  dark: false,
  height: 500,
  showToolbar: true,
  showPagination: true,
  showColumnFilters: true,
  showUndoRedo: true,
  isLoading: false,
  enableRowSelection: false,
  enableColumnResizing: true,
  enableGlobalFilter: true,
});

const emit = defineEmits<{
  cellEdit: [rowId: string, columnId: string, value: unknown];
  rowSelectionChange: [selection: Record<string, boolean>];
}>();

const scrollRef = ref<HTMLElement | null>(null);
const dragColumnId = ref<string | null>(null);
const lastSelectedId = ref<string | null>(null);
const editValue = ref('');
const scrollTop = ref(0);

const gridOptions = computed(() => ({
  data: props.data,
  columns: props.columns,
  getRowId: props.getRowId,
  getSubRows: props.getSubRows,
  enableTreeData: props.enableTreeData,
  enableRowSelection: props.enableRowSelection,
  enableMultiRowSelection: props.enableMultiRowSelection,
  enableColumnResizing: props.enableColumnResizing,
  enableGrouping: props.enableGrouping,
  enableGlobalFilter: props.enableGlobalFilter,
  manualPagination: props.manualPagination,
  density: props.density,
  initialState: props.initialState,
  grouping: props.grouping,
}));

const { store, state, processed, orderedColumns, rowHeight } = useDataGrid(gridOptions);
const columns = computed(() => orderedColumns.value.all);

const densityClass = computed(() => {
  if (state.value.density === 'compact') return 'osdg-density-compact';
  if (state.value.density === 'comfortable') return 'osdg-density-comfortable';
  return '';
});

const gridThemeStyle = computed(() => {
  const t = props.theme ?? (props.dark ? defaultDarkTheme : undefined);
  return t ? themeToCssVars(t) : {};
});

const leftPinnedLastId = computed(() => orderedColumns.value.left.at(-1)?.id);
const rightPinnedFirstId = computed(() => orderedColumns.value.right[0]?.id);

const pinOffsets = computed(() => {
  const offsets: Record<string, number> = {};
  let leftOffset = props.enableRowSelection ? 48 : 0;
  for (const col of orderedColumns.value.left) {
    offsets[`left-${col.id}`] = leftOffset;
    leftOffset += getColumnSize(col, state.value.columnSizing);
  }
  let rightOffset = 0;
  for (const col of [...orderedColumns.value.right].reverse()) {
    offsets[`right-${col.id}`] = rightOffset;
    rightOffset += getColumnSize(col, state.value.columnSizing);
  }
  return offsets;
});

const canUndo = computed(() => state.value.editHistory.past.length > 0);
const canRedo = computed(() => state.value.editHistory.future.length > 0);

const virtualItems = computed(() =>
  getVirtualItems(
    scrollTop.value,
    scrollRef.value?.clientHeight ?? 500,
    processed.value.rows.length,
    rowHeight.value,
    10,
  ),
);

function onScroll(e: Event) {
  scrollTop.value = (e.target as HTMLElement).scrollTop;
}

function getSortDirection(columnId: string): 'asc' | 'desc' | false {
  const sort = state.value.sorting.find((s) => s.id === columnId);
  if (!sort) return false;
  return sort.desc ? 'desc' : 'asc';
}

function handleToggleSelection(rowId: string) {
  if (lastSelectedId.value && state.value.enableMultiRowSelection) {
    const ids = processed.value.rows.filter((r: RowModel<T>) => r.type === 'data').map((r) => r.id);
    const next = toggleSelectionRange(state.value.rowSelection, ids, lastSelectedId.value, rowId);
    store.getState().setRowSelection(next);
  } else {
    store.getState().toggleRowSelection(rowId);
  }
  lastSelectedId.value = rowId;
  emit('rowSelectionChange', store.getState().rowSelection);
}

function startEdit(_rowId: string, _columnId: string, value: unknown) {
  store.getState().setEditingCell({ rowId: _rowId, columnId: _columnId });
  editValue.value = String(value ?? '');
}

function commitEdit(rowId: string, columnId: string) {
  const row = state.value.data.find((r, i) => state.value.getRowId(r as T, i) === rowId);
  const col = state.value.columns.find((c) => c.id === columnId);
  if (row && col) {
    const prev = getCellValue(row as T, col as ColumnDef<T>);
    store.getState().pushEditHistory({
      rowId,
      columnId,
      previousValue: prev,
      nextValue: editValue.value,
    });
  }
  emit('cellEdit', rowId, columnId, editValue.value);
  store.getState().setEditingCell(null);
}

function handleUndo() {
  const action = store.getState().undo();
  if (action) emit('cellEdit', action.rowId, action.columnId, action.previousValue);
}

function handleRedo() {
  const action = store.getState().redo();
  if (action) emit('cellEdit', action.rowId, action.columnId, action.nextValue);
}

function pinClass(colId: string): string {
  const left = pinOffsets.value[`left-${colId}`];
  const right = pinOffsets.value[`right-${colId}`];
  let cls = '';
  if (left != null) {
    cls = 'osdg-cell--pinned-left';
    if (colId === leftPinnedLastId.value) cls += ' osdg-cell--pinned-left-last';
  }
  if (right != null) {
    cls = 'osdg-cell--pinned-right';
    if (colId === rightPinnedFirstId.value) cls += ' osdg-cell--pinned-right-first';
  }
  return cls;
}

function cellPinStyle(colId: string, width: number) {
  const style: Record<string, string> = {
    width: `${width}px`,
    minWidth: `${width}px`,
  };
  const left = pinOffsets.value[`left-${colId}`];
  const right = pinOffsets.value[`right-${colId}`];
  if (left != null) style.left = `${left}px`;
  if (right != null) style.right = `${right}px`;
  return style;
}

function isGroupingHeader(row: RowModel<T>) {
  return row.type === 'group' && row.original == null;
}

function isTreeParent(row: RowModel<T>) {
  return row.type === 'group' && row.original != null;
}

function handleExport() {
  const s = store.getState();
  const selected = getSelectedRows(s);
  const rows = selected.length > 0 ? selected : s.data;
  downloadCsv(exportToCsv(rows, s.columns), 'grid-export.csv');
}

function handleKeyDown(e: KeyboardEvent) {
  if (isEditableElement(e.target)) return;

  const s = state.value;
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    handleUndo();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) {
    e.preventDefault();
    handleRedo();
    return;
  }
  const focused = s.focusedCell ?? { rowIndex: 0, columnIndex: 0 };

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    store.getState().setFocusedCell({
      rowIndex: Math.min(processed.value.rows.length - 1, focused.rowIndex + 1),
      columnIndex: focused.columnIndex,
    });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    store.getState().setFocusedCell({
      rowIndex: Math.max(0, focused.rowIndex - 1),
      columnIndex: focused.columnIndex,
    });
  } else if (e.key === ' ' && s.enableRowSelection) {
    e.preventDefault();
    const row = processed.value.rows[focused.rowIndex];
    if (row?.type === 'data') handleToggleSelection(row.id);
  }
}

function reorderColumn(targetColumnId: string) {
  if (!dragColumnId.value || dragColumnId.value === targetColumnId) return;
  const order = [...state.value.columnOrder];
  const fromIdx = order.indexOf(dragColumnId.value);
  const toIdx = order.indexOf(targetColumnId);
  if (fromIdx === -1 || toIdx === -1) return;
  order.splice(fromIdx, 1);
  order.splice(toIdx, 0, dragColumnId.value);
  store.getState().setColumnOrder(order);
  dragColumnId.value = null;
}
</script>

<template>
  <div
    :class="['osdg-grid', dark ? 'osdg-grid--dark' : '', densityClass]"
    :style="{ height: typeof height === 'number' ? `${height}px` : height, ...gridThemeStyle }"
    role="grid"
    tabindex="0"
    :aria-busy="isLoading || state.isLoading"
    @keydown="handleKeyDown"
  >
    <div v-if="showToolbar" class="osdg-toolbar-wrap">
      <div class="osdg-toolbar" role="toolbar">
        <slot name="toolbar">
          <input
            v-if="state.enableGlobalFilter"
            type="search"
            class="osdg-input"
            placeholder="Search all columns..."
            :value="state.globalFilter"
            @input="store.getState().setGlobalFilter(($event.target as HTMLInputElement).value)"
          />
          <div style="flex: 1" />
          <template v-if="showUndoRedo">
            <button type="button" class="osdg-btn" :disabled="!canUndo" @click="handleUndo">↶ Undo</button>
            <button type="button" class="osdg-btn" :disabled="!canRedo" @click="handleRedo">↷ Redo</button>
          </template>
          <select
            class="osdg-input"
            :value="state.density"
            @change="store.getState().setDensity(($event.target as HTMLSelectElement).value as Density)"
          >
            <option value="compact">Compact</option>
            <option value="default">Default</option>
            <option value="comfortable">Comfortable</option>
          </select>
          <button type="button" class="osdg-btn osdg-btn--primary" @click="handleExport">Export CSV</button>
        </slot>
      </div>
      <ColumnFilterBar
        v-if="showColumnFilters"
        :store="store"
        :columns="(state.columns as ColumnDef<T>[])"
      />
    </div>

    <div ref="scrollRef" class="osdg-table-wrapper" style="position: relative" @scroll="onScroll">
      <div v-if="isLoading || state.isLoading" class="osdg-loading-overlay" role="status">
        <div class="osdg-loading-spinner" />
        Loading...
      </div>
      <table class="osdg-table">
        <thead class="osdg-header">
          <tr role="row">
            <th v-if="enableRowSelection" class="osdg-header-cell" style="width: 48px" role="columnheader">
              <input
                type="checkbox"
                class="osdg-checkbox"
                :checked="
                  processed.rows.filter((r: RowModel<T>) => r.type === 'data').length > 0 &&
                  processed.rows.filter((r: RowModel<T>) => r.type === 'data').every((r) => state.rowSelection[r.id])
                "
                @change="
                  store.getState().toggleAllRowsSelected(
                    processed.rows.filter((r: RowModel<T>) => r.type === 'data').map((r) => r.id),
                  )
                "
              />
            </th>
            <th
              v-for="col in columns"
              :key="col.id"
              :class="['osdg-header-cell', 'osdg-header-cell--sortable', pinClass(col.id)]"
              :style="cellPinStyle(col.id, getColumnSize(col, state.columnSizing))"
              role="columnheader"
              draggable="true"
              @click="store.getState().toggleSorting(col.id, true)"
              @dragstart="dragColumnId = col.id"
              @dragover.prevent
              @drop="reorderColumn(col.id)"
            >
              {{ col.header }}
              <span v-if="getSortDirection(col.id)" style="margin-left: 4px">
                {{ getSortDirection(col.id) === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody :style="{ height: `${processed.rows.length * rowHeight}px`, position: 'relative' }">
          <tr
            v-for="vItem in virtualItems"
            :key="processed.rows[vItem.index].id"
            :class="[
              'osdg-row',
              processed.rows[vItem.index].type === 'group' ? 'osdg-row--group' : '',
              state.rowSelection[processed.rows[vItem.index].id] ? 'osdg-row--selected' : '',
            ]"
            :style="{
              height: `${rowHeight}px`,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${vItem.start}px)`,
            }"
            role="row"
          >
            <template v-if="isGroupingHeader(processed.rows[vItem.index])">
              <td
                class="osdg-cell"
                :colspan="columns.length + (enableRowSelection ? 1 : 0)"
                :style="{ paddingLeft: `${12 + processed.rows[vItem.index].depth * 20}px`, cursor: 'pointer' }"
                @click="store.getState().toggleGroupExpanded(processed.rows[vItem.index].id)"
              >
                {{ processed.rows[vItem.index].isExpanded !== false ? '▼' : '▶' }}
                {{ processed.rows[vItem.index].groupValue }}
              </td>
            </template>
            <template v-else>
              <td v-if="enableRowSelection" class="osdg-cell" style="width: 48px; text-align: center">
                <input
                  type="checkbox"
                  class="osdg-checkbox"
                  :checked="!!state.rowSelection[processed.rows[vItem.index].id]"
                  @change="handleToggleSelection(processed.rows[vItem.index].id)"
                />
              </td>
              <td
                v-for="(col, colIndex) in columns"
                :key="col.id"
                :class="['osdg-cell', pinClass(col.id)]"
                :style="{
                  ...cellPinStyle(col.id, getColumnSize(col, state.columnSizing)),
                  paddingLeft: colIndex === 0 ? `${12 + processed.rows[vItem.index].depth * 20}px` : undefined,
                }"
                @dblclick="
                  startEdit(
                    processed.rows[vItem.index].id,
                    col.id,
                    getCellValue(processed.rows[vItem.index].original!, col),
                  )
                "
              >
                <template
                  v-if="
                    state.editingCell?.rowId === processed.rows[vItem.index].id &&
                    state.editingCell?.columnId === col.id
                  "
                >
                  <input
                    v-model="editValue"
                    class="osdg-input"
                    style="width: 100%"
                    @blur="commitEdit(processed.rows[vItem.index].id, col.id)"
                    @keydown.enter="commitEdit(processed.rows[vItem.index].id, col.id)"
                    @keydown.escape="store.getState().setEditingCell(null)"
                  />
                </template>
                <template v-else-if="$slots[`cell-${col.id}`]">
                  <slot
                    :name="`cell-${col.id}`"
                    :value="getCellValue(processed.rows[vItem.index].original!, col)"
                    :row="processed.rows[vItem.index].original"
                    :column-id="col.id"
                  />
                </template>
                <template v-else>
                  <span
                    v-if="isTreeParent(processed.rows[vItem.index]) && colIndex === 0"
                    style="margin-right: 8px; cursor: pointer"
                    @click.stop="store.getState().toggleTreeRowExpanded(processed.rows[vItem.index].id)"
                  >
                    {{ processed.rows[vItem.index].isExpanded !== false ? '▼' : '▶' }}
                  </span>
                  {{ getCellValue(processed.rows[vItem.index].original!, col) }}
                </template>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPagination" class="osdg-pagination" role="navigation">
      <span>
        {{ processed.rowCount > 0 ? `${state.pagination.pageIndex * state.pagination.pageSize + 1}–${Math.min((state.pagination.pageIndex + 1) * state.pagination.pageSize, processed.rowCount)} of ${processed.rowCount}` : 'No rows' }}
      </span>
      <div style="display: flex; align-items: center; gap: 8px">
        <button
          type="button"
          class="osdg-btn"
          :disabled="state.pagination.pageIndex === 0"
          @click="store.getState().setPageIndex(state.pagination.pageIndex - 1)"
        >
          ‹
        </button>
        <span>Page {{ state.pagination.pageIndex + 1 }} of {{ processed.pageCount }}</span>
        <button
          type="button"
          class="osdg-btn"
          :disabled="state.pagination.pageIndex >= processed.pageCount - 1"
          @click="store.getState().setPageIndex(state.pagination.pageIndex + 1)"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>
