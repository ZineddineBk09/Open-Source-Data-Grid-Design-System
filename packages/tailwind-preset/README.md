# @zineddinebk/grid-tailwind-preset

Tailwind CSS preset and base styles for the [Open-Source Data Grid Design System](https://github.com/ZineddineBk09/Open-Source-Data-Grid-Design-System).

**[Live demo](https://zineddinebk.github.io/Open-Source-Data-Grid-Design-System/)** · **[Source](https://github.com/ZineddineBk09/Open-Source-Data-Grid-Design-System)**

## Install

```bash
npm install @zineddinebk/grid-tailwind-preset @zineddinebk/grid-react
# or
pnpm add @zineddinebk/grid-tailwind-preset @zineddinebk/grid-react
```

## Setup

Add the preset to your Tailwind config:

```js
import gridPreset from '@zineddinebk/grid-tailwind-preset';

export default {
  presets: [gridPreset],
};
```

Import component styles in your app:

```tsx
import '@zineddinebk/grid-react/styles.css';
```

The preset provides design tokens (spacing, colors, typography) used by `@zineddinebk/grid-react` and `@zineddinebk/grid-vue`.

## Peer dependency

Requires **Tailwind CSS v4+**.

## License

MIT
