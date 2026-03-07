"use client";

const DEFAULT_CLASS_NAME =
  "absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full border border-border/40 text-muted transition-colors hover:text-foreground dark:border-white/[0.08]";

export function CloseButtonIcon({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className ?? DEFAULT_CLASS_NAME}
      aria-label="Close"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}
