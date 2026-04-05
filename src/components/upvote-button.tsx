"use client";

import { useTransition } from "react";
import { toggleVote } from "@/app/actions/vote";

export function UpvoteButton({
  contributionId,
  upvotes,
  hasVoted,
  isAuthenticated,
}: {
  contributionId: string;
  upvotes: number;
  hasVoted: boolean;
  isAuthenticated: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }

    startTransition(async () => {
      await toggleVote(contributionId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors ${
        hasVoted
          ? "bg-blue-500/15 text-blue-400"
          : "text-muted-foreground hover:text-foreground"
      } ${isPending ? "opacity-50" : ""}`}
      title={isAuthenticated ? (hasVoted ? "Remove upvote" : "Upvote") : "Sign in to upvote"}
    >
      <span className={hasVoted ? "text-blue-400" : ""}>&#9650;</span>
      {upvotes}
    </button>
  );
}
