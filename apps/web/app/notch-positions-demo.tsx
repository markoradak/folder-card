"use client";

import { useState } from "react";
import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";
import type { NotchPosition } from "@markoradak/folder-card";

const POSITIONS: NotchPosition[] = [
  "top-left",
  "top",
  "top-right",
  "right",
  "bottom-right",
  "bottom",
  "bottom-left",
  "left",
];

const POSITION_LABELS: Record<NotchPosition, string> = {
  "top-left": "Top Left",
  top: "Top",
  "top-right": "Top Right",
  right: "Right",
  "bottom-right": "Bottom Right",
  bottom: "Bottom",
  "bottom-left": "Bottom Left",
  left: "Left",
};

const POSITION_SHORT: Record<NotchPosition, string> = {
  "top-left": "TL",
  top: "T",
  "top-right": "TR",
  right: "R",
  "bottom-right": "BR",
  bottom: "B",
  "bottom-left": "BL",
  left: "L",
};

// Padding classes for the card content to avoid overlapping with the tab
// based on which side the tab is positioned on.
function getContentPadding(pos: NotchPosition): string {
  if (pos === "left") return "pl-14";
  if (pos === "right") return "pr-14";
  if (pos === "top" || pos === "top-left" || pos === "top-right") return "pt-14";
  if (pos === "bottom" || pos === "bottom-left" || pos === "bottom-right") return "pb-14";
  return "";
}

// Tab padding: push the tab inward so it has clear visual separation.
// For side tabs (left/right) we need vertical padding; for top/bottom we need horizontal.
function getTabPadding(pos: NotchPosition): string {
  switch (pos) {
    case "top-left":
      return "pl-4 pt-2.5 pr-3 pb-2";
    case "top":
      return "pt-2.5 px-4 pb-2";
    case "top-right":
      return "pr-4 pt-2.5 pl-3 pb-2";
    case "right":
      return "pr-2.5 py-4 pl-2";
    case "bottom-right":
      return "pr-4 pb-2.5 pl-3 pt-2";
    case "bottom":
      return "pb-2.5 px-4 pt-2";
    case "bottom-left":
      return "pl-4 pb-2.5 pr-3 pt-2";
    case "left":
      return "pl-2.5 py-4 pr-2";
  }
}

export function NotchPositionsDemo() {
  const [position, setPosition] = useState<NotchPosition>("top-right");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2">
          {POSITIONS.map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => setPosition(pos)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                pos === position
                  ? "bg-foreground text-background"
                  : "border border-border/40 text-muted hover:text-foreground dark:border-white/[0.08]"
              }`}
            >
              {POSITION_LABELS[pos]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <FolderCardGroup key={position}>
          <div className="w-full max-w-md">
            <FolderCard
              id="notch-demo"
              liveRadius
              notchPosition={position}
              renderLid={() => (
                <div className={`flex flex-col gap-4 p-6 ${getContentPadding(position)}`}>
                  <FolderCardItem>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: "color-mix(in srgb, #F59E0B 20%, var(--color-card))",
                          boxShadow: "0 0 0 2px #F59E0B50",
                          color: "#F59E0B",
                        }}
                      >
                        {POSITION_SHORT[position]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          Notch Position
                        </p>
                        <p className="text-xs text-muted">
                          {POSITION_LABELS[position]}
                        </p>
                      </div>
                    </div>
                  </FolderCardItem>

                  <FolderCardItem>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-[11px] text-muted/60">Position</p>
                        <p className="text-sm font-semibold text-foreground">{position}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted/60">Type</p>
                        <p className="text-sm font-semibold text-foreground">
                          {position.includes("-") ? "Corner" : "Edge"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted/60">Index</p>
                        <p className="text-sm font-semibold tabular-nums text-foreground">
                          {POSITIONS.indexOf(position) + 1}/8
                        </p>
                      </div>
                    </div>
                  </FolderCardItem>

                  <FolderCardItem>
                    <div className="rounded-[12px] border border-border/40 bg-foreground/[0.02] p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                      <p className="text-center font-mono text-xs text-muted">
                        notchPosition=&quot;{position}&quot;
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
                    <h2 className="text-lg font-bold tracking-tight text-foreground">
                      Notch: {POSITION_LABELS[position]}
                    </h2>
                  </FolderCardItem>
                  <FolderCardItem>
                    <p className="text-sm text-muted">
                      The tab cutout is positioned at the <strong className="text-foreground">{position}</strong> edge of the card. Use the selector above to try all 8 positions.
                    </p>
                  </FolderCardItem>
                  <FolderCardItem>
                    <div className="rounded-[12px] border border-border/40 bg-foreground/[0.02] p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                      <p className="font-mono text-xs text-muted">
                        &lt;FolderCard notchPosition=&quot;{position}&quot; /&gt;
                      </p>
                    </div>
                  </FolderCardItem>
                </div>
              )}
              renderTab={() => (
                <div className={getTabPadding(position)}>
                  <div className="flex items-center justify-center rounded-full border border-border/40 px-3 py-1.5 text-xs font-medium text-muted transition-all duration-300 ease-out group-hover:border-foreground/30 group-hover:text-foreground dark:border-white/[0.1] dark:group-hover:border-white/[0.2]">
                    {POSITION_SHORT[position]}
                  </div>
                </div>
              )}
            />
          </div>
        </FolderCardGroup>
      </div>
    </div>
  );
}
