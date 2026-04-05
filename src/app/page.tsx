import {
  getContributions,
  getStats,
  getHubsWithCounts,
} from "@/lib/supabase/queries";
import { getAuthState } from "@/lib/supabase/auth";
import { HubCard } from "@/components/hub-card";
import { ContributionList } from "@/components/contribution-list";
import { SearchBar } from "@/components/search-bar";

export const revalidate = 60;

export default async function Home() {
  const [stats, hubsWithCounts, topContributions, { isAuthenticated, userVotes }] =
    await Promise.all([
      getStats(),
      getHubsWithCounts(),
      getContributions({ sort: "upvotes", limit: 6 }),
      getAuthState(),
    ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Skills & agents for LLMs,
          <br />
          <span className="text-muted-foreground">organized by domain.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          An open source library of structured LLM skills and agents across{" "}
          {stats.domains} business domains. Search, install, and assemble.
        </p>
        <div className="mx-auto mt-6 max-w-sm">
          <SearchBar />
        </div>
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span>
            <span className="font-mono text-foreground">{stats.skills}</span>{" "}
            skills
          </span>
          <span>
            <span className="font-mono text-foreground">{stats.agents}</span>{" "}
            agents
          </span>
          <span>
            <span className="font-mono text-foreground">{stats.domains}</span>{" "}
            hubs
          </span>
        </div>
      </section>

      {/* Hub grid */}
      <section className="mb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Domain Hubs</h2>
          <a
            href="/hubs"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            View all &rarr;
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hubsWithCounts.map(({ hub, count }) => (
            <HubCard key={hub.slug} hub={hub} count={count} />
          ))}
        </div>
      </section>

      {/* Top contributions */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Top Contributions</h2>
          <a
            href="/search"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Browse all &rarr;
          </a>
        </div>
        <ContributionList
          contributions={topContributions}
          userVotes={userVotes}
          isAuthenticated={isAuthenticated}
        />
      </section>
    </div>
  );
}
