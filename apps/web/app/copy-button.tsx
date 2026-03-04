"use client";

import { useCallback, useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded-lg border border-border/40 bg-card/90 px-2 py-1 text-xs font-medium text-muted backdrop-blur-sm transition-colors hover:text-foreground dark:border-white/[0.08]"
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
