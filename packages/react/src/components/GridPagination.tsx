import type { GridStore } from '@zineddinebk09/grid-core';

interface GridPaginationProps<T> {
  store: { getState: () => GridStore<T> };
  pageCount: number;
  rowCount: number;
}

export function GridPagination<T>({ store, pageCount, rowCount }: GridPaginationProps<T>) {
  const state = store.getState();
  const { pageIndex, pageSize } = state.pagination;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, rowCount);

  return (
    <div className="osdg-pagination" role="navigation" aria-label="Pagination">
      <span>
        {rowCount > 0 ? `${start}–${end} of ${rowCount}` : 'No rows'}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Rows per page:
          <select
            className="osdg-input"
            value={pageSize}
            onChange={(e) => state.setPageSize(Number(e.target.value))}
            aria-label="Rows per page"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="osdg-btn"
          disabled={pageIndex === 0}
          onClick={() => state.setPageIndex(0)}
          aria-label="First page"
        >
          «
        </button>
        <button
          type="button"
          className="osdg-btn"
          disabled={pageIndex === 0}
          onClick={() => state.setPageIndex(pageIndex - 1)}
          aria-label="Previous page"
        >
          ‹
        </button>
        <span>
          Page {pageIndex + 1} of {pageCount}
        </span>
        <button
          type="button"
          className="osdg-btn"
          disabled={pageIndex >= pageCount - 1}
          onClick={() => state.setPageIndex(pageIndex + 1)}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          type="button"
          className="osdg-btn"
          disabled={pageIndex >= pageCount - 1}
          onClick={() => state.setPageIndex(pageCount - 1)}
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </div>
  );
}
