export function TrustScoreBadge({
  score,
  ratingCount,
}: {
  score: number | null;
  ratingCount: number;
}) {
  if (score === null || ratingCount === 0) return null;

  let color: string;
  if (score >= 80) {
    color = "text-green-400 bg-green-500/10";
  } else if (score >= 60) {
    color = "text-yellow-400 bg-yellow-500/10";
  } else {
    color = "text-red-400 bg-red-500/10";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${color}`}
      title={`Trust score: ${score.toFixed(0)}% based on ${ratingCount} review${ratingCount === 1 ? "" : "s"}`}
    >
      <span>★</span>
      <span>{score.toFixed(0)}%</span>
    </span>
  );
}
