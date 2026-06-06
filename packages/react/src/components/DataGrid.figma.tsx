import figma from '@figma/code-connect';
import { DataGrid } from './DataGrid';

/**
 * Figma Code Connect — map your Figma DataGrid component to this snippet.
 * Install: npx figma connect publish
 * Docs: https://www.figma.com/code-connect-docs/
 */
figma.connect(DataGrid, '<FIGMA_DATA_GRID_NODE_URL>', {
  props: {
    dark: figma.boolean('Dark mode'),
    height: figma.enum('Size', {
      Small: 400,
      Medium: 500,
      Large: 600,
    }),
  },
  example: ({ dark, height }) => (
    <DataGrid
      dark={dark}
      height={height}
      data={[]}
      columns={[
        { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
        { id: 'email', accessorKey: 'email', header: 'Email' },
      ]}
      getRowId={(row: { id: string }) => row.id}
      enableRowSelection
      enableGlobalFilter
      showColumnFilters
    />
  ),
});
