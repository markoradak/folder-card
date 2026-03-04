import { HeroDemo } from "./hero-demo";
import { AutoHingeDemo } from "./auto-hinge-demo";
import { ProfileCardsDemo } from "./profile-cards-demo";
import { NotchPositionsDemo } from "./notch-positions-demo";
import { HingeSidesDemo } from "./hinge-sides-demo";
import { RecipeCardsDemo } from "./recipe-cards-demo";
import { SpringConfigDemo } from "./spring-config-demo";
import { CodeBlock } from "./code-block";

const INSTALL_CODE = `npm install @markoradak/folder-card framer-motion`;

const BASIC_EXAMPLE = `import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";

function MyCards() {
  return (
    <FolderCardGroup>
      <FolderCard
        id="project-1"
        renderLid={() => (
          <div className="p-5">
            <h3 className="font-semibold">Project Alpha</h3>
            <p className="text-sm text-muted">Click to expand</p>
          </div>
        )}
        renderDetail={(close) => (
          <div className="p-8">
            <h2 className="text-lg font-semibold">Project Alpha</h2>
            <FolderCardItem>
              <p>Stagger-animated content.</p>
            </FolderCardItem>
            <button onClick={close}>Close</button>
          </div>
        )}
      />
    </FolderCardGroup>
  );
}`;

const TAB_EXAMPLE = `<FolderCard
  id="with-tab"
  notchPosition="top-right"
  renderLid={() => <CardFace />}
  renderDetail={(close) => <CardDetail close={close} />}
  renderTab={() => (
    <div className="pr-5 pt-3 pb-2 pl-4">
      <div className="flex size-8 items-center justify-center
        rounded-full border border-border/40
        group-hover:border-foreground/30">
        <ArrowUpRight className="size-3.5 text-muted
          group-hover:text-foreground" />
      </div>
    </div>
  )}
/>`;

const SPRING_EXAMPLE = `<FolderCardGroup
  springConfig={{ stiffness: 200, damping: 15 }}
>
  <FolderCard
    id="bouncy-card"
    renderLid={() => <CardFace />}
    renderDetail={(close) => <CardDetail close={close} />}
  />
</FolderCardGroup>`;

const HINGE_NOTCH_EXAMPLE = `<FolderCard
  id="recipe-card"
  hingeSide="left"
  notchPosition="bottom-right"
  renderLid={() => <RecipeFace />}
  renderDetail={(close) => <RecipeDetail close={close} />}
  renderTab={() => <TabIcon />}
/>`;

const THEMING_EXAMPLE = `:root {
  --fc-radius: 20px;
  --fc-card-bg: #ffffff;
  --fc-foreground: #0a0a0a;
  --fc-border: rgba(0, 0, 0, 0.1);
  --fc-muted: rgba(0, 0, 0, 0.45);
  --fc-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --fc-shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.dark {
  --fc-card-bg: #1a1a1f;
  --fc-foreground: #ffffff;
  --fc-border: rgba(255, 255, 255, 0.08);
}`;

