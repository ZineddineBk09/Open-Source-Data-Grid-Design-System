import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataGrid, useDataGrid } from '@zineddinebk09/grid-react';
import { employeeColumns, type Employee } from '../../src/sampleData';
import { fetchServerData } from '../../src/mockApi';

function ServerSideGrid() {
  const [data, setData] = useState<Employee[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [rowCount, setRowCount] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { store, state } = useDataGrid<Employee>({
    data,
    columns: employeeColumns,
    getRowId: (row) => row.id,
    enableGlobalFilter: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount,
    initialState: { pagination: { pageIndex: 0, pageSize: 50 } },
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      store.getState().setIsLoading(true);
      try {
        const s = store.getState();
        const res = await fetchServerData({
          pageIndex: s.pagination.pageIndex,
          pageSize: s.pagination.pageSize,
          sorting: s.sorting,
          globalFilter: s.globalFilter,
          columnFilters: s.columnFilters,
        });
        if (!cancelled) {
          setData(res.rows);
          setPageCount(res.pageCount);
          setRowCount(res.rowCount);
          store.getState().setPageCount(res.pageCount);
        }
      } finally {
        if (!cancelled) store.getState().setIsLoading(false);
      }
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(load, state.globalFilter ? 350 : 0);

    return () => {
      cancelled = true;
    };
  }, [
    store,
    state.pagination.pageIndex,
    state.pagination.pageSize,
    state.sorting,
    state.globalFilter,
    state.columnFilters,
  ]);

  return (
    <div>
      <p style={{ margin: '0 0 12px', color: '#6b7280', fontSize: 14 }}>
        Mock API · 400–700ms latency · debounced search · {rowCount.toLocaleString()} matching rows
      </p>
      <DataGrid<Employee>
        data={data}
        columns={employeeColumns}
        getRowId={(row) => row.id}
        height={520}
        enableGlobalFilter
        showColumnFilters
        manualPagination
        manualSorting
        manualFiltering
        pageCount={pageCount}
        store={store}
      />
    </div>
  );
}

const meta: Meta = {
  title: 'React/ServerSide',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const MockApiWithLoading: Story = {
  render: () => <ServerSideGrid />,
};
