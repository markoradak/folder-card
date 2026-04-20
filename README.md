# folder-card

Animated folder-style card component for React. FLIP spring expansion, 3D lid rotation, SVG notch masks, and a render props API.

- **Package:** [`@markoradak/folder-card`](./packages/react) — full API docs and usage
- **Demo site:** [`apps/web`](./apps/web) — live examples
- **License:** MIT

## Repository layout

```
packages/
  react/          @markoradak/folder-card — publishable React package
apps/
  web/            Next.js demo + documentation site
```

## Development

Requires Node 18+ and pnpm 10+.

```bash
pnpm install
pnpm dev          # run the demo site + package in watch mode
pnpm build        # build the package
pnpm typecheck    # typecheck all workspaces
```

Tests live in `packages/react`:

```bash
cd packages/react
pnpm test
```

## Installation

```bash
pnpm add @markoradak/folder-card motion
```

See [`packages/react/README.md`](./packages/react/README.md) for the full API.
