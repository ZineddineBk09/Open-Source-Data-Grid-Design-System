# @zineddinebk/grid-core

Headless data grid engine for the [Open-Source Data Grid Design System](https://github.com/ZineddineBk09/Open-Source-Data-Grid-Design-System). Framework-agnostic state, data pipeline, and utilities used by the React and Vue adapters.

**[Live demo](https://zineddinebk09.github.io/Open-Source-Data-Grid-Design-System/)** · **[Storybook](https://zineddinebk09.github.io/Open-Source-Data-Grid-Design-System/storybook/)** · **[Source](https://github.com/ZineddineBk09/Open-Source-Data-Grid-Design-System)

## Install

Most apps should use a UI adapter instead:

```bash
npm install @zineddinebk/grid-react   # React
npm install @zineddinebk/grid-vue     # Vue
```

Use the core package directly when building a custom renderer or non-React/Vue integration:

```bash
npm install @zineddinebk/grid-core
```

## What's included

- **Zustand store** — sort, filter, selection, pagination, column state
- **Data pipeline** — filter → group → sort → paginate (pure functions)
- **Tree data** — nested row expansion via `getSubRows`
- **Edit history** — undo/redo for inline cell edits
- **CSV export**, keyboard navigation helpers, virtual scroll math
- **Theming types** — CSS variable / theme object contracts

## Example

```ts
import { createGridStore } from '@zineddinebk/grid-core';

const store = createGridStore({
  data: rows,
  columns,
  getRowId: (row) => row.id,
});

store.getState().setSorting([{ id: 'name', desc: false }]);
```

## Related packages

| Package | Description |
|---------|-------------|
| [`@zineddinebk/grid-react`](https://www.npmjs.com/package/@zineddinebk/grid-react) | React `DataGrid` component |
| [`@zineddinebk/grid-vue`](https://www.npmjs.com/package/@zineddinebk/grid-vue) | Vue `DataGrid` component |

## License

MIT
