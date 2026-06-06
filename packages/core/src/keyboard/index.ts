import type { FocusedCell, KeyboardCommand } from '../types';

const KEY_MAP: Record<string, KeyboardCommand> = {
  ArrowUp: 'moveUp',
  ArrowDown: 'moveDown',
  ArrowLeft: 'moveLeft',
  ArrowRight: 'moveRight',
  ' ': 'selectRow',
  Enter: 'editCell',
  Escape: 'cancelEdit',
  PageUp: 'pageUp',
  PageDown: 'pageDown',
};

export function getKeyboardCommand(
  key: string,
  ctrlKey: boolean,
  shiftKey: boolean,
): KeyboardCommand | null {
  if (ctrlKey && key.toLowerCase() === 'a') {
    return 'selectAll';
  }

  if (key === 'Enter' && shiftKey) {
    return 'commitEdit';
  }

  return KEY_MAP[key] ?? null;
}

export function moveFocus(
  current: FocusedCell,
  command: KeyboardCommand,
  rowCount: number,
  columnCount: number,
): FocusedCell {
  const { rowIndex, columnIndex } = current;

  switch (command) {
    case 'moveUp':
      return { rowIndex: Math.max(0, rowIndex - 1), columnIndex };
    case 'moveDown':
      return { rowIndex: Math.min(rowCount - 1, rowIndex + 1), columnIndex };
    case 'moveLeft':
      return { rowIndex, columnIndex: Math.max(0, columnIndex - 1) };
    case 'moveRight':
      return { rowIndex, columnIndex: Math.min(columnCount - 1, columnIndex + 1) };
    case 'pageUp':
      return { rowIndex: Math.max(0, rowIndex - 10), columnIndex };
    case 'pageDown':
      return { rowIndex: Math.min(rowCount - 1, rowIndex + 10), columnIndex };
    default:
      return current;
  }
}
