import { useCallback, useRef } from 'react';
import type { GridStore } from '@zineddinebk09/grid-core';

interface UseColumnResizeOptions {
  columnId: string;
  store: { getState: () => GridStore<unknown> };
  minSize?: number;
  maxSize?: number;
}

export function useColumnResize({ columnId, store, minSize = 50, maxSize = 600 }: UseColumnResizeOptions) {
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startX.current = e.clientX;
      const sizing = store.getState().columnSizing[columnId];
      const column = store.getState().columns.find((c) => c.id === columnId);
      startWidth.current = sizing ?? column?.size ?? 150;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX.current;
        const newSize = Math.max(minSize, Math.min(maxSize, startWidth.current + delta));
        store.getState().setColumnSizing(columnId, newSize);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [columnId, store, minSize, maxSize],
  );

  return { onMouseDown };
}
