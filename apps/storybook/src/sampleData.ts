export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  status: 'Active' | 'Inactive' | 'On Leave';
  startDate: string;
  location: string;
}

const departments = ['Engineering', 'Sales', 'Marketing', 'Support', 'HR', 'Finance'];
const roles = ['Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Director'];
const statuses: Employee['status'][] = ['Active', 'Inactive', 'On Leave'];
const locations = ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Remote'];
const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore'];

export function generateEmployees(count: number): Employee[] {
  return Array.from({ length: count }, (_, i) => {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const name = `${first} ${last}${i >= 100 ? ` ${i}` : ''}`;
    return {
      id: String(i + 1),
      name,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@company.com`,
      department: departments[i % departments.length],
      role: roles[i % roles.length],
      salary: 50000 + (i % 20) * 5000 + Math.floor(i / 100) * 1000,
      status: statuses[i % statuses.length],
      startDate: new Date(2020 + (i % 5), i % 12, (i % 28) + 1).toISOString().split('T')[0],
      location: locations[i % locations.length],
    };
  });
}

export const employeeColumns = [
  { id: 'name', accessorKey: 'name' as const, header: 'Name', enableSorting: true, size: 180 },
  { id: 'email', accessorKey: 'email' as const, header: 'Email', enableSorting: true, size: 220 },
  { id: 'department', accessorKey: 'department' as const, header: 'Department', enableSorting: true, enableGrouping: true, size: 140 },
  { id: 'role', accessorKey: 'role' as const, header: 'Role', enableSorting: true, size: 120 },
  { id: 'salary', accessorKey: 'salary' as const, header: 'Salary', enableSorting: true, size: 110 },
  { id: 'status', accessorKey: 'status' as const, header: 'Status', enableSorting: true, size: 110 },
  { id: 'location', accessorKey: 'location' as const, header: 'Location', enableSorting: true, size: 130 },
  { id: 'startDate', accessorKey: 'startDate' as const, header: 'Start Date', enableSorting: true, size: 120 },
];

export const sampleEmployees = generateEmployees(1000);
