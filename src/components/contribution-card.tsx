import Link from "next/link";
import { Contribution } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { TagList } from "./tag-list";
import { UpvoteButton } from "./upvote-button";

export function ContributionCard({
  contribution,
  hasVoted = false,
  isAuthenticated = false,
}: {
  contribution: Contribution;
  hasVoted?: boolean;
  isAuthenticated?: boolean;
}) {
  const c = contribution;

  return (
    <Link
      href={`/c/${c.id}`}
      className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-medium text-foreground group-hover:text-accent">
              {c.name}
            </h3>
            <Badge
              variant="secondary"
              className="shrink-0 text-[10px] uppercase"
            >
              {c.type}
            </Badge>
            {c.verified && (
              <span className="shrink-0 text-xs text-blue-400" title="Verified">
                &#10003;
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {c.description}
          </p>
        </div>
        <div className="hidden shrink-0 text-right text-xs text-muted-foreground sm:block">
          <span className="font-mono">v{c.version}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <UpvoteButton
            contributionId={c.id}
            upvotes={c.upvotes}
            hasVoted={hasVoted}
            isAuthenticated={isAuthenticated}
          />
          <span title="Installs">&#9744; {c.usage_count}</span>
          <span className="hidden sm:inline">
            {c.domain}/{c.subdomain}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">by {c.author}</span>
      </div>

      <div className="mt-2">
        <TagList tags={c.tags} limit={4} />
      </div>
    </Link>
  );
}
