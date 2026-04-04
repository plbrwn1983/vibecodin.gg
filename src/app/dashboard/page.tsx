export const metadata = { title: "Dashboard — vibecodin.gg" };

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in with GitHub to view your subscriptions, installed contributions,
        and activity.
      </p>
      <button className="mt-6 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
        Sign in with GitHub
      </button>
    </div>
  );
}
