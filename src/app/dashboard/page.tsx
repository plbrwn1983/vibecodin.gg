import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscriptions, getUserInstalls } from "@/lib/supabase/queries";
import { getHubBySlug } from "@/lib/hubs";
import { CopyCommand } from "@/components/copy-command";

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

  const [subscriptions, installs] = await Promise.all([
    getUserSubscriptions(),
    getUserInstalls(),
  ]);
  const hasSubscriptions = subscriptions.length > 0;
  const hasInstalls = installs.length > 0;

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
    </div>
  );
}
