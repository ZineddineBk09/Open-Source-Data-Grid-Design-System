import type { Meta, StoryObj } from '@storybook/react';
import { DataGrid } from '@zineddinebk09/grid-react';
import { generateEmployees, employeeColumns, type Employee } from '../../src/sampleData';

interface OrgNode {
  id: string;
  name: string;
  role: string;
  headcount: number;
  children?: OrgNode[];
}

const orgTree: OrgNode[] = [
  {
    id: 'eng',
    name: 'Engineering',
    role: 'Department',
    headcount: 120,
    children: [
      {
        id: 'platform',
        name: 'Platform',
        role: 'Team',
        headcount: 40,
        children: [
          { id: 'p1', name: 'Alice Chen', role: 'Staff Engineer', headcount: 1 },
          { id: 'p2', name: 'Bob Smith', role: 'Senior Engineer', headcount: 1 },
        ],
      },
      {
        id: 'product-eng',
        name: 'Product Engineering',
        role: 'Team',
        headcount: 80,
        children: [
          { id: 'pe1', name: 'Carol Diaz', role: 'Engineering Manager', headcount: 1 },
          { id: 'pe2', name: 'Dan Lee', role: 'Senior Engineer', headcount: 1 },
        ],
      },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    role: 'Department',
    headcount: 45,
    children: [
      { id: 's1', name: 'Eve Park', role: 'Account Executive', headcount: 1 },
      { id: 's2', name: 'Frank Wu', role: 'Account Executive', headcount: 1 },
    ],
  },
];

const treeColumns = [
  { id: 'name', accessorKey: 'name' as const, header: 'Name', enableSorting: true },
  { id: 'role', accessorKey: 'role' as const, header: 'Role' },
  { id: 'headcount', accessorKey: 'headcount' as const, header: 'Headcount' },
];

const meta: Meta = {
  title: 'React/TreeData',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const ExpandableHierarchy: Story = {
  render: () => (
    <DataGrid<OrgNode>
      data={orgTree}
      columns={treeColumns}
      getRowId={(row) => row.id}
      getSubRows={(row) => row.children}
      enableTreeData
      height={400}
      showPagination={false}
    />
  ),
};

export const TreeWithEmployees: Story = {
  render: () => {
    const flat = generateEmployees(50);
    const byDept = new Map<string, Employee[]>();
    for (const e of flat) {
      const list = byDept.get(e.department) ?? [];
      list.push(e);
      byDept.set(e.department, list);
    }
    const tree: (Employee & { children?: Employee[] })[] = [];
    for (const [dept, rows] of byDept) {
      tree.push({
        ...rows[0],
        id: `dept-${dept}`,
        name: dept,
        children: rows.slice(0, 5),
      });
    }
    return (
      <DataGrid
        data={tree}
        columns={employeeColumns.slice(0, 4)}
        getRowId={(row) => row.id}
        getSubRows={(row) => row.children}
        enableTreeData
        height={450}
      />
    );
  },
};
