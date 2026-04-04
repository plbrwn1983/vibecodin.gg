import Link from "next/link";
import { Hub } from "@/lib/types";

export function HubCard({
  hub,
  count,
}: {
  hub: Hub;
  count: number;
}) {
  return (
    <Link
      href={`/hubs/${hub.slug}`}
      className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/20"
    >
      <h3 className="text-sm font-medium text-foreground group-hover:text-accent">
        {hub.name}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
        {hub.description}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {count} {count === 1 ? "contribution" : "contributions"}
        </span>
        <span>{hub.subdomains.length} sub-domains</span>
      </div>
    </Link>
  );
}
