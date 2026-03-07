"use client";

import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";
import { CloseButtonIcon } from "./close-button-icon";

const SPRINGS = [
  {
    id: "bouncy",
    label: "Bouncy",
    stiffness: 200,
    damping: 15,
    color: "#F59E0B",
    description: "Low damping creates a playful, oscillating motion with visible overshoot.",
    bestFor: "Playful UIs, onboarding, gamification",
    settle: "~800ms",
    overshoot: "High",
  },
  {
    id: "smooth",
    label: "Smooth",
    stiffness: 300,
    damping: 50,
    color: "#8B5CF6",
    description: "High damping produces a fluid, elegant transition with no bounce.",
    bestFor: "Dashboards, data-heavy layouts, editorial",
    settle: "~400ms",
    overshoot: "None",
  },
  {
    id: "snappy",
    label: "Snappy",
    stiffness: 450,
    damping: 38,
    color: "#10B981",
    description: "High stiffness makes the animation feel instant and responsive.",
    bestFor: "Navigation, tool panels, quick actions",
    settle: "~250ms",
    overshoot: "Low",
  },
];

function CardFace({ spring }: { spring: (typeof SPRINGS)[number] }) {
  return (
    <div className="flex flex-col gap-4 p-5">
      <FolderCardItem>
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            style={{
              backgroundColor: `color-mix(in srgb, ${spring.color} 20%, var(--color-card))`,
              boxShadow: `0 0 0 2px ${spring.color}50`,
              color: spring.color,
            }}
          >
            {spring.label[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {spring.label}
            </p>
            <p className="truncate text-xs text-muted">Click to see the spring</p>
          </div>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[11px] text-muted/60">Stiffness</p>
            <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
              {spring.stiffness}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted/60">Damping</p>
            <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
              {spring.damping}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted/60">Overshoot</p>
            <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
              {spring.overshoot}
            </p>
          </div>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <p className="text-xs leading-relaxed text-muted">
          {spring.description}
        </p>
      </FolderCardItem>

      <FolderCardItem>
        <div className="mt-auto rounded-[10px] border border-border/40 bg-foreground/[0.02] px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.02]">
          <p className="text-[11px] text-muted/60">Best for</p>
          <p className="text-xs text-muted">{spring.bestFor}</p>
        </div>
      </FolderCardItem>
    </div>
  );
}

function CardDetail({
  spring,
  close,
}: {
  spring: (typeof SPRINGS)[number];
  close: () => void;
}) {
  return (
    <div className="relative flex flex-col gap-5 p-6">
      <CloseButtonIcon onClick={close} />

      <FolderCardItem>
        <div className="flex items-center gap-3">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold"
            style={{
              backgroundColor: `color-mix(in srgb, ${spring.color} 20%, var(--color-card))`,
              boxShadow: `0 0 0 2px ${spring.color}50`,
              color: spring.color,
            }}
          >
            {spring.label[0]}
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {spring.label}
            </h2>
            <p className="font-mono text-xs text-muted">
              stiffness: {spring.stiffness}, damping: {spring.damping}
            </p>
          </div>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <p className="text-sm leading-relaxed text-muted">
          {spring.description}
        </p>
      </FolderCardItem>

      <FolderCardItem>
        <div className="rounded-[12px] border border-border/40 bg-foreground/[0.02] p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
          <p className="mb-2 text-[11px] font-medium text-muted/60">Configuration</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-muted/60">Stiffness</p>
              <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
                {spring.stiffness}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted/60">Damping</p>
              <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
                {spring.damping}
              </p>
            </div>
          </div>
        </div>
      </FolderCardItem>
    </div>
  );
}

export function SpringConfigDemo() {
  return (
    <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {SPRINGS.map((spring) => (
        <FolderCardGroup
          key={spring.id}
          springConfig={{ stiffness: spring.stiffness, damping: spring.damping }}
        >
          <FolderCard
            id={spring.id}
            liveRadius
            renderLid={() => <CardFace spring={spring} />}
            renderDetail={(close) => (
              <CardDetail spring={spring} close={close} />
            )}
            renderTab={() => (
              <div className="pr-5 pt-2.5 pb-2 pl-4">
                <div
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${spring.color} 12%, var(--color-card))`,
                    color: spring.color,
                    opacity: 0.7,
                  }}
                >
                  {spring.stiffness}/{spring.damping}
                </div>
              </div>
            )}
          />
        </FolderCardGroup>
      ))}
    </div>
  );
}
