import type { VirtualItem, VirtualRange } from '../types';

export function getVirtualRange(
  scrollTop: number,
  viewportHeight: number,
  itemCount: number,
  itemSize: number,
  overscan = 5,
): VirtualRange {
  if (itemCount === 0) {
    return { startIndex: 0, endIndex: 0, totalSize: 0, offsetY: 0 };
  }

  const totalSize = itemCount * itemSize;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemSize) - overscan);
  const visibleCount = Math.ceil(viewportHeight / itemSize);
  const endIndex = Math.min(itemCount - 1, startIndex + visibleCount + overscan * 2);
  const offsetY = startIndex * itemSize;

  return { startIndex, endIndex, totalSize, offsetY };
}

export function getVirtualItems(
  scrollTop: number,
  viewportHeight: number,
  itemCount: number,
  itemSize: number,
  overscan = 5,
): VirtualItem[] {
  const { startIndex, endIndex } = getVirtualRange(
    scrollTop,
    viewportHeight,
    itemCount,
    itemSize,
    overscan,
  );

  const items: VirtualItem[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    items.push({
      index: i,
      start: i * itemSize,
      size: itemSize,
    });
  }

  return items;
}

export function estimateTotalHeight(itemCount: number, itemSize: number): number {
  return itemCount * itemSize;
}
