import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import type { CommentWithUser } from "@/lib/supabase/queries";

export function Discussion({
  contributionId,
  comments,
  isAuthenticated,
  currentUserId,
  threadLocked,
  commentVotes,
}: {
  contributionId: string;
  comments: CommentWithUser[];
  isAuthenticated: boolean;
  currentUserId?: string;
  threadLocked: boolean;
  commentVotes: Set<string>;
}) {
  // Top-level sorted by upvotes (already sorted from query), replies grouped
  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesByParent = new Map<string, CommentWithUser[]>();
  comments
    .filter((c) => c.parent_id)
    .forEach((c) => {
      const existing = repliesByParent.get(c.parent_id!) ?? [];
      existing.push(c);
      repliesByParent.set(c.parent_id!, existing);
    });

  return (
    <div className="mt-12">
      <h3 className="text-sm font-medium text-foreground">
        Discussion ({comments.length})
      </h3>

      {threadLocked ? (
        <p className="mt-3 text-xs text-muted-foreground italic">
          This discussion thread is locked.
        </p>
      ) : isAuthenticated ? (
        <div className="mt-3">
          <CommentForm contributionId={contributionId} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          <a href="/auth/login" className="text-blue-400 hover:underline">
            Sign in
          </a>{" "}
          to leave a comment.
        </p>
      )}

      {topLevel.length > 0 ? (
        <div className="mt-6 space-y-4">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={repliesByParent.get(comment.id) ?? []}
              contributionId={contributionId}
              currentUserId={currentUserId}
              isAuthenticated={isAuthenticated}
              hasVoted={commentVotes.has(comment.id)}
              commentVotes={commentVotes}
            />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          No comments yet. Be the first to share feedback.
        </p>
      )}
    </div>
  );
}
