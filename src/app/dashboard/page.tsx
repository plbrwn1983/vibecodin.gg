import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
          <p className="mt-4 text-xs text-muted-foreground italic">
            No subscriptions yet.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-foreground">
            Installed Contributions
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Skills and agents you&apos;ve installed via the assembler.
          </p>
          <p className="mt-4 text-xs text-muted-foreground italic">
            No installs yet.
          </p>
        </div>
      </div>
    </div>
  );
}
