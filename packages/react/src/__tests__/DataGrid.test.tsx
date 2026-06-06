import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataGrid } from '../components/DataGrid';
import { generateEmployees, employeeColumns } from '../data/sampleData';

describe('DataGrid', () => {
  it('renders grid with data', () => {
    const data = generateEmployees(10);
    render(
      <DataGrid
        data={data}
        columns={employeeColumns}
        getRowId={(row) => row.id}
        height={400}
      />,
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /department/i })).toBeInTheDocument();
  });

  it('renders toolbar with search', () => {
    const data = generateEmployees(5);
    render(
      <DataGrid
        data={data}
        columns={employeeColumns}
        getRowId={(row) => row.id}
        enableGlobalFilter
        height={400}
      />,
    );

    expect(screen.getByPlaceholderText('Search all columns...')).toBeInTheDocument();
  });
});
