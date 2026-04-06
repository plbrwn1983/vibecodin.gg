"use client";

import { CopyCommand } from "./copy-command";
import { PurchaseButton } from "./purchase-button";

export function InstallSection({
  contributionId,
  type,
  pricingModel = "free",
  priceOneTime = null,
  priceSubscription = null,
  hasPurchased = true,
}: {
  contributionId: string;
  type: "skill" | "agent";
  pricingModel?: string;
  priceOneTime?: number | null;
  priceSubscription?: number | null;
  hasPurchased?: boolean;
}) {
  const isFree = pricingModel === "free";
  const canAccess = isFree || hasPurchased;

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;

  if (!canAccess) {
    // Premium — not purchased
    return (
      <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
        <h3 className="text-sm font-medium text-foreground">
          Premium {type.charAt(0).toUpperCase() + type.slice(1)}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Purchase this {type} to install and use it.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {(pricingModel === "one_time" || pricingModel === "both") &&
            priceOneTime && (
              <PurchaseButton
                contributionId={contributionId}
                mode="payment"
                label={`Buy for ${formatPrice(priceOneTime)}`}
              />
            )}
          {(pricingModel === "subscription" || pricingModel === "both") &&
            priceSubscription && (
              <PurchaseButton
                contributionId={contributionId}
                mode="subscription"
                label={`Subscribe for ${formatPrice(priceSubscription)}/mo`}
              />
            )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          48-hour refund window for one-time purchases. Cancel subscriptions
          anytime.
        </p>
      </div>
    );
  }

  // Free or purchased — show install options
  return (
    <div className="mt-6 rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium text-foreground">Install</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Install this {type} to your local environment via the CLI.
      </p>

      <div className="mt-3">
        <CopyCommand command={`vibecodin install ${contributionId}`} />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Don&apos;t have the CLI?{" "}
        <code className="rounded bg-background px-1 py-0.5 text-foreground">
          npm install -g vibecodin
        </code>
      </p>

      {/* Direct download */}
      <div className="mt-3 border-t border-border pt-3">
        <a
          href={`/api/download/${contributionId}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
        >
          <span>&#8595;</span> Download Files
        </a>
        <span className="ml-3 text-xs text-muted-foreground">
          Extract to .claude/skills/{contributionId}/
        </span>
      </div>
    </div>
  );
}
