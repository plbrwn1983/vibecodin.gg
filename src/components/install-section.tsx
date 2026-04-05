"use client";

import { CopyCommand } from "./copy-command";

export function InstallSection({
  contributionId,
  type,
}: {
  contributionId: string;
  type: "skill" | "agent";
}) {
  return (
    <div className="mt-6 rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium text-foreground">Install</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Install this {type} to your local environment via the CLI.
      </p>

      <div className="mt-3">
        <CopyCommand command={`vibecodin install ${contributionId}`} />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Don&apos;t have the CLI?{" "}
        <code className="rounded bg-background px-1 py-0.5 text-foreground">
          npm install -g vibecodin
        </code>
      </p>

      {/* Direct download */}
      <div className="mt-3 border-t border-border pt-3">
        <a
          href={`/api/download/${contributionId}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
        >
          <span>&#8595;</span> Download Files
        </a>
        <span className="ml-3 text-xs text-muted-foreground">
          Extract to .claude/skills/{contributionId}/
        </span>
      </div>
    </div>
  );
}
