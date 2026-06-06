# @zineddinebk/grid-vue

Vue 3 adapter for the [Open-Source Data Grid Design System](https://github.com/ZineddineBk09/Open-Source-Data-Grid-Design-System) — a headless, enterprise-grade data grid for large datasets.

**[Live demo](https://zineddinebk.github.io/Open-Source-Data-Grid-Design-System/)** · **[Storybook](https://zineddinebk.github.io/Open-Source-Data-Grid-Design-System/storybook/)** · **[Source](https://github.com/ZineddineBk09/Open-Source-Data-Grid-Design-System)**

## Install

```bash
npm install @zineddinebk/grid-vue @zineddinebk/grid-tailwind-preset
# or
pnpm add @zineddinebk/grid-vue @zineddinebk/grid-tailwind-preset
```

## Quick start

```vue
<script setup>
import { DataGrid } from '@zineddinebk/grid-vue';
import '@zineddinebk/grid-vue/styles.css';

const columns = [
  { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
  { id: 'email', accessorKey: 'email', header: 'Email' },
];
</script>

<template>
  <DataGrid
    :data="rows"
    :columns="columns"
    :get-row-id="(row) => row.id"
    :enable-row-selection="true"
    :show-column-filters="true"
    :height="500"
  />
</template>
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
| [`@zineddinebk/grid-react`](https://www.npmjs.com/package/@zineddinebk/grid-react) | React adapter |
| [`@zineddinebk/grid-tailwind-preset`](https://www.npmjs.com/package/@zineddinebk/grid-tailwind-preset) | Shared Tailwind design tokens |

## License

MIT
