"use client";

import { CopyButton } from "./copy-button";

export function CodeBlock({
  code,
  language = "tsx",
}: {
  code: string;
  language?: string;
}) {
  return (
    <div className="relative">
      <pre
        data-language={language}
        className="overflow-x-auto rounded-[16px] border border-border/40 bg-card p-4 text-sm leading-relaxed dark:border-white/[0.06]"
      >
        <code className="font-mono text-foreground/80">{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  );
}
