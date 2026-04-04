import { notFound } from "next/navigation";
import Link from "next/link";
import { getHubBySlug, getSubdomainBySlug } from "@/lib/hubs";
import {
  getContributionsBySubdomain,
  sortContributions,
  type SortKey,
} from "@/lib/data";
import { ContributionCard } from "@/components/contribution-card";
import { SortControls } from "@/components/sort-controls";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hub: string; subdomain: string }>;
}) {
  const { hub: hubSlug, subdomain: sdSlug } = await params;
  const hub = getHubBySlug(hubSlug);
  const sd = getSubdomainBySlug(hubSlug, sdSlug);
  return {
    title: hub && sd
      ? `${sd.name} — ${hub.name} — vibecodin.gg`
      : "Subdomain — vibecodin.gg",
  };
}

export default async function SubdomainPage({
  params,
  searchParams,
}: {
  params: Promise<{ hub: string; subdomain: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { hub: hubSlug, subdomain: sdSlug } = await params;
  const { sort } = await searchParams;
  const hub = getHubBySlug(hubSlug);
  const sd = getSubdomainBySlug(hubSlug, sdSlug);
  if (!hub || !sd) notFound();

  const sortKey = (sort as SortKey) || "upvotes";
  const items = sortContributions(
    getContributionsBySubdomain(hub.slug, sd.slug),
    sortKey
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-2 text-xs text-muted-foreground">
        <Link href="/hubs" className="hover:text-foreground">
          Hubs
        </Link>{" "}
        /{" "}
        <Link href={`/hubs/${hub.slug}`} className="hover:text-foreground">
          {hub.name}
        </Link>{" "}
        / {sd.name}
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{sd.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{sd.description}</p>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "contribution" : "contributions"}
        </span>
        <SortControls
          current={sortKey}
          basePath={`/hubs/${hub.slug}/${sd.slug}`}
        />
      </div>

      {items.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No contributions in this sub-domain yet.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <ContributionCard key={c.id} contribution={c} />
          ))}
        </div>
      )}
    </div>
  );
}
