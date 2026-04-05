import { notFound } from "next/navigation";
import Link from "next/link";
import { hubs, getHubBySlug } from "@/lib/hubs";
import { getContributions, isSubscribedToHub, type SortKey } from "@/lib/supabase/queries";
import { getAuthState } from "@/lib/supabase/auth";
import { ContributionList } from "@/components/contribution-list";
import { SortControls } from "@/components/sort-controls";
import { SubscribeButton } from "@/components/subscribe-button";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return hubs.map((h) => ({ hub: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hub: string }>;
}) {
  const { hub: slug } = await params;
  const hub = getHubBySlug(slug);
  return { title: hub ? `${hub.name} — vibecodin.gg` : "Hub — vibecodin.gg" };
}

export default async function HubPage({
  params,
  searchParams,
}: {
  params: Promise<{ hub: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { hub: slug } = await params;
  const { sort } = await searchParams;
  const hub = getHubBySlug(slug);
  if (!hub) notFound();

  const sortKey = (sort as SortKey) || "upvotes";
  const [items, { isAuthenticated, userVotes }, subscribed] = await Promise.all([
    getContributions({ domain: hub.slug, sort: sortKey }),
    getAuthState(),
    isSubscribedToHub(hub.slug),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-2 text-xs text-muted-foreground">
        <Link href="/hubs" className="hover:text-foreground">
          Hubs
        </Link>{" "}
        / {hub.name}
      </div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{hub.name}</h1>
        <SubscribeButton
          domain={hub.slug}
          isSubscribed={subscribed}
          isAuthenticated={isAuthenticated}
        />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{hub.description}</p>

      {/* Subdomain pills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {hub.subdomains.map((sd) => (
          <Link key={sd.slug} href={`/hubs/${hub.slug}/${sd.slug}`}>
            <Badge
              variant="outline"
              className="cursor-pointer text-xs font-normal text-muted-foreground hover:text-foreground"
            >
              {sd.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Sort + list */}
      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "contribution" : "contributions"}
        </span>
        <SortControls current={sortKey} basePath={`/hubs/${hub.slug}`} />
      </div>

      {items.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No contributions in this hub yet.
        </p>
      ) : (
        <div className="mt-4">
          <ContributionList
            contributions={items}
            userVotes={userVotes}
            isAuthenticated={isAuthenticated}
          />
        </div>
      )}
    </div>
  );
}
