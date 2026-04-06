"use client";

import { useState } from "react";
import { submitReview } from "@/app/actions/review";
import type { ReviewWithUser } from "@/lib/supabase/queries";

export function ReviewForm({
  contributionId,
  existingReview,
}: {
  contributionId: string;
  existingReview: ReviewWithUser | null;
}) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [worksAsDescribed, setWorksAsDescribed] = useState(
    existingReview?.works_as_described ?? true
  );
  const [modelTested, setModelTested] = useState(
    existingReview?.model_tested ?? ""
  );
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setMessage("Please select a rating.");
      return;
    }
    setSubmitting(true);
    setMessage("");

    const fd = new FormData();
    fd.set("contribution_id", contributionId);
    fd.set("rating", String(rating));
    fd.set("works_as_described", String(worksAsDescribed));
    fd.set("model_tested", modelTested);
    fd.set("body", body);

    const result = await submitReview(fd);
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage(existingReview ? "Review updated." : "Review submitted.");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star rating */}
      <div>
        <label className="text-xs font-medium text-foreground">Rating</label>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-lg transition-colors ${
                star <= rating
                  ? "text-yellow-400"
                  : "text-muted-foreground/30 hover:text-yellow-400/50"
              }`}
            >
              &#9733;
            </button>
          ))}
        </div>
      </div>

      {/* Works as described */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="works_as_described"
          checked={worksAsDescribed}
          onChange={(e) => setWorksAsDescribed(e.target.checked)}
          className="rounded border-border"
        />
        <label htmlFor="works_as_described" className="text-xs text-foreground">
          Works as described
        </label>
      </div>

      {/* Model tested */}
      <div>
        <label className="text-xs font-medium text-foreground">
          Model tested with{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={modelTested}
          onChange={(e) => setModelTested(e.target.value)}
          placeholder="e.g. claude-sonnet-4-6"
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Body */}
      <div>
        <label className="text-xs font-medium text-foreground">
          Review{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Share your experience..."
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
        >
          {submitting
            ? "Submitting..."
            : existingReview
              ? "Update Review"
              : "Submit Review"}
        </button>
        {message && (
          <span className="text-xs text-muted-foreground">{message}</span>
        )}
      </div>
    </form>
  );
}
