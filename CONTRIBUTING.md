# Contributing to OSDG

Thank you for your interest in contributing to the Open-Source Data Grid Design System!

## Development Setup

```bash
pnpm install
pnpm build
pnpm dev        # run all packages in watch mode
pnpm storybook  # launch Storybook on port 6006
pnpm test       # run tests
pnpm typecheck  # TypeScript check
```

## Project Structure

- `packages/core` — Headless grid engine (Zustand store, data pipeline, utilities)
- `packages/react` — React `<DataGrid />` component and hooks
- `packages/vue` — Vue `<DataGrid />` component and composables
- `packages/tailwind-preset` — Shared design tokens and Tailwind plugin
- `apps/storybook` — Component documentation and showcase stories
- `apps/demo` — Live demo app for GitHub Pages

## Guidelines

1. **Keep core framework-agnostic** — All grid logic belongs in `@zineddinebk/grid-core`
2. **Maintain React/Vue parity** — New features should work in both adapters
3. **Add Storybook stories** — Every new feature needs a story demonstrating it
4. **Write tests** — Core pipeline functions require Vitest unit tests
5. **Follow existing conventions** — Match naming, types, and patterns in the codebase

## Pull Request Process

1. Fork the repository and create a feature branch
2. Make your changes with tests and stories
3. Run `pnpm typecheck && pnpm test && pnpm lint`
4. Submit a PR with a clear description of the changes

## Code Style

- TypeScript strict mode
- Prettier for formatting (`pnpm format`)
- ESLint flat config
