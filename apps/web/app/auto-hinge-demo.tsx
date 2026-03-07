"use client";

import { useState } from "react";
import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";
import { CloseButtonIcon } from "./close-button-icon";

const EXTRA_SECTIONS = [
  { label: "Response Times", values: ["P50: 12ms", "P95: 42ms", "P99: 89ms"] },
  { label: "Error Breakdown", values: ["4xx: 0.01%", "5xx: 0.01%", "Timeout: 0%"] },
  { label: "Top Endpoints", values: ["/api/users", "/api/auth", "/api/data"] },
];

export function AutoHingeDemo() {
  const [sections, setSections] = useState(0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-muted">
          Add content to the card lid to make it taller. Once it becomes portrait, the hinge automatically switches from <strong className="text-foreground">bottom</strong> to <strong className="text-foreground">left</strong>.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSections(Math.max(0, sections - 1))}
            disabled={sections === 0}
            className="flex size-8 items-center justify-center rounded-full border border-border/40 text-sm font-medium text-muted transition-colors hover:text-foreground disabled:opacity-30 dark:border-white/[0.08]"
          >
            -
          </button>
          <span className="w-32 text-center text-sm tabular-nums text-foreground">
            {sections === 0 ? "Landscape (bottom)" : sections < 3 ? `+${sections} section${sections > 1 ? "s" : ""}` : "Portrait (left)"}
          </span>
          <button
            type="button"
            onClick={() => setSections(Math.min(3, sections + 1))}
            disabled={sections === 3}
            className="flex size-8 items-center justify-center rounded-full border border-border/40 text-sm font-medium text-muted transition-colors hover:text-foreground disabled:opacity-30 dark:border-white/[0.08]"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <FolderCardGroup>
          <div className="w-72">
            <FolderCard
              id="auto-hinge-card"
              liveRadius
              renderLid={() => (
                <div className="flex flex-col gap-4 p-5">
                  <FolderCardItem>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: "color-mix(in srgb, #8B5CF6 20%, var(--color-card))",
                          boxShadow: "0 0 0 2px #8B5CF650",
                          color: "#8B5CF6",
                        }}
                      >
                        A
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          Auto Hinge Demo
                        </p>
                        <p className="truncate text-xs text-muted">
                          hingeSide=&quot;auto&quot;
                        </p>
                      </div>
                    </div>
                  </FolderCardItem>

                  <FolderCardItem>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] text-muted/60">Status</p>
                        <p className="text-sm font-semibold text-foreground">Active</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted/60">Uptime</p>
                        <p className="text-sm font-semibold tabular-nums text-foreground">99.99%</p>
                      </div>
                    </div>
                  </FolderCardItem>

                  {EXTRA_SECTIONS.slice(0, sections).map((section) => (
                    <FolderCardItem key={section.label}>
                      <div className="border-t border-border/40 pt-4 dark:border-white/[0.06]">
                        <p className="mb-2 text-[11px] font-medium text-muted/60">
                          {section.label}
                        </p>
                        <div className="flex flex-col gap-1">
                          {section.values.map((v) => (
                            <div
                              key={v}
                              className="flex items-center justify-between"
                            >
                              <span className="text-xs text-muted">
                                {v.split(":")[0]}
                              </span>
                              <span className="text-xs font-medium tabular-nums text-foreground">
                                {v.split(":")[1]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FolderCardItem>
                  ))}
                </div>
              )}
              renderDetail={(close) => (
                <div className="relative flex flex-col gap-6 p-6">
                  <CloseButtonIcon onClick={close} />
                  <FolderCardItem>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Auto Hinge Demo
                    </h2>
                  </FolderCardItem>
                  <FolderCardItem>
                    <p className="text-sm text-muted">
                      The lid rotation axis changed automatically based on the card&apos;s aspect ratio.
                    </p>
                  </FolderCardItem>
                </div>
              )}
              renderTab={() => (
                <div className="pr-5 pt-3 pb-2 pl-4">
                  <div className="flex size-8 items-center justify-center rounded-full border border-border/40 transition-all duration-300 ease-out group-hover:border-foreground/30 dark:border-white/[0.1] dark:group-hover:border-white/[0.2]">
                    <svg className="size-3.5 text-muted transition-colors group-hover:text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
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
