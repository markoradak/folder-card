import { HeroDemo } from "./hero-demo";
import { AutoHingeDemo } from "./auto-hinge-demo";
import { NotchPositionsDemo } from "./notch-positions-demo";
import { HingeSidesDemo } from "./hinge-sides-demo";
import { RecipeCardsDemo } from "./recipe-cards-demo";
import { SpringConfigDemo } from "./spring-config-demo";
import { FadeLidDemo } from "./fade-lid-demo";
import { CodeBlock } from "./code-block";
import { ThemeToggle } from "./theme-toggle";

const INSTALL_CODE = `npm install @markoradak/folder-card framer-motion`;

const BASIC_EXAMPLE = `import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";
import "@markoradak/folder-card/styles";

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

@media (prefers-color-scheme: dark) {
  :root {
    --fc-card-bg: #111111;
    --fc-foreground: #f5f5f5;
    --fc-border: rgba(255, 255, 255, 0.06);
  }
}`;

const FEATURES = [
  {
    title: "FLIP Spring Animation",
    description:
      "Cards spring from grid position to centered dialog using Framer Motion physics. Configurable stiffness and damping.",
  },
  {
    title: "3D Lid Rotation",
    description:
      "Perspective-correct 3D rotation on any edge. Bottom, top, left, right, or auto based on aspect ratio.",
  },
  {
    title: "SVG Notch Mask",
    description:
      "Folder-style tab cutouts at any corner or edge. Dynamic SVG masks with configurable concave and inverted radii.",
  },
  {
    title: "Render Props API",
    description:
      "Full control over card face, detail content, and tab via render props. No opinionated markup or styles imposed.",
  },
  {
    title: "Stagger Animations",
    description:
      "FolderCardItem wraps content for automatic staggered fade-in. Built-in Framer Motion variants included.",
  },
  {
    title: "CSS Variable Theming",
    description:
      "Override --fc-* variables for colors, radii, shadows, and transitions. Automatic dark mode via prefers-color-scheme.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-[1000px] px-6 md:px-10">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold sm:text-3xl">
            @markoradak/folder-card
          </h1>
          <p className="text-[#666]">
            Animated folder-style cards for React. FLIP spring expansion,
            3D lid rotation, SVG notch masks, and a render props API.
          </p>

          <CodeBlock code={INSTALL_CODE} language="bash" />

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/markoradak/folder-card"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-[#0f0f0f] transition-colors hover:bg-accent/80"
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
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white/90 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800/90 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              <svg className="h-5 w-5 text-[#333] dark:text-[#ccc]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
              </svg>
              npm
            </a>
            <span className="ml-auto">
              <ThemeToggle />
            </span>
          </div>
        </div>

        <div className="mt-12">
          <HeroDemo />
        </div>
      </section>

      {/* Features */}
      <hr className="border-[#e5e5e5] dark:border-[#2a2a2a]" />
      <section className="py-16 sm:py-24">
        <h2 className="mb-10 text-xl font-bold sm:text-2xl">Features</h2>
        <div className="grid gap-x-16 gap-y-8 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title}>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[#666]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Auto Hinge Demo */}
      <hr className="border-[#e5e5e5] dark:border-[#2a2a2a]" />
      <section className="py-16 sm:py-24">
        <h2 className="mb-2 text-xl font-bold sm:text-2xl">
          Automatic hinge detection
        </h2>
        <p className="mb-8 text-sm text-[#666]">
          With{" "}
          <code className="rounded-md border border-[#e5e5e5] bg-[#fafafa] px-1.5 py-0.5 text-xs font-medium dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
            hingeSide=&quot;auto&quot;
          </code>
          , the lid rotation axis adapts to the card&apos;s aspect ratio.
        </p>
        <AutoHingeDemo />
      </section>

      {/* Notch Positions */}
      <hr className="border-[#e5e5e5] dark:border-[#2a2a2a]" />
      <section className="py-16 sm:py-24">
        <h2 className="mb-2 text-xl font-bold sm:text-2xl">
          8 notch positions
        </h2>
        <p className="mb-8 text-sm text-[#666]">
          Place the folder tab at any corner or edge. Select a position to see
          the notch move.
        </p>
        <NotchPositionsDemo />
      </section>

      {/* Hinge Sides Live */}
      <hr className="border-[#e5e5e5] dark:border-[#2a2a2a]" />
      <section className="py-16 sm:py-24">
        <h2 className="mb-2 text-xl font-bold sm:text-2xl">Hinge sides</h2>
        <p className="mb-8 text-sm text-[#666]">
          Four directions for lid rotation. Click each card to see it in action.
        </p>
        <HingeSidesDemo />
      </section>

      {/* Recipe Cards */}
      <hr className="border-[#e5e5e5] dark:border-[#2a2a2a]" />
      <section className="py-16 sm:py-24">
        <h2 className="mb-2 text-xl font-bold sm:text-2xl">Content cards</h2>
        <p className="mb-8 text-sm text-[#666]">
          Editorial layouts with{" "}
          <code className="rounded-md border border-[#e5e5e5] bg-[#fafafa] px-1.5 py-0.5 text-xs font-medium dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
            hingeSide=&quot;left&quot;
          </code>{" "}
          and{" "}
          <code className="rounded-md border border-[#e5e5e5] bg-[#fafafa] px-1.5 py-0.5 text-xs font-medium dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
            notchPosition=&quot;bottom-right&quot;
          </code>
          .
        </p>
        <RecipeCardsDemo />
      </section>

      {/* Spring Config */}
      <hr className="border-[#e5e5e5] dark:border-[#2a2a2a]" />
      <section className="py-16 sm:py-24">
        <h2 className="mb-2 text-xl font-bold sm:text-2xl">
          Tune the physics
        </h2>
        <p className="mb-8 text-sm text-[#666]">
          Each card uses a different spring configuration. Click to feel the
          difference.
        </p>
        <SpringConfigDemo />
      </section>

      {/* Fade Lid */}
      <hr className="border-[#e5e5e5] dark:border-[#2a2a2a]" />
      <section className="py-16 sm:py-24">
        <h2 className="mb-2 text-xl font-bold sm:text-2xl">Fade lid</h2>
        <p className="mb-8 text-sm text-[#666]">
          With{" "}
          <code className="rounded-md border border-[#e5e5e5] bg-[#fafafa] px-1.5 py-0.5 text-xs font-medium dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
            fadeLid
          </code>
          , the lid fades out on open instead of staying visible during 3D
          rotation.
        </p>
        <FadeLidDemo />
      </section>

      {/* Code Examples */}
      <hr className="border-[#e5e5e5] dark:border-[#2a2a2a]" />
      <section className="py-16 sm:py-24">
        <h2 className="mb-10 text-xl font-bold sm:text-2xl">Code Examples</h2>

        <div className="flex flex-col gap-12">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Basic usage</h3>
            <p className="mb-4 text-sm text-[#666]">
              FolderCardGroup manages state. FolderCard takes renderLid and
              renderDetail. FolderCardItem adds stagger animations.
            </p>
            <CodeBlock code={BASIC_EXAMPLE} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Tab notch</h3>
            <p className="mb-4 text-sm text-[#666]">
              Add renderTab for a folder-style tab cutout. 8 positions available
              (corners and edges) with configurable radii.
            </p>
            <CodeBlock code={TAB_EXAMPLE} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Custom spring</h3>
            <p className="mb-4 text-sm text-[#666]">
              Pass springConfig to FolderCardGroup for bouncy, smooth, or snappy
              animations. Adjust stiffness and damping.
            </p>
            <CodeBlock code={SPRING_EXAMPLE} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">
              Hinge side + notch position
            </h3>
            <p className="mb-4 text-sm text-[#666]">
              Combine hingeSide and notchPosition for unique card orientations.
              The tab cutout and lid rotation work together.
            </p>
            <CodeBlock code={HINGE_NOTCH_EXAMPLE} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">
              CSS variable theming
            </h3>
            <p className="mb-4 text-sm text-[#666]">
              Override --fc-* CSS custom properties for colors, radii, shadows,
              and transitions. Supports light and dark mode.
            </p>
            <CodeBlock code={THEMING_EXAMPLE} language="css" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <hr className="border-[#e5e5e5] dark:border-[#2a2a2a]" />
      <footer className="flex items-center justify-between py-12 text-xs text-[#999]">
        <p>&copy; {new Date().getFullYear()} MIT License</p>
        <p>
          Built by{" "}
          <a
            href="https://markoradak.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            Marko Radak
          </a>
        </p>
      </footer>
    </main>
  );
}
