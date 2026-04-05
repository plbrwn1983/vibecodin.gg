import { notFound } from "next/navigation";
import Link from "next/link";
import { getContributionById, getComments, getUserCommentVotes } from "@/lib/supabase/queries";
import { getAuthState } from "@/lib/supabase/auth";
import { getHubBySlug, getSubdomainBySlug } from "@/lib/hubs";
import { Badge } from "@/components/ui/badge";
import { TagList } from "@/components/tag-list";
import { UpvoteButton } from "@/components/upvote-button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Discussion } from "@/components/discussion";
import { InstallSection } from "@/components/install-section";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await getContributionById(id);
  return {
    title: c ? `${c.name} — vibecodin.gg` : "Contribution — vibecodin.gg",
  };
}

export default async function ContributionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [c, { isAuthenticated, userVotes }, comments, commentVotes] = await Promise.all([
    getContributionById(id),
    getAuthState(),
    getComments(id),
    getUserCommentVotes(id),
  ]);
  if (!c) notFound();

  const hub = getHubBySlug(c.domain);
  const sd = c.subdomain ? getSubdomainBySlug(c.domain, c.subdomain) : null;

  let currentUserId: string | undefined;
  if (isAuthenticated) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    currentUserId = user?.id;
  }

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
        <UpvoteButton
          contributionId={c.id}
          upvotes={c.upvotes}
          hasVoted={userVotes.has(c.id)}
          isAuthenticated={isAuthenticated}
        />
        <span>&#9744; {c.usage_count} installs</span>
        <Link href={`/u/${c.author}`} className="hover:text-foreground">
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
                <span className="text-foreground">
                  {c.skill_fields.trigger}
                </span>
              </div>
              {c.skill_fields.commands &&
                c.skill_fields.commands.length > 0 && (
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground">Commands:</span>
                    <div className="mt-1 space-y-1">
                      {c.skill_fields.commands.map(
                        (cmd: { name: string; description: string }) => (
                          <div key={cmd.name}>
                            <code className="rounded bg-muted px-1 py-0.5 text-foreground">
                              {cmd.name}
                            </code>{" "}
                            <span className="text-muted-foreground">
                              — {cmd.description}
                            </span>
                          </div>
                        )
                      )}
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
                  {c.agent_fields.behaviors.map((b: string, i: number) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Install */}
      <InstallSection contributionId={c.id} type={c.type} />

      {/* Readme body */}
      {c.raw_readme && (
        <div className="mt-8">
          <MarkdownRenderer content={c.raw_readme} />
        </div>
      )}

      {/* Discussion */}
      <Discussion
        contributionId={c.id}
        comments={comments}
        isAuthenticated={isAuthenticated}
        currentUserId={currentUserId}
        threadLocked={c.thread_locked ?? false}
        commentVotes={commentVotes}
      />
    </div>
  );
}
