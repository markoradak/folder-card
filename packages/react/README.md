# @markoradak/folder-card

Animated folder-style cards for React. FLIP spring expansion, 3D lid rotation, SVG notch masks, and a render props API.

## Install

```bash
npm install @markoradak/folder-card motion
```

## Quick start

```tsx
import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";
import "@markoradak/folder-card/styles.css";

function App() {
  return (
    <FolderCardGroup>
      <FolderCard
        id="example"
        renderLid={() => (
          <div style={{ padding: 24 }}>
            <h3>Project Alpha</h3>
            <p>Click to expand</p>
          </div>
        )}
        renderDetail={(close) => (
          <div style={{ padding: 32 }}>
            <h2>Project Alpha</h2>
            <FolderCardItem>
              <p>Stagger-animated content.</p>
            </FolderCardItem>
            <button onClick={close}>Close</button>
          </div>
        )}
      />
    </FolderCardGroup>
  );
}
```

## Features

- **FLIP spring animation** — Cards spring from grid position to centered dialog using Framer Motion physics.
- **3D lid rotation** — Perspective-correct rotation on any edge (bottom, top, left, right, or auto).
- **SVG notch mask** — Folder-style tab cutouts at any corner or edge center with configurable radii.
- **Render props API** — Full control over card face, detail content, and tab. No opinionated markup.
- **Stagger animations** — `FolderCardItem` wraps content for automatic staggered fade-in.
- **CSS variable theming** — Override `--fc-*` variables for colors, radii, shadows, and transitions.

## Components

### `<FolderCardGroup>`

Wraps all cards and manages shared state (which card is open, spring config, etc).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `springConfig` | `{ stiffness?: number; damping?: number }` | `{ stiffness: 320, damping: 42 }` | Spring physics for position/size and lid rotation |
| `dialogViewportPadding` | `number` | `32` | Padding (px) between dialog and viewport edge |
| `contentRevealDelay` | `number` | `200` | Delay (ms) before dialog content fades in |
| `openAngle` | `number` | per-hinge default | Override the default open angle (deg) for lid rotation |
| `backdropDuration` | `number` | `0.25` | Duration (s) of backdrop fade |
| `exitDuration` | `number` | `0.15` | Duration (s) of content fade-out on close |
| `fadeLid` | `boolean` | `false` | Fade lid out instead of 3D rotation |
| `backdropClassName` | `string` | — | Class name for the backdrop element |
| `dialogClassName` | `string` | — | Class name for the dialog element |
| `onOpen` | `(id: string) => void` | — | Called when a card opens |
| `onClose` | `(id: string) => void` | — | Called when a card closes |

### `<FolderCard>`

An individual card with a lid face and expandable detail.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | required | Unique identifier |
| `renderLid` | `() => ReactNode` | required | Card face / expanded lid content |
| `renderDetail` | `(close: () => void) => ReactNode` | required | Expanded dialog content. Called twice (once for measurement, once for display) — keep side-effect-free. |
| `renderTab` | `() => ReactNode` | — | Tab notch content |
| `ariaLabel` | `string` | — | Accessible label for the expanded dialog |
| `className` | `string` | — | Class name for the card button |
| `style` | `CSSProperties` | — | Inline styles for the card wrapper |
| `perspective` | `number` | `1800` | Perspective depth (px) for 3D rotation |
| `hingeSide` | `'auto' \| 'bottom' \| 'top' \| 'left' \| 'right'` | `'auto'` | Which edge the lid hinges on |
| `notchPosition` | `NotchPosition` | `'top-right'` | Where the tab notch sits (8 positions) |
| `notchOuterRadius` | `number` | card radius | Outer concave radius of the notch cutout |
| `notchInnerRadius` | `number` | `cardRadius * 0.7` | Inner inverted radius of the notch cutout |
| `liveRadius` | `boolean` | `false` | Observe `--fc-radius` changes reactively |

### `<FolderCardItem>`

Wraps content inside `renderLid` or `renderDetail` for staggered fade-in animation.

## CSS variables

Import the base stylesheet and override variables to theme:

```css
@import "@markoradak/folder-card/styles.css";

:root {
  --fc-radius: 20px;
  --fc-card-bg: #ffffff;
  --fc-foreground: #0a0a0a;
  --fc-border: rgba(0, 0, 0, 0.1);
  --fc-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --fc-shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.12);
  --fc-backdrop-bg: rgba(0, 0, 0, 0.5);
  --fc-dialog-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  --fc-lid: color-mix(in srgb, var(--fc-foreground) 6%, var(--fc-card-bg));
  --fc-lid-border: transparent;
  --fc-lid-back: /* gradient */;
  --fc-focus-ring: rgba(0, 0, 0, 0.2);
}
```

Dark mode is supported automatically via `prefers-color-scheme`, or override in a `.dark` selector.

## License

MIT
