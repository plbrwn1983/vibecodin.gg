import { getHubsWithCounts } from "@/lib/supabase/queries";
import { HubCard } from "@/components/hub-card";
import { NominateHub } from "@/components/nominate-hub";

export const revalidate = 60;
export const metadata = { title: "Hubs — vibecodin.gg" };

export default async function HubsPage() {
  const hubsWithCounts = await getHubsWithCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Domain Hubs</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Browse skills and agents organized across 12 business domains.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hubsWithCounts.map(({ hub, count }) => (
          <HubCard key={hub.slug} hub={hub} count={count} />
        ))}
      </div>

      <NominateHub />
    </div>
  );
}
