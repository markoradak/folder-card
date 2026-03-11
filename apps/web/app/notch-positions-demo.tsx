"use client";

import { useState } from "react";
import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";
import type { NotchPosition, HingeSideProp } from "@markoradak/folder-card";
import { CloseButtonIcon } from "./close-button-icon";

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

// Hinge on the opposite side of the notch so the lid opens away from the tab.
const OPPOSITE_HINGE: Record<NotchPosition, HingeSideProp> = {
  "top-left": "bottom",
  top: "bottom",
  "top-right": "bottom",
  right: "left",
  "bottom-right": "top",
  bottom: "top",
  "bottom-left": "top",
  left: "right",
};

// Content alignment opposite to the notch so it gravitates away from the tab.
// Returns Tailwind classes for the outer wrapper (flex direction + alignment).
function getContentAlignment(pos: NotchPosition): string {
  switch (pos) {
    case "top-left":
      return "items-end justify-end text-right";
    case "top":
      return "items-center justify-end text-center";
    case "top-right":
      return "items-start justify-end text-left";
    case "right":
      return "items-start justify-center text-left";
    case "bottom-right":
      return "items-start justify-start text-left";
    case "bottom":
      return "items-center justify-start text-center";
    case "bottom-left":
      return "items-end justify-start text-right";
    case "left":
      return "items-end justify-center text-right";
  }
}

// Padding to avoid overlapping with the tab, per notch position.
function getContentPadding(pos: NotchPosition): string {
  switch (pos) {
    case "top-left":
      return "pt-14 pl-10";
    case "top":
      return "pt-14";
    case "top-right":
      return "pt-14 pr-10";
    case "right":
      return "pr-14";
    case "bottom-right":
      return "pb-14 pr-10";
    case "bottom":
      return "pb-14";
    case "bottom-left":
      return "pb-14 pl-10";
    case "left":
      return "pl-14";
  }
}

// Tab padding per position.
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
                  : "border border-border/40 text-muted hover:text-foreground dark:border-white/8"
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
              className="group"
              liveRadius
              notchPosition={position}
              hingeSide={OPPOSITE_HINGE[position]}
              renderLid={() => (
                <div
                  className={`flex flex-col gap-4 p-6 ${getContentPadding(position)} ${getContentAlignment(position)}`}
                >
                  <FolderCardItem>
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
                  </FolderCardItem>

                  <FolderCardItem>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {POSITION_LABELS[position]}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {position.includes("-") ? "Corner notch" : "Edge notch"}
                      </p>
                    </div>
                  </FolderCardItem>

                  <FolderCardItem>
                    <div className="rounded-xl border border-border/40 bg-foreground/2 p-3 dark:border-white/6 dark:bg-white/2">
                      <p className="font-mono text-xs text-muted">
                        notchPosition=&quot;{position}&quot;
                      </p>
                    </div>
                  </FolderCardItem>
                </div>
              )}
              renderDetail={(close) => (
                <div className="relative flex flex-col gap-5 p-6">
                  <CloseButtonIcon
                    onClick={close}
                    className="absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full border border-border/40 text-muted transition-colors hover:text-foreground dark:border-white/8"
                  />
                  <FolderCardItem>
                    <h2 className="text-lg font-bold tracking-tight text-foreground">
                      Notch: {POSITION_LABELS[position]}
                    </h2>
                  </FolderCardItem>
                  <FolderCardItem>
                    <p className="text-sm text-muted">
                      The tab is at <strong className="text-foreground">{position}</strong> and the lid hinges from the <strong className="text-foreground">{OPPOSITE_HINGE[position]}</strong>, opening away from the tab.
                    </p>
                  </FolderCardItem>
                  <FolderCardItem>
                    <div className="rounded-xl border border-border/40 bg-foreground/2 p-4 dark:border-white/6 dark:bg-white/2">
                      <p className="font-mono text-xs text-muted">
                        &lt;FolderCard<br />
                        &nbsp;&nbsp;notchPosition=&quot;{position}&quot;<br />
                        &nbsp;&nbsp;hingeSide=&quot;{OPPOSITE_HINGE[position]}&quot;<br />
                        /&gt;
                      </p>
                    </div>
                  </FolderCardItem>
                </div>
              )}
              renderTab={() => (
                <div className={getTabPadding(position)}>
                  <div className="flex items-center justify-center rounded-full border border-border/40 px-3 py-1.5 text-xs font-medium text-muted transition-all duration-300 ease-out group-hover:border-foreground/30 group-hover:text-foreground dark:border-white/10 dark:group-hover:border-white/20">
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
