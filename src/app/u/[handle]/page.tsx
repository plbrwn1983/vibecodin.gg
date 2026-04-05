import { notFound } from "next/navigation";
import { getContributionsByAuthor } from "@/lib/supabase/queries";
import { getAuthState } from "@/lib/supabase/auth";
import { ContributionList } from "@/components/contribution-list";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return { title: `${handle} — vibecodin.gg` };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const [items, { isAuthenticated, userVotes }] = await Promise.all([
    getContributionsByAuthor(handle),
    getAuthState(),
  ]);
  if (items.length === 0) notFound();

  const totalUpvotes = items.reduce((sum, c) => sum + c.upvotes, 0);
  const verified = items.filter((c) => c.verified).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-medium text-foreground">
          {handle.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{handle}</h1>
          <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{items.length} contributions</span>
            <span>&#9650; {totalUpvotes} total upvotes</span>
            <span>{verified} verified</span>
          </div>
        </div>
      </div>

      {/* Contributions */}
      <div className="mt-8">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Contributions
        </h2>
        <ContributionList
          contributions={items}
          userVotes={userVotes}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}
