"use client";

import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";
import { CloseButtonIcon } from "./close-button-icon";

const PROJECTS = [
  {
    id: "acme-web",
    name: "Acme Web",
    url: "acme.com",
    color: "#3B82F6",
    status: "Active",
    uptime: "99.98%",
    requests: "1.2M",
    errors: "0.02%",
    bars: [70, 85, 60, 90, 75, 80, 95, 88, 72, 65, 80, 90, 85, 78, 92, 88, 70, 95, 82, 76, 90, 85, 88, 72],
  },
  {
    id: "dashboard-api",
    name: "Dashboard API",
    url: "api.dashboard.io",
    color: "#8B5CF6",
    status: "Active",
    uptime: "99.95%",
    requests: "890K",
    errors: "0.05%",
    bars: [60, 70, 80, 75, 65, 90, 85, 70, 95, 80, 75, 88, 92, 78, 85, 70, 90, 82, 76, 95, 88, 72, 80, 85],
  },
  {
    id: "auth-service",
    name: "Auth Service",
    url: "auth.internal",
    color: "#F59E0B",
    status: "Active",
    uptime: "100%",
    requests: "2.4M",
    errors: "0%",
    bars: [90, 88, 92, 85, 95, 90, 88, 92, 95, 90, 85, 88, 92, 95, 90, 88, 85, 92, 95, 90, 88, 92, 85, 90],
  },
];

function ActivityBars({ bars, color }: { bars: number[]; color: string }) {
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 32 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${(h / 100) * 32}px`,
            backgroundColor: `color-mix(in srgb, ${color} ${40 + (h % 40)}%, transparent)`,
          }}
        />
      ))}
    </div>
  );
}

function CardFace({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <div className="flex flex-col gap-5 p-6">
      <FolderCardItem>
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{
              backgroundColor: `color-mix(in srgb, ${project.color} 20%, var(--color-card))`,
              boxShadow: `0 0 0 2px ${project.color}50`,
              color: project.color,
            }}
          >
            {project.name[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {project.name}
            </p>
            <p className="truncate text-xs text-muted">{project.url}</p>
          </div>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <div className="pt-4">
          <ActivityBars bars={project.bars} color={project.color} />
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-muted/60">Uptime</p>
            <p className="text-sm font-semibold tabular-nums text-foreground">
              {project.uptime}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted/60">Requests</p>
            <p className="text-sm font-semibold tabular-nums text-foreground">
              {project.requests}
            </p>
          </div>
        </div>
      </FolderCardItem>
    </div>
  );
}

function CardDetail({
  project,
  close,
}: {
  project: (typeof PROJECTS)[number];
  close: () => void;
}) {
  return (
    <div className="relative flex flex-col gap-6 p-6">
      <CloseButtonIcon onClick={close} />

      <FolderCardItem>
        <div className="flex items-center gap-4">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold"
            style={{
              backgroundColor: `color-mix(in srgb, ${project.color} 20%, var(--color-card))`,
              boxShadow: `0 0 0 2px ${project.color}50`,
              color: project.color,
            }}
          >
            {project.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {project.name}
            </h2>
            <p className="text-sm text-muted">{project.url}</p>
          </div>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            {project.status}
          </span>
          <span className="inline-flex items-center rounded-full border border-border/40 bg-foreground/[0.03] px-2.5 py-1 text-xs text-muted dark:border-white/[0.08] dark:bg-white/[0.04]">
            {project.uptime} uptime
          </span>
          <span className="inline-flex items-center rounded-full border border-border/40 bg-foreground/[0.03] px-2.5 py-1 text-xs text-muted dark:border-white/[0.08] dark:bg-white/[0.04]">
            {project.requests} requests
          </span>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <div className="rounded-[16px] border border-border/40 bg-foreground/[0.02] p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
          <p className="mb-3 text-xs font-medium text-muted">
            Activity (24h)
          </p>
          <ActivityBars bars={project.bars} color={project.color} />
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Uptime", value: project.uptime },
            { label: "Requests", value: project.requests },
            { label: "Errors", value: project.errors },
            { label: "P95 Latency", value: "42ms" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-[11px] text-muted/60">{stat.label}</p>
              <p className="text-sm font-semibold tabular-nums text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </FolderCardItem>
    </div>
  );
}

export function HeroDemo() {
  return (
    <FolderCardGroup>
      <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <FolderCard
            key={project.id}
            id={project.id}
            className="group"
            liveRadius
            renderLid={() => <CardFace project={project} />}
            renderDetail={(close) => (
              <CardDetail project={project} close={close} />
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
        ))}
      </div>
    </FolderCardGroup>
  );
}
