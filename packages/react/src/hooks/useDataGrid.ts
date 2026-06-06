import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import {
  createGridStore,
  processGridData,
  getOrderedColumns,
  DENSITY_ROW_HEIGHT,
  type GridOptions,
  type GridStore,
  type GridStoreInstance,
} from '@zineddinebk/grid-core';

export function useDataGrid<T>(options: GridOptions<T>, externalStore?: GridStoreInstance<T>) {
  const storeRef = useRef<GridStoreInstance<T> | null>(externalStore ?? null);
  const optionsRef = useRef(options);

  if (!storeRef.current) {
    storeRef.current = externalStore ?? createGridStore(options);
  }

  useEffect(() => {
    const prev = optionsRef.current;
    optionsRef.current = options;
    const store = storeRef.current!;

    if (prev.data !== options.data) store.getState().setData(options.data);
    if (prev.columns !== options.columns) store.getState().setColumns(options.columns);
  }, [options]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => storeRef.current!.subscribe(onStoreChange),
    [],
  );

  const getSnapshot = useCallback(() => storeRef.current!.getState(), []);
  const getServerSnapshot = getSnapshot;

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const processed = useMemo(() => processGridData(state), [state]);
  const orderedColumns = useMemo(() => getOrderedColumns(state), [state]);
  const rowHeight = DENSITY_ROW_HEIGHT[state.density];

  return {
    store: storeRef.current,
    state: state as GridStore<T>,
    processed,
    orderedColumns,
    rowHeight,
  };
}

export type UseDataGridReturn<T> = ReturnType<typeof useDataGrid<T>>;
