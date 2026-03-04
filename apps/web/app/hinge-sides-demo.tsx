"use client";

import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";

const HINGES = [
  {
    id: "hinge-bottom",
    side: "bottom" as const,
    axis: "rotateX",
    rest: "-20",
    open: "-100",
    color: "#3B82F6",
    description: "Lid opens upward from the bottom edge, like a laptop screen.",
    arrow: "\u2191",
  },
  {
    id: "hinge-top",
    side: "top" as const,
    axis: "rotateX",
    rest: "20",
    open: "100",
    color: "#8B5CF6",
    description: "Lid opens downward from the top edge, like a flip phone.",
    arrow: "\u2193",
  },
  {
    id: "hinge-left",
    side: "left" as const,
    axis: "rotateY",
    rest: "-15",
    open: "-120",
    color: "#F59E0B",
    description: "Lid swings open to the right from the left edge, like a book.",
    arrow: "\u2192",
  },
  {
    id: "hinge-right",
    side: "right" as const,
    axis: "rotateY",
    rest: "15",
    open: "120",
    color: "#10B981",
    description: "Lid swings open to the left from the right edge.",
    arrow: "\u2190",
  },
];

export function HingeSidesDemo() {
  return (
    <FolderCardGroup>
      <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {HINGES.map((hinge) => (
          <FolderCard
            key={hinge.id}
            id={hinge.id}
            liveRadius
            hingeSide={hinge.side}
            renderLid={() => (
              <div className="flex flex-col gap-4 p-5">
                <FolderCardItem>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${hinge.color} 20%, var(--color-card))`,
                        boxShadow: `0 0 0 2px ${hinge.color}50`,
                        color: hinge.color,
                      }}
                    >
                      {hinge.side[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold capitalize text-foreground">
                        {hinge.side}
                      </p>
                      <p className="truncate text-xs text-muted">
                        hingeSide=&quot;{hinge.side}&quot;
                      </p>
                    </div>
                  </div>
                </FolderCardItem>

                <FolderCardItem>
                  <div className="rounded-[12px] border border-border/40 bg-foreground/[0.02] p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <p className="text-center font-mono text-xs text-muted">
                      {hinge.axis}: {hinge.rest}&deg; &rarr; {hinge.open}&deg;
                    </p>
                  </div>
                </FolderCardItem>
              </div>
            )}
            renderDetail={(close) => (
              <div className="relative flex flex-col gap-5 p-6">
                <button
                  type="button"
                  onClick={close}
                  className="absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full border border-border/40 text-muted transition-colors hover:text-foreground dark:border-white/[0.08]"
                  aria-label="Close"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <FolderCardItem>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold uppercase"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${hinge.color} 20%, var(--color-card))`,
                        boxShadow: `0 0 0 2px ${hinge.color}50`,
                        color: hinge.color,
                      }}
                    >
                      {hinge.side[0]}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold capitalize tracking-tight text-foreground">
                        {hinge.side} hinge
                      </h2>
                      <p className="font-mono text-xs text-muted">
                        {hinge.axis}: {hinge.rest}&deg; &rarr; {hinge.open}&deg;
                      </p>
                    </div>
                  </div>
                </FolderCardItem>

                <FolderCardItem>
                  <p className="text-sm leading-relaxed text-muted">
                    {hinge.description}
                  </p>
                </FolderCardItem>

                <FolderCardItem>
                  <div className="rounded-[12px] border border-border/40 bg-foreground/[0.02] p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <p className="font-mono text-xs text-muted">
                      &lt;FolderCard hingeSide=&quot;{hinge.side}&quot; /&gt;
                    </p>
                  </div>
                </FolderCardItem>
              </div>
            )}
            renderTab={() => (
              <div className="pr-5 pt-2.5 pb-2 pl-4">
                <div
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${hinge.color} 12%, var(--color-card))`,
                    color: hinge.color,
                    opacity: 0.7,
                  }}
                >
                  <span>{hinge.arrow}</span>
                  <span className="capitalize">{hinge.side}</span>
                </div>
              </div>
            )}
          />
        ))}
      </div>
    </FolderCardGroup>
  );
}
