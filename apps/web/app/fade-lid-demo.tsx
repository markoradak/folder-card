"use client";

import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";
import { CloseButtonIcon } from "./close-button-icon";

const MODES = [
  {
    id: "default",
    label: "Default",
    fadeLid: false,
    color: "#6366F1",
    description:
      "The lid stays visible during rotation, creating a 3D flip effect as it opens past 90 degrees.",
    behavior: "Lid rotates open with perspective, backface becomes visible past 90deg",
    useCase: "When you want to emphasize the physical folder metaphor",
  },
  {
    id: "fade-lid",
    label: "Fade lid",
    fadeLid: true,
    color: "#F97316",
    description:
      "The lid fades out as the card opens and fades back in on close, for a cleaner reveal.",
    behavior: "Lid cross-fades to transparent as the dialog springs into position",
    useCase: "When the detail content should take focus without 3D distraction",
  },
];

function CardFace({ mode }: { mode: (typeof MODES)[number] }) {
  return (
    <div className="flex flex-col gap-4 p-5">
      <FolderCardItem>
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            style={{
              backgroundColor: `color-mix(in srgb, ${mode.color} 20%, var(--color-card))`,
              boxShadow: `0 0 0 2px ${mode.color}50`,
              color: mode.color,
            }}
          >
            {mode.label[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {mode.label}
            </p>
            <p className="truncate text-xs text-muted">
              {mode.fadeLid ? "Lid fades out on open" : "Lid rotates open in 3D"}
            </p>
          </div>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <div className="rounded-[10px] border border-border/40 bg-foreground/[0.02] px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.02]">
          <p className="font-mono text-xs text-muted">
            fadeLid: {String(mode.fadeLid)}
          </p>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <p className="text-xs leading-relaxed text-muted">
          {mode.behavior}
        </p>
      </FolderCardItem>

      <FolderCardItem>
        <div className="mt-auto rounded-[10px] border border-border/40 bg-foreground/[0.02] px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.02]">
          <p className="text-[11px] text-muted/60">Best for</p>
          <p className="text-xs text-muted">{mode.useCase}</p>
        </div>
      </FolderCardItem>
    </div>
  );
}

function CardDetail({
  mode,
  close,
}: {
  mode: (typeof MODES)[number];
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
              backgroundColor: `color-mix(in srgb, ${mode.color} 20%, var(--color-card))`,
              boxShadow: `0 0 0 2px ${mode.color}50`,
              color: mode.color,
            }}
          >
            {mode.label[0]}
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {mode.label}
            </h2>
            <p className="font-mono text-xs text-muted">
              fadeLid: {String(mode.fadeLid)}
            </p>
          </div>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <p className="text-sm leading-relaxed text-muted">
          {mode.description}
        </p>
      </FolderCardItem>
    </div>
  );
}

export function FadeLidDemo() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-5 sm:grid-cols-2">
      {MODES.map((mode) => (
        <FolderCardGroup key={mode.id} fadeLid={mode.fadeLid}>
          <FolderCard
            id={mode.id}
            liveRadius
            renderLid={() => <CardFace mode={mode} />}
            renderDetail={(close) => (
              <CardDetail mode={mode} close={close} />
            )}
            renderTab={() => (
              <div className="pr-5 pt-2.5 pb-2 pl-4">
                <div
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${mode.color} 12%, var(--color-card))`,
                    color: mode.color,
                    opacity: 0.7,
                  }}
                >
                  {mode.fadeLid ? "fade" : "3D"}
                </div>
              </div>
            )}
          />
        </FolderCardGroup>
      ))}
    </div>
  );
}
