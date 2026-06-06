import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataGrid } from '@zineddinebk09/grid-react';
import { generateEmployees, employeeColumns, type Employee } from '../../src/sampleData';

const meta: Meta<typeof DataGrid> = {
  title: 'React/DataGrid',
  component: DataGrid,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof DataGrid<Employee>>;

const data1k = generateEmployees(1000);
const getRowId = (row: Employee) => row.id;

export const Basic: Story = {
  args: {
    data: data1k,
    columns: employeeColumns,
    getRowId,
    height: 500,
    enableGlobalFilter: true,
  },
};

export const VirtualScrollStressTest: Story = {
  args: {
    data: generateEmployees(100000),
    columns: employeeColumns,
    getRowId,
    height: 600,
    enableGlobalFilter: true,
    initialState: { pagination: { pageIndex: 0, pageSize: 100000 } },
    showPagination: false,
  },
};

export const WithRowSelection: Story = {
  args: {
    data: data1k,
    columns: employeeColumns,
    getRowId,
    height: 500,
    enableRowSelection: true,
    enableGlobalFilter: true,
  },
};

export const WithGrouping: Story = {
  args: {
    data: data1k,
    columns: employeeColumns,
    getRowId,
    height: 500,
    enableGrouping: true,
    grouping: ['department'],
    initialState: { pagination: { pageIndex: 0, pageSize: 100 } },
  },
};

export const PinnedColumns: Story = {
  args: {
    data: data1k,
    columns: [
      { ...employeeColumns[0], pin: 'left' as const },
      ...employeeColumns.slice(1, -1),
      { ...employeeColumns[employeeColumns.length - 1], pin: 'right' as const },
    ],
    getRowId,
    height: 500,
  },
};

export const InlineEditing: Story = {
  render: () => {
    const [data, setData] = React.useState(data1k.slice(0, 50));
    return (
      <DataGrid<Employee>
        data={data}
        columns={employeeColumns}
        getRowId={getRowId}
        height={500}
        onCellEdit={(rowId, columnId, value) => {
          setData((prev: Employee[]) =>
            prev.map((row: Employee) => (row.id === rowId ? { ...row, [columnId]: value } : row)),
          );
        }}
      />
    );
  },
};

export const CustomCellRenderers: Story = {
  args: {
    data: data1k.slice(0, 100),
    columns: employeeColumns.map((col: (typeof employeeColumns)[number]) =>
      col.id === 'status'
        ? {
            ...col,
            cell: ({ value }: { value: unknown }) => (
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 500,
                  backgroundColor:
                    value === 'Active' ? '#dcfce7' : value === 'Inactive' ? '#fee2e2' : '#fef3c7',
                  color: value === 'Active' ? '#166534' : value === 'Inactive' ? '#991b1b' : '#92400e',
                }}
              >
                {String(value)}
              </span>
            ),
          }
        : col.id === 'salary'
          ? {
              ...col,
              cell: ({ value }: { value: unknown }) => `$${Number(value).toLocaleString()}`,
            }
          : col,
    ),
    getRowId,
    height: 500,
  },
};

export const DarkMode: Story = {
  args: {
    data: data1k.slice(0, 100),
    columns: employeeColumns,
    getRowId,
    height: 500,
    dark: true,
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#111827', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
};

export const DensityVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['compact', 'default', 'comfortable'] as const).map((density) => (
        <div key={density}>
          <h3 style={{ margin: '0 0 8px', textTransform: 'capitalize' }}>{density}</h3>
          <DataGrid<Employee>
            data={data1k.slice(0, 20)}
            columns={employeeColumns.slice(0, 4)}
            getRowId={getRowId}
            height={200}
            density={density}
            showToolbar={false}
            showPagination={false}
          />
        </div>
      ))}
    </div>
  ),
};

export const MultiSortAndFilter: Story = {
  args: {
    data: data1k,
    columns: employeeColumns,
    getRowId,
    height: 500,
    enableGlobalFilter: true,
    initialState: {
      sorting: [
        { id: 'department', desc: false },
        { id: 'salary', desc: true },
      ],
      globalFilter: '',
    },
  },
};

export const KeyboardNavigation: Story = {
  args: {
    data: data1k.slice(0, 50),
    columns: employeeColumns,
    getRowId,
    height: 500,
    enableRowSelection: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the grid and use arrow keys to navigate, Space to select, Enter to edit.',
      },
    },
  },
};

export const ColumnFilters: Story = {
  args: {
    data: data1k,
    columns: employeeColumns,
    getRowId,
    height: 520,
    enableGlobalFilter: true,
    showColumnFilters: true,
  },
};

export const CustomTheme: Story = {
  args: {
    data: data1k.slice(0, 50),
    columns: employeeColumns.slice(0, 5),
    getRowId,
    height: 400,
    theme: {
      background: '#0f172a',
      text: '#f1f5f9',
      backgroundHeader: '#1e293b',
      backgroundHover: '#334155',
      backgroundSelected: '#1e3a5f',
      borderColor: '#475569',
      accent: '#38bdf8',
    },
  },
};

export const UndoRedoEditing: Story = {
  render: () => {
    const [data, setData] = React.useState(data1k.slice(0, 30));
    return (
      <div>
        <p style={{ margin: '0 0 8px', fontSize: 14, color: '#6b7280' }}>
          Double-click to edit · Ctrl+Z undo · Ctrl+Shift+Z redo · Toolbar buttons also work
        </p>
        <DataGrid<Employee>
          data={data}
          columns={employeeColumns.slice(0, 4)}
          getRowId={getRowId}
          height={420}
          onCellEdit={(rowId, columnId, value) => {
            setData((prev) =>
              prev.map((row) => (row.id === rowId ? { ...row, [columnId]: value } : row)),
            );
          }}
        />
      </div>
    );
  },
};
