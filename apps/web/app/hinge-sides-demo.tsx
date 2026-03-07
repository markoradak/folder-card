"use client";

import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";
import { CloseButtonIcon } from "./close-button-icon";

const HINGES = [
  {
    id: "hinge-top",
    side: "top" as const,
    axis: "rotateX",
    rest: "20",
    open: "100",
    color: "#8B5CF6",
    description: "Lid opens downward from the top edge, like a flip phone.",
    arrow: "\u2191",
  },
  {
    id: "hinge-right",
    side: "right" as const,
    axis: "rotateY",
    rest: "15",
    open: "120",
    color: "#10B981",
    description: "Lid swings open to the left from the right edge.",
    arrow: "\u2192",
  },
  {
    id: "hinge-left",
    side: "left" as const,
    axis: "rotateY",
    rest: "-15",
    open: "-120",
    color: "#F59E0B",
    description: "Lid swings open to the right from the left edge, like a book.",
    arrow: "\u2190",
  },
  {
    id: "hinge-bottom",
    side: "bottom" as const,
    axis: "rotateX",
    rest: "-20",
    open: "-100",
    color: "#3B82F6",
    description: "Lid opens upward from the bottom edge, like a laptop screen.",
    arrow: "\u2193",
  },
];

export function HingeSidesDemo() {
  return (
    <FolderCardGroup>
      <div className="mx-auto grid w-full max-w-[640px] gap-8 sm:grid-cols-2">
        {HINGES.map((hinge) => (
          <FolderCard
            key={hinge.id}
            id={hinge.id}
            liveRadius
            hingeSide={hinge.side}
            renderLid={() => (
              <div className="flex flex-col gap-5 p-6">
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
                <CloseButtonIcon onClick={close} />

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
