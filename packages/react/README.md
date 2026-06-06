# @zineddinebk/grid-react

React adapter for the [Open-Source Data Grid Design System](https://github.com/ZineddineBk09/Open-Source-Data-Grid-Design-System) — a headless, enterprise-grade data grid for large datasets.

**[Live demo](https://zineddinebk.github.io/Open-Source-Data-Grid-Design-System/)** · **[Storybook](https://zineddinebk.github.io/Open-Source-Data-Grid-Design-System/storybook/)** · **[Source](https://github.com/ZineddineBk09/Open-Source-Data-Grid-Design-System)**

## Install

```bash
npm install @zineddinebk/grid-react @zineddinebk/grid-tailwind-preset
# or
pnpm add @zineddinebk/grid-react @zineddinebk/grid-tailwind-preset
```

## Quick start

```tsx
import { DataGrid } from '@zineddinebk/grid-react';
import '@zineddinebk/grid-react/styles.css';

const columns = [
  { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
  { id: 'email', accessorKey: 'email', header: 'Email' },
];

<DataGrid
  data={rows}
  columns={columns}
  getRowId={(row) => row.id}
  enableRowSelection
  enableGlobalFilter
  showColumnFilters
  height={500}
/>
```

## Features

- Virtual scrolling (100k+ rows)
- Column sort, filter, resize, reorder, and pinning
- Row selection, grouping, and tree data
- Inline editing with undo/redo
- Server-side pagination/sort/filter mode
- CSV export, theming API, keyboard navigation, ARIA grid roles

## Related packages

| Package | Description |
|---------|-------------|
| [`@zineddinebk/grid-core`](https://www.npmjs.com/package/@zineddinebk/grid-core) | Headless grid engine (Zustand + pure pipeline) |
| [`@zineddinebk/grid-vue`](https://www.npmjs.com/package/@zineddinebk/grid-vue) | Vue 3 adapter |
| [`@zineddinebk/grid-tailwind-preset`](https://www.npmjs.com/package/@zineddinebk/grid-tailwind-preset) | Shared Tailwind design tokens |

## Tailwind setup

Add the preset to your Tailwind config:

```js
import gridPreset from '@zineddinebk/grid-tailwind-preset';

export default {
  presets: [gridPreset],
};
```

## License

MIT
