import { hubs } from "@/lib/hubs";
import { getContributionsByDomain } from "@/lib/data";
import { HubCard } from "@/components/hub-card";

export const metadata = { title: "Hubs — vibecodin.gg" };

export default function HubsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Domain Hubs</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Browse skills and agents organized across 12 business domains.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hubs.map((hub) => (
          <HubCard
            key={hub.slug}
            hub={hub}
            count={getContributionsByDomain(hub.slug).length}
          />
        ))}
      </div>
    </div>
  );
}
