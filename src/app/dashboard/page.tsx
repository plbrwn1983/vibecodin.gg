import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  getUserSubscriptions,
  getUserInstalls,
  getUserPurchases,
  getUserActiveSubscriptionsPaid,
  getContributorEarnings,
  getMyHiddenContributions,
} from "@/lib/supabase/queries";
import { getHubBySlug } from "@/lib/hubs";
import { CopyCommand } from "@/components/copy-command";
import { RefundButton } from "@/components/refund-button";
import { CancelSubscriptionButton } from "@/components/cancel-subscription-button";

export const metadata = { title: "Dashboard — vibecodin.gg" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const handle =
    user.user_metadata?.user_name ??
    user.user_metadata?.preferred_username ??
    user.email;

  // Check if user is a contributor with Stripe Connect
  const { data: userData } = await supabase
    .from("users")
    .select("stripe_account_id, stripe_onboarding_complete")
    .eq("id", user.id)
    .single();

  const isContributor = !!userData?.stripe_onboarding_complete;

  const [subscriptions, installs, purchases, paidSubs, earnings, hiddenContributions] =
    await Promise.all([
      getUserSubscriptions(),
      getUserInstalls(),
      getUserPurchases(),
      getUserActiveSubscriptionsPaid(),
      isContributor
        ? getContributorEarnings(user.id)
        : Promise.resolve({ totalCents: 0, thisMonthCents: 0 }),
      getMyHiddenContributions(),
    ]);
  const hasSubscriptions = subscriptions.length > 0;
  const hasInstalls = installs.length > 0;
  const hasPurchases = purchases.length > 0;
  const hasPaidSubs = paidSubs.length > 0;

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-4">
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt={handle}
            className="h-14 w-14 rounded-full"
          />
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {user.user_metadata?.full_name ?? handle}
          </h1>
          <p className="text-sm text-muted-foreground">@{handle}</p>
        </div>
      </div>

      {hiddenContributions.length > 0 && (
        <div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <h3 className="text-sm font-medium text-red-200">
            {hiddenContributions.length === 1
              ? "1 contribution is hidden from the marketplace"
              : `${hiddenContributions.length} contributions are hidden from the marketplace`}
          </h3>
          <p className="mt-1 text-xs text-red-300/80">
            These were auto-delisted because fewer than 40% of reviewers said
            they work as described. Only you can see them. Push an update to
            address feedback — they&apos;ll relist when the rate recovers.
          </p>
          <ul className="mt-3 space-y-1.5">
            {hiddenContributions.map((h) => (
              <li key={h.id}>
                <Link
                  href={`/c/${h.id}`}
                  className="flex items-center justify-between rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs hover:bg-red-500/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-medium uppercase text-red-300">
                      {h.type}
                    </span>
                    <span className="font-medium text-red-100">{h.name}</span>
                  </div>
                  <span className="text-red-300/70">
                    {h.works_as_described_pct !== null
                      ? `${h.works_as_described_pct.toFixed(0)}% works as described`
                      : "no rating"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-foreground">Subscriptions</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Follow hubs and sub-domains to get updates on new contributions.
          </p>
          {hasSubscriptions ? (
            <ul className="mt-4 space-y-2">
              {subscriptions
                .filter((s) => s.scope_type === "hub")
                .map((s) => {
                  const hub = getHubBySlug(s.scope_value);
                  return (
                    <li key={s.scope_value}>
                      <Link
                        href={`/hubs/${s.scope_value}`}
                        className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs hover:bg-muted transition-colors"
                      >
                        <span className="font-medium text-foreground">
                          {hub?.name ?? s.scope_value}
                        </span>
                        <span className="text-muted-foreground">
                          {hub?.subdomains.length ?? 0} subdomains
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground italic">
              No subscriptions yet.
            </p>
          )}
          <Link
            href="/hubs"
            className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
          >
            {hasSubscriptions ? "Explore hubs" : "Subscribe to a hub"}
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-foreground">
            Installed Contributions
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {hasInstalls
              ? `${installs.length} installed skill${installs.length === 1 ? "" : "s"} & agent${installs.length === 1 ? "" : "s"}`
              : "Track your installed skills and agents by connecting the CLI."}
          </p>

          {hasInstalls ? (
            <ul className="mt-4 space-y-2">
              {installs.map((install) => (
                <li key={install.contribution_id}>
                  <Link
                    href={`/c/${install.contribution_id}`}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          install.contributions.type === "skill"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-purple-500/10 text-purple-400"
                        }`}
                      >
                        {install.contributions.type}
                      </span>
                      <span className="font-medium text-foreground">
                        {install.contributions.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      v{install.version}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">
                  1. Install the CLI
                </p>
                <CopyCommand command="npm install -g vibecodin" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">
                  2. Connect your account
                </p>
                <CopyCommand command="vibecodin auth" />
              </div>
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            {hasInstalls
              ? "Install more skills & agents via the CLI or download from the site."
              : "Once connected, your installs will appear here and count toward community usage stats."}
          </p>
        </div>
      </div>

      {/* Purchases & Paid Subscriptions */}
      {(hasPurchases || hasPaidSubs) && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* One-time purchases */}
          {hasPurchases && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-sm font-medium text-foreground">
                My Purchases
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Premium skills & agents you&apos;ve purchased.
              </p>
              <ul className="mt-4 space-y-2">
                {purchases.map((p) => {
                  const canRefund =
                    p.refund_eligible_until &&
                    new Date(p.refund_eligible_until) > new Date();
                  return (
                    <li
                      key={p.id}
                      className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs"
                    >
                      <Link
                        href={`/c/${p.contribution_id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {p.contributions.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {formatPrice(p.amount_cents)}
                        </span>
                        {canRefund && (
                          <RefundButton purchaseId={p.id} />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Active paid subscriptions */}
          {hasPaidSubs && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-sm font-medium text-foreground">
                Active Subscriptions
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Premium content you&apos;re subscribed to.
              </p>
              <ul className="mt-4 space-y-2">
                {paidSubs.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-xs"
                  >
                    <Link
                      href={`/c/${s.contribution_id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {s.contributions.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {formatPrice(s.amount_cents)}/mo
                      </span>
                      <CancelSubscriptionButton subscriptionId={s.id} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Contributor Earnings */}
      {isContributor && (
        <div className="mt-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-foreground">Earnings</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Revenue from your premium contributions (after 20% platform fee).
            </p>
            <div className="mt-4 flex gap-8">
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {formatPrice(earnings.totalCents)}
                </p>
                <p className="text-xs text-muted-foreground">All time</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {formatPrice(earnings.thisMonthCents)}
                </p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
            <a
              href="/api/stripe/dashboard"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
            >
              View Stripe Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
