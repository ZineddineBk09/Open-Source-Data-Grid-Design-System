export interface EditAction {
  rowId: string;
  columnId: string;
  previousValue: unknown;
  nextValue: unknown;
}

export interface EditHistoryState {
  past: EditAction[];
  future: EditAction[];
}

export function createEditHistory(): EditHistoryState {
  return { past: [], future: [] };
}

export function pushEdit(
  history: EditHistoryState,
  action: EditAction,
  maxSize = 50,
): EditHistoryState {
  const past = [...history.past, action].slice(-maxSize);
  return { past, future: [] };
}

export function undoEdit(history: EditHistoryState): {
  history: EditHistoryState;
  action: EditAction | null;
} {
  if (history.past.length === 0) return { history, action: null };
  const action = history.past[history.past.length - 1];
  return {
    history: {
      past: history.past.slice(0, -1),
      future: [action, ...history.future],
    },
    action,
  };
}

export function redoEdit(history: EditHistoryState): {
  history: EditHistoryState;
  action: EditAction | null;
} {
  if (history.future.length === 0) return { history, action: null };
  const action = history.future[0];
  return {
    history: {
      past: [...history.past, action],
      future: history.future.slice(1),
    },
    action,
  };
}
