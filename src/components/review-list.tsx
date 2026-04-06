import Link from "next/link";
import type { ReviewWithUser } from "@/lib/supabase/queries";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sm">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-yellow-400" : "text-muted-foreground/20"}
        >
          &#9733;
        </span>
      ))}
    </span>
  );
}

export function ReviewList({
  reviews,
  ratingAvg,
  ratingCount,
  worksAsDescribedPct,
}: {
  reviews: ReviewWithUser[];
  ratingAvg: number;
  ratingCount: number;
  worksAsDescribedPct: number | null;
}) {
  if (reviews.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic">No reviews yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <Stars rating={Math.round(ratingAvg)} />
          <span className="font-medium text-foreground">
            {ratingAvg.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            ({ratingCount} review{ratingCount === 1 ? "" : "s"})
          </span>
        </div>
        {worksAsDescribedPct !== null && (
          <span className="text-xs text-muted-foreground">
            {worksAsDescribedPct.toFixed(0)}% say it works as described
          </span>
        )}
      </div>

      {/* Individual reviews */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {r.users.avatar_url && (
                  <img
                    src={r.users.avatar_url}
                    alt={r.users.github_handle}
                    className="h-5 w-5 rounded-full"
                  />
                )}
                <Link
                  href={`/u/${r.users.github_handle}`}
                  className="text-xs font-medium text-foreground hover:underline"
                >
                  {r.users.display_name ?? r.users.github_handle}
                </Link>
                <Stars rating={r.rating} />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                {r.model_tested && (
                  <span className="font-mono">{r.model_tested}</span>
                )}
                {r.works_as_described ? (
                  <span className="text-green-400">works as described</span>
                ) : (
                  <span className="text-red-400">
                    does not work as described
                  </span>
                )}
              </div>
            </div>
            {r.body && (
              <p className="mt-2 text-xs text-foreground/80">{r.body}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
