"use client";

import { useState } from "react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <code className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs font-mono text-foreground">
        {command}
      </code>
      <button
        onClick={handleCopy}
        className="shrink-0 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
