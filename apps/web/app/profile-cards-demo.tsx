"use client";

import {
  FolderCardGroup,
  FolderCard,
  FolderCardItem,
} from "@markoradak/folder-card";

const TEAM = [
  {
    id: "elena",
    name: "Elena Vasquez",
    initials: "EV",
    role: "Design Lead",
    tagline: "Crafting pixels into experiences",
    color: "#E05DAD",
    bio: "Elena has 8 years of experience in product design, specializing in design systems and component libraries. She leads the design team at Acme and has shipped interfaces used by millions.",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    links: [
      { label: "Twitter", href: "#" },
      { label: "Dribbble", href: "#" },
    ],
  },
  {
    id: "james",
    name: "James Chen",
    initials: "JC",
    role: "Staff Engineer",
    tagline: "Building things that scale",
    color: "#3B82F6",
    bio: "James architects distributed systems and mentors junior engineers. Previously at Stripe and Vercel, he focuses on developer experience and performance optimization.",
    skills: ["TypeScript", "React", "Node.js", "System Design"],
    links: [
      { label: "GitHub", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    id: "priya",
    name: "Priya Sharma",
    initials: "PS",
    role: "Marketing",
    tagline: "Turning ideas into roadmaps",
    color: "#10B981",
    bio: "Priya bridges the gap between engineering and business. She has launched 12 products in the SaaS space and specializes in developer tools and B2B platforms.",
    skills: ["Strategy", "Analytics", "Roadmapping", "User Interviews"],
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "Twitter", href: "#" },
    ],
  },
];

function CardFace({ person }: { person: (typeof TEAM)[number] }) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 text-center">
      <FolderCardItem>
        <div
          className="flex size-16 items-center justify-center rounded-full text-lg font-bold"
          style={{
            backgroundColor: `color-mix(in srgb, ${person.color} 15%, var(--color-card))`,
            boxShadow: `0 0 0 2px color-mix(in srgb, ${person.color} 30%, transparent)`,
            color: person.color,
          }}
        >
          {person.initials}
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <div>
          <p className="text-sm font-semibold text-foreground">{person.name}</p>
          <p className="mt-0.5 text-xs text-muted">{person.role}</p>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <p className="text-xs leading-relaxed text-muted/70 italic">
          &ldquo;{person.tagline}&rdquo;
        </p>
      </FolderCardItem>
    </div>
  );
}

function CardDetail({
  person,
  close,
}: {
  person: (typeof TEAM)[number];
  close: () => void;
}) {
  return (
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
        <div className="flex items-center gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-bold"
            style={{
              backgroundColor: `color-mix(in srgb, ${person.color} 15%, var(--color-card))`,
              boxShadow: `0 0 0 2px color-mix(in srgb, ${person.color} 30%, transparent)`,
              color: person.color,
            }}
          >
            {person.initials}
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {person.name}
            </h2>
            <p className="text-sm text-muted">{person.role}</p>
          </div>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <p className="text-sm leading-relaxed text-muted">{person.bio}</p>
      </FolderCardItem>

      <FolderCardItem>
        <div>
          <p className="mb-2 text-[11px] font-medium text-muted/60">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {person.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `color-mix(in srgb, ${person.color} 10%, var(--color-card))`,
                  color: person.color,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </FolderCardItem>

      <FolderCardItem>
        <div className="flex gap-2">
          {person.links.map((link) => (
            <span
              key={link.label}
              className="inline-flex items-center rounded-full border border-border/40 bg-foreground/[0.03] px-3 py-1.5 text-xs text-muted dark:border-white/[0.08] dark:bg-white/[0.04]"
            >
              {link.label}
            </span>
          ))}
        </div>
      </FolderCardItem>
    </div>
  );
}

export function ProfileCardsDemo() {
  return (
    <FolderCardGroup>
      <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((person) => (
          <FolderCard
            key={person.id}
            id={person.id}
            liveRadius
            notchPosition="top-left"
            renderLid={() => <CardFace person={person} />}
            renderDetail={(close) => (
              <CardDetail person={person} close={close} />
            )}
            renderTab={() => (
              <div className="pl-4 pt-2.5 pr-3 pb-2">
                <div
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${person.color} 12%, var(--color-card))`,
                    color: person.color,
                    opacity: 0.7,
                  }}
                >
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: person.color }} />
                  {person.role}
                </div>
              </div>
            )}
          />
        ))}
      </div>
    </FolderCardGroup>
  );
}
