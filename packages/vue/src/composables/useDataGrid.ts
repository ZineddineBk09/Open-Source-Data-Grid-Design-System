import { ref, watch, onUnmounted, computed, type Ref, type ComputedRef } from 'vue';
import {
  createGridStore,
  processGridData,
  getOrderedColumns,
  DENSITY_ROW_HEIGHT,
  type GridOptions,
  type GridState,
  type GridStore,
  type GridStoreInstance,
} from '@zineddinebk/grid-core';

type OptionsInput<T> = Ref<GridOptions<T>> | ComputedRef<GridOptions<T>> | GridOptions<T>;

function resolveOptions<T>(options: OptionsInput<T>): GridOptions<T> {
  if (typeof options === 'object' && options !== null && 'value' in options) {
    return options.value as GridOptions<T>;
  }
  return options as GridOptions<T>;
}

export function useDataGrid<T>(options: OptionsInput<T>) {
  const initial = resolveOptions(options);
  const store = createGridStore(initial) as GridStoreInstance<T>;
  const state = ref(store.getState() as GridStore<T>);

  const unsubscribe = store.subscribe((newState) => {
    state.value = newState as GridStore<T>;
  });

  if (typeof options === 'object' && options !== null && 'value' in options) {
    watch(
      options as Ref<GridOptions<T>>,
      (newOptions) => {
        if (newOptions.data !== state.value.data) store.getState().setData(newOptions.data);
        if (newOptions.columns !== state.value.columns) store.getState().setColumns(newOptions.columns);
      },
      { deep: true },
    );
  }

  onUnmounted(() => unsubscribe());

  const processed = computed(() => processGridData(state.value as GridState<T>));
  const orderedColumns = computed(() => getOrderedColumns(state.value as GridState<T>));
  const rowHeight = computed(() => DENSITY_ROW_HEIGHT[state.value.density]);

  return { store, state, processed, orderedColumns, rowHeight };
}

export type UseDataGridReturn<T> = ReturnType<typeof useDataGrid<T>>;
