import { Contribution } from "@/lib/types";
import { ContributionCard } from "./contribution-card";

export function ContributionList({
  contributions,
  userVotes,
  isAuthenticated,
}: {
  contributions: Contribution[];
  userVotes: Set<string>;
  isAuthenticated: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {contributions.map((c) => (
        <ContributionCard
          key={c.id}
          contribution={c}
          hasVoted={userVotes.has(c.id)}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}
