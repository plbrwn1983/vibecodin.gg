import {
  contributions,
  searchContributions,
  sortContributions,
  type SortKey,
} from "@/lib/data";
import { ContributionCard } from "@/components/contribution-card";
import { SearchBar } from "@/components/search-bar";
import { SortControls } from "@/components/sort-controls";

export const metadata = { title: "Search — vibecodin.gg" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; type?: string }>;
}) {
  const { q, sort, type: typeFilter } = await searchParams;
  const sortKey = (sort as SortKey) || "upvotes";

  let results = q ? searchContributions(q) : contributions;

  if (typeFilter === "skill" || typeFilter === "agent") {
    results = results.filter((c) => c.type === typeFilter);
  }

  results = sortContributions(results, sortKey);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {q ? `Results for "${q}"` : "Browse All"}
      </h1>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar defaultValue={q ?? ""} />
        <div className="flex items-center gap-4">
          {/* Type filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="mr-1 text-muted-foreground">Type:</span>
            {[
              { key: undefined, label: "All" },
              { key: "skill", label: "Skills" },
              { key: "agent", label: "Agents" },
            ].map((opt) => {
              const isActive = typeFilter === opt.key || (!typeFilter && !opt.key);
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (sort) params.set("sort", sort);
              if (opt.key) params.set("type", opt.key);
              const href = `/search?${params.toString()}`;
              return (
                <a
                  key={opt.label}
                  href={href}
                  className={`rounded-md px-2 py-1 transition-colors ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </a>
              );
            })}
          </div>
          <SortControls current={sortKey} basePath="/search" />
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>

      {results.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No contributions found. Try a different search term.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <ContributionCard key={c.id} contribution={c} />
          ))}
        </div>
      )}
    </div>
  );
}
