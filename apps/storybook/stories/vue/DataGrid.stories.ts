import type { Meta, StoryObj } from '@storybook/vue3';
import { DataGrid } from '@zineddinebk09/grid-vue';
import { generateEmployees, employeeColumns, type Employee } from '../../src/sampleData';

const meta = {
  title: 'Vue/DataGrid',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const data1k = generateEmployees(1000);
const getRowId = (row: Employee) => row.id;

export const Basic: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { data: data1k, columns: employeeColumns, getRowId };
    },
    template:
      '<DataGrid :data="data" :columns="columns" :get-row-id="getRowId" :height="500" :enable-global-filter="true" />',
  }),
};

export const WithRowSelection: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { data: data1k, columns: employeeColumns, getRowId };
    },
    template:
      '<DataGrid :data="data" :columns="columns" :get-row-id="getRowId" :height="500" :enable-row-selection="true" />',
  }),
};

export const WithGrouping: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { data: data1k, columns: employeeColumns, getRowId };
    },
    template:
      '<DataGrid :data="data" :columns="columns" :get-row-id="getRowId" :height="500" :enable-grouping="true" :grouping="[\'department\']" />',
  }),
};

export const CustomCellSlot: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { data: data1k.slice(0, 100), columns: employeeColumns, getRowId };
    },
    template: `
      <DataGrid :data="data" :columns="columns" :get-row-id="getRowId" :height="500">
        <template #cell-status="{ value }">
          <span :style="{
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '12px',
            backgroundColor: value === 'Active' ? '#dcfce7' : '#fee2e2',
            color: value === 'Active' ? '#166534' : '#991b1b',
          }">{{ value }}</span>
        </template>
      </DataGrid>
    `,
  }),
};

export const VirtualScrollStressTest: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return {
        data: generateEmployees(100000),
        columns: employeeColumns,
        getRowId,
      };
    },
    template:
      '<DataGrid :data="data" :columns="columns" :get-row-id="getRowId" :height="600" :show-pagination="false" :initial-state="{ pagination: { pageIndex: 0, pageSize: 100000 } }" />',
  }),
};

export const InlineEditing: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { data: data1k.slice(0, 50), columns: employeeColumns, getRowId };
    },
    template:
      '<DataGrid :data="data" :columns="columns" :get-row-id="getRowId" :height="500" @cell-edit="() => {}" />',
  }),
};

export const DarkMode: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { data: data1k.slice(0, 100), columns: employeeColumns, getRowId };
    },
    template: `
      <div style="background: #111827; padding: 16px; border-radius: 8px">
        <DataGrid :data="data" :columns="columns" :get-row-id="getRowId" :height="500" :dark="true" />
      </div>
    `,
  }),
};

export const PinnedColumns: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      const cols = [
        { ...employeeColumns[0], pin: 'left' as const },
        ...employeeColumns.slice(1, -1),
        { ...employeeColumns[employeeColumns.length - 1], pin: 'right' as const },
      ];
      return { data: data1k, columns: cols, getRowId };
    },
    template: '<DataGrid :data="data" :columns="columns" :get-row-id="getRowId" :height="500" />',
  }),
};

export const DensityVariants: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return {
        data: data1k.slice(0, 20),
        columns: employeeColumns.slice(0, 4),
        getRowId,
        densities: ['compact', 'default', 'comfortable'] as const,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <div v-for="density in densities" :key="density">
          <h3 style="margin: 0 0 8px; text-transform: capitalize">{{ density }}</h3>
          <DataGrid :data="data" :columns="columns" :get-row-id="getRowId" :height="200" :density="density" :show-toolbar="false" :show-pagination="false" />
        </div>
      </div>
    `,
  }),
};

export const RowSelectionToolbar: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { data: data1k, columns: employeeColumns, getRowId };
    },
    template:
      '<DataGrid :data="data" :columns="columns" :get-row-id="getRowId" :height="500" :enable-row-selection="true" :enable-global-filter="true" />',
  }),
};
