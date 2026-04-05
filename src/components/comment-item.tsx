"use client";

import { useState, useTransition } from "react";
import { deleteComment } from "@/app/actions/comment";
import { toggleCommentVote } from "@/app/actions/comment-vote";
import { CommentForm } from "./comment-form";
import type { CommentWithUser } from "@/lib/supabase/queries";

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function CommentItem({
  comment,
  replies,
  contributionId,
  currentUserId,
  isAuthenticated,
  hasVoted,
  commentVotes,
}: {
  comment: CommentWithUser;
  replies: CommentWithUser[];
  contributionId: string;
  currentUserId?: string;
  isAuthenticated: boolean;
  hasVoted: boolean;
  commentVotes: Set<string>;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isVoting, startVoteTransition] = useTransition();
  const isOwner = currentUserId === comment.user_id;

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteComment(comment.id, contributionId);
    });
  }

  function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }
    startVoteTransition(async () => {
      await toggleCommentVote(comment.id, contributionId);
    });
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            {comment.users.avatar_url && (
              <img
                src={comment.users.avatar_url}
                alt={comment.users.github_handle}
                className="h-5 w-5 rounded-full"
              />
            )}
            <a
              href={`/u/${comment.users.github_handle}`}
              className="font-medium text-foreground hover:text-blue-400"
            >
              {comment.users.github_handle}
            </a>
            <span className="text-muted-foreground">
              {timeAgo(comment.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {isAuthenticated && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-muted-foreground hover:text-foreground"
              >
                Reply
              </button>
            )}
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-muted-foreground hover:text-red-400"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">
          {comment.body}
        </p>
        <div className="mt-2">
          <button
            onClick={handleVote}
            disabled={isVoting}
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors ${
              hasVoted
                ? "bg-blue-500/15 text-blue-400"
                : "text-muted-foreground hover:text-foreground"
            } ${isVoting ? "opacity-50" : ""}`}
            title={
              isAuthenticated
                ? hasVoted
                  ? "Remove upvote"
                  : "Upvote"
                : "Sign in to upvote"
            }
          >
            <span>&#9650;</span>
            {comment.upvotes}
          </button>
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-6">
          <CommentForm
            contributionId={contributionId}
            parentId={comment.id}
            onCancel={() => setShowReplyForm(false)}
            placeholder={`Reply to ${comment.users.github_handle}...`}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="ml-6 space-y-3 border-l border-border pl-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]}
              contributionId={contributionId}
              currentUserId={currentUserId}
              isAuthenticated={isAuthenticated}
              hasVoted={commentVotes.has(reply.id)}
              commentVotes={commentVotes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