const FEATURES = [
  {
    title: "FLIP Spring Animation",
    description:
      "Cards spring from grid position to centered dialog using Framer Motion physics. Configurable stiffness and damping.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "3D Lid Rotation",
    description:
      "Perspective-correct 3D rotation on any edge. Bottom, top, left, right, or auto based on aspect ratio.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    title: "SVG Notch Mask",
    description:
      "Folder-style tab cutouts at any corner or edge. Dynamic SVG masks with configurable concave and inverted radii.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    title: "Render Props API",
    description:
      "Full control over card face, detail content, and tab via render props. No opinionated markup or styles imposed.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "Stagger Animations",
    description:
      "FolderCardItem wraps content for automatic staggered fade-in. Built-in Framer Motion variants included.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    title: "CSS Variable Theming",
    description:
      "Override --fc-* variables for colors, radii, shadows, and transitions. Automatic dark mode via prefers-color-scheme.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-12">
            <div className="flex flex-col items-center gap-6 text-center">
              <span className="inline-flex items-center rounded-full border border-border/40 bg-card px-3 py-1 text-xs font-medium text-muted dark:border-white/[0.08]">
                v0.0.1
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Cards that{" "}
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  open like folders
                </span>
              </h1>
              <p className="max-w-xl text-base text-muted sm:text-lg">
                Animated folder-style cards for React. FLIP spring expansion,
                3D lid rotation, SVG notch masks, and a render props API.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://github.com/markoradak/folder-card"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://www.npmjs.com/package/@markoradak/folder-card"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface dark:border-white/[0.08]"
                >
                  npm
                </a>
              </div>

              <div className="w-full max-w-md">
                <CodeBlock code={INSTALL_CODE} language="bash" />
              </div>
            </div>

            {/* Live demo */}
            <div className="w-full">
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Everything you need
            </h2>
            <p className="mt-3 text-muted">
              Physics-based card animations with full customization.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[20px] border border-border/40 bg-card p-6 dark:border-white/[0.06]"
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-foreground/[0.04] text-muted dark:bg-white/[0.04]">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profile Cards */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Built for any use case
            </h2>
            <p className="mt-3 text-muted">
              Team profiles with <code className="rounded-md border border-border/40 bg-card px-1.5 py-0.5 text-xs font-medium text-foreground dark:border-white/[0.08]">notchPosition=&quot;top-left&quot;</code> for a different tab placement.
            </p>
          </div>
          <ProfileCardsDemo />
        </div>
      </section>

      {/* Auto Hinge Demo */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Automatic hinge detection
            </h2>
            <p className="mt-3 text-muted">
              With <code className="rounded-md border border-border/40 bg-card px-1.5 py-0.5 text-xs font-medium text-foreground dark:border-white/[0.08]">hingeSide=&quot;auto&quot;</code>, the lid rotation axis adapts to the card&apos;s aspect ratio.
            </p>
          </div>
          <AutoHingeDemo />
        </div>
      </section>

      {/* Notch Positions */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              8 notch positions
            </h2>
            <p className="mt-3 text-muted">
              Place the folder tab at any corner or edge. Select a position to see the notch move.
            </p>
          </div>
          <NotchPositionsDemo />
        </div>
      </section>

      {/* Hinge Sides Live */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hinge sides
            </h2>
            <p className="mt-3 text-muted">
              Four directions for lid rotation. Click each card to see it in action.
            </p>
          </div>
          <HingeSidesDemo />
        </div>
      </section>

      {/* Recipe Cards */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Content cards
            </h2>
            <p className="mt-3 text-muted">
              Editorial layouts with <code className="rounded-md border border-border/40 bg-card px-1.5 py-0.5 text-xs font-medium text-foreground dark:border-white/[0.08]">hingeSide=&quot;left&quot;</code> and <code className="rounded-md border border-border/40 bg-card px-1.5 py-0.5 text-xs font-medium text-foreground dark:border-white/[0.08]">notchPosition=&quot;bottom-right&quot;</code>.
            </p>
          </div>
          <RecipeCardsDemo />
        </div>
      </section>

      {/* Spring Config */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Tune the physics
            </h2>
            <p className="mt-3 text-muted">
              Each card uses a different spring configuration. Click to feel the difference.
            </p>
          </div>
          <SpringConfigDemo />
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Simple API
            </h2>
            <p className="mt-3 text-muted">
              Wrap cards in a group, provide render props, done.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-base font-semibold text-foreground">
                Basic usage
              </h3>
              <p className="mb-4 text-sm text-muted">
                FolderCardGroup manages state. FolderCard takes renderLid and
                renderDetail. FolderCardItem adds stagger animations.
              </p>
              <CodeBlock code={BASIC_EXAMPLE} />
            </div>

            <div>
              <h3 className="mb-4 text-base font-semibold text-foreground">
                Tab notch
              </h3>
              <p className="mb-4 text-sm text-muted">
                Add renderTab for a folder-style tab cutout. 8 positions
                available (corners and edges) with configurable radii.
              </p>
              <CodeBlock code={TAB_EXAMPLE} />
            </div>

            <div>
              <h3 className="mb-4 text-base font-semibold text-foreground">
                Custom spring
              </h3>
              <p className="mb-4 text-sm text-muted">
                Pass springConfig to FolderCardGroup for bouncy, smooth, or
                snappy animations. Adjust stiffness and damping.
              </p>
              <CodeBlock code={SPRING_EXAMPLE} />
            </div>

            <div>
              <h3 className="mb-4 text-base font-semibold text-foreground">
                Hinge side + notch position
              </h3>
              <p className="mb-4 text-sm text-muted">
                Combine hingeSide and notchPosition for unique card orientations.
                The tab cutout and lid rotation work together.
              </p>
              <CodeBlock code={HINGE_NOTCH_EXAMPLE} />
            </div>

            <div className="lg:col-span-2">
              <h3 className="mb-4 text-base font-semibold text-foreground">
                CSS variable theming
              </h3>
              <p className="mb-4 text-sm text-muted">
                Override --fc-* CSS custom properties for colors, radii, shadows,
                and transitions. Supports light and dark mode.
              </p>
              <CodeBlock code={THEMING_EXAMPLE} language="css" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 dark:border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted sm:px-6">
          <p>
            Built by{" "}
            <a
              href="https://github.com/markoradak"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-2"
            >
              Marko Radak
            </a>
            . Source on{" "}
            <a
              href="https://github.com/markoradak/folder-card"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-2"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </main>
  );
}
