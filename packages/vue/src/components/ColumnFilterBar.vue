<script setup lang="ts" generic="T">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { ColumnDef, FilterOperator, GridStore } from '@zineddinebk/grid-core';

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Equals' },
  { value: 'gt', label: 'Greater than' },
  { value: 'lt', label: 'Less than' },
  { value: 'gte', label: '≥' },
  { value: 'lte', label: '≤' },
];

const props = defineProps<{
  store: { getState: () => GridStore<T>; subscribe: (fn: () => void) => () => void };
  columns: ColumnDef<T>[];
}>();

const snap = ref(props.store.getState());
let unsub: (() => void) | undefined;

onMounted(() => {
  unsub = props.store.subscribe(() => {
    snap.value = props.store.getState();
  });
});

onUnmounted(() => unsub?.());

const filterable = computed(() => props.columns.filter((c) => c.enableFiltering !== false));
</script>

<template>
  <div v-if="filterable.length" class="osdg-filter-bar" role="group" aria-label="Column filters">
    <label v-for="column in filterable" :key="column.id" class="osdg-filter-item">
      <span class="osdg-filter-label">{{ column.header }}</span>
      <select
        class="osdg-input osdg-filter-operator"
        :value="snap.columnFilters.find((f) => f.id === column.id)?.operator ?? 'contains'"
        @change="
          store.getState().setColumnFilter(
            column.id,
            ($event.target as HTMLSelectElement).value as FilterOperator,
            snap.columnFilters.find((f) => f.id === column.id)?.value ?? '',
          )
        "
      >
        <option v-for="op in OPERATORS" :key="op.value" :value="op.value">{{ op.label }}</option>
      </select>
      <input
        class="osdg-input osdg-filter-value"
        type="text"
        :value="String(snap.columnFilters.find((f) => f.id === column.id)?.value ?? '')"
        :placeholder="`Filter ${column.header}...`"
        @input="
          store.getState().setColumnFilter(
            column.id,
            (snap.columnFilters.find((f) => f.id === column.id)?.operator ?? 'contains') as FilterOperator,
            ($event.target as HTMLInputElement).value,
          )
        "
      />
    </label>
    <button
      v-if="snap.columnFilters.length"
      type="button"
      class="osdg-btn"
      @click="store.getState().setColumnFilters([])"
    >
      Clear filters
    </button>
  </div>
</template>
