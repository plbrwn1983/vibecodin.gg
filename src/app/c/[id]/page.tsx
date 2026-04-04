import { notFound } from "next/navigation";
import Link from "next/link";
import { contributions, getContributionById } from "@/lib/data";
import { getHubBySlug, getSubdomainBySlug } from "@/lib/hubs";
import { Badge } from "@/components/ui/badge";
import { TagList } from "@/components/tag-list";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export function generateStaticParams() {
  return contributions.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getContributionById(id);
  return { title: c ? `${c.name} — vibecodin.gg` : "Contribution — vibecodin.gg" };
}

export default async function ContributionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getContributionById(id);
  if (!c) notFound();

  const hub = getHubBySlug(c.domain);
  const sd = getSubdomainBySlug(c.domain, c.subdomain);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-xs text-muted-foreground">
        <Link href="/hubs" className="hover:text-foreground">
          Hubs
        </Link>{" "}
        /{" "}
        <Link href={`/hubs/${c.domain}`} className="hover:text-foreground">
          {hub?.name ?? c.domain}
        </Link>{" "}
        /{" "}
        {sd && (
          <>
            <Link
              href={`/hubs/${c.domain}/${c.subdomain}`}
              className="hover:text-foreground"
            >
              {sd.name}
            </Link>{" "}
            /{" "}
          </>
        )}
        <span className="text-foreground">{c.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{c.name}</h1>
            <Badge variant="secondary" className="text-xs uppercase">
              {c.type}
            </Badge>
            {c.verified && (
              <span className="text-sm text-blue-400" title="Verified">
                &#10003; Verified
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
        </div>
        <div className="hidden shrink-0 text-right text-sm text-muted-foreground sm:block">
          <div className="font-mono">v{c.version}</div>
          <div className="mt-1 text-xs">{c.license}</div>
        </div>
      </div>

      {/* Signals */}
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span>&#9650; {c.upvotes} upvotes</span>
        <span>&#9744; {c.usage_count} installs</span>
        <Link
          href={`/u/${c.author}`}
          className="hover:text-foreground"
        >
          by {c.author}
        </Link>
      </div>

      {/* Tags */}
      <div className="mt-3">
        <TagList tags={c.tags} />
      </div>

      {/* Metadata */}
      <div className="mt-6 rounded-lg border border-border bg-card p-4">
        <div className="grid gap-4 text-xs sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Tested with:</span>{" "}
            <span className="font-mono text-foreground">
              {c.tested_with.join(", ")}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Created:</span>{" "}
            <span className="text-foreground">{c.created}</span>
            <span className="mx-2 text-muted-foreground">|</span>
            <span className="text-muted-foreground">Updated:</span>{" "}
            <span className="text-foreground">{c.updated}</span>
          </div>

          {/* Skill-specific fields */}
          {c.skill_fields && (
            <>
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">Trigger:</span>{" "}
                <span className="text-foreground">{c.skill_fields.trigger}</span>
              </div>
              {c.skill_fields.commands && c.skill_fields.commands.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">Commands:</span>
                  <div className="mt-1 space-y-1">
                    {c.skill_fields.commands.map((cmd) => (
                      <div key={cmd.name}>
                        <code className="rounded bg-muted px-1 py-0.5 text-foreground">
                          {cmd.name}
                        </code>{" "}
                        <span className="text-muted-foreground">
                          — {cmd.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {c.skill_fields.dependencies.note !==
                "No dependencies required for this skill to function." && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">Dependencies:</span>{" "}
                  <span className="text-foreground">
                    {c.skill_fields.dependencies.note}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Agent-specific fields */}
          {c.agent_fields && (
            <>
              <div>
                <span className="text-muted-foreground">Model:</span>{" "}
                <span className="font-mono text-foreground">
                  {c.agent_fields.model}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Memory:</span>{" "}
                <span className="text-foreground">
                  {c.agent_fields.memory ? "Yes" : "No"}
                </span>
              </div>
              {c.agent_fields.tools.builtin.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">Tools:</span>{" "}
                  <span className="font-mono text-foreground">
                    {c.agent_fields.tools.builtin.join(", ")}
                  </span>
                </div>
              )}
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">Behaviors:</span>
                <ul className="mt-1 list-inside list-disc space-y-0.5 text-foreground">
                  {c.agent_fields.behaviors.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Readme body */}
      {c.raw_readme && (
        <div className="mt-8">
          <MarkdownRenderer content={c.raw_readme} />
        </div>
      )}

      {/* Discussion placeholder */}
      <div className="mt-12 rounded-lg border border-border bg-card p-6 text-center">
        <h3 className="text-sm font-medium text-foreground">Discussion</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Sign in to leave comments, report issues, or suggest improvements.
        </p>
      </div>
    </div>
  );
}
