import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DataGrid from '../components/DataGrid.vue';
import { generateEmployees, employeeColumns } from '../data/sampleData';

describe('DataGrid', () => {
  it('renders grid with data', () => {
    const data = generateEmployees(10);
    const wrapper = mount(DataGrid, {
      props: {
        data,
        columns: employeeColumns,
        getRowId: (row: { id: string }) => row.id,
        height: 400,
      },
    });

    expect(wrapper.find('[role="grid"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Name');
    expect(wrapper.text()).toContain(data[0].name);
  });
});
