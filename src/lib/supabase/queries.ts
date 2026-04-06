import { createClient } from "./server";
import type { Contribution, Hub } from "../types";
import { hubs } from "../hubs";

export type SortKey = "upvotes" | "usage" | "recent" | "verified";

function applySorting(
  query: ReturnType<ReturnType<Awaited<ReturnType<typeof createClient>>["from"]>["select"]>,
  sort: SortKey
) {
  switch (sort) {
    case "upvotes":
      return query.order("upvotes", { ascending: false });
    case "usage":
      return query.order("usage_count", { ascending: false });
    case "recent":
      return query.order("updated", { ascending: false });
    case "verified":
      return query.order("verified", { ascending: false }).order("upvotes", { ascending: false });
    default:
      return query.order("upvotes", { ascending: false });
  }
}

export async function getContributions(options?: {
  domain?: string;
  subdomain?: string;
  type?: "skill" | "agent";
  sort?: SortKey;
  query?: string;
  verified?: boolean;
  limit?: number;
}): Promise<Contribution[]> {
  const supabase = await createClient();
  let q = supabase.from("contributions").select("*");

  if (options?.domain) {
    q = q.eq("domain", options.domain);
  }
  if (options?.subdomain) {
    q = q.eq("subdomain", options.subdomain);
  }
  if (options?.type) {
    q = q.eq("type", options.type);
  }
  if (options?.verified) {
    q = q.eq("verified", true);
  }
  if (options?.query) {
    q = q.or(
      `name.ilike.%${options.query}%,description.ilike.%${options.query}%`
    );
  }
  if (options?.limit) {
    q = q.limit(options.limit);
  }

  q = applySorting(q, options?.sort ?? "upvotes");

  const { data, error } = await q;
  if (error) {
    console.error("getContributions error:", error.message);
    return [];
  }
  return data as Contribution[];
}

export async function getContributionById(
  id: string
): Promise<Contribution | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }
  return data as Contribution;
}

export async function getContributionsByAuthor(
  author: string
): Promise<Contribution[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("author", author)
    .order("upvotes", { ascending: false });

  if (error) {
    console.error("getContributionsByAuthor error:", error.message);
    return [];
  }
  return data as Contribution[];
}

export async function getContributionCountByDomain(
  domain: string
): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("contributions")
    .select("id", { count: "exact", head: true })
    .eq("domain", domain);

  if (error) return 0;
  return count ?? 0;
}

export async function getStats(): Promise<{
  skills: number;
  agents: number;
  authors: number;
  domains: number;
  total: number;
}> {
  const supabase = await createClient();

  const { count: total } = await supabase
    .from("contributions")
    .select("id", { count: "exact", head: true });

  const { count: skills } = await supabase
    .from("contributions")
    .select("id", { count: "exact", head: true })
    .eq("type", "skill");

  const { count: agents } = await supabase
    .from("contributions")
    .select("id", { count: "exact", head: true })
    .eq("type", "agent");

  // Get distinct authors
  const { data: authorData } = await supabase
    .from("contributions")
    .select("author");
  const authors = new Set(authorData?.map((r) => r.author)).size;

  // Get distinct domains
  const { data: domainData } = await supabase
    .from("contributions")
    .select("domain");
  const domains = new Set(domainData?.map((r) => r.domain)).size;

  return {
    skills: skills ?? 0,
    agents: agents ?? 0,
    authors,
    domains,
    total: total ?? 0,
  };
}

export async function getHubsWithCounts(): Promise<
  { hub: Hub; count: number }[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contributions")
    .select("domain");

  const countMap: Record<string, number> = {};
  data?.forEach((r) => {
    countMap[r.domain] = (countMap[r.domain] || 0) + 1;
  });

  return hubs.map((hub) => ({
    hub,
    count: countMap[hub.slug] || 0,
  }));
}

export interface CommentWithUser {
  id: string;
  contribution_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  upvotes: number;
  created_at: string;
  updated_at: string;
  users: {
    github_handle: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export async function getComments(
  contributionId: string
): Promise<CommentWithUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("id, contribution_id, user_id, parent_id, body, upvotes, created_at, updated_at, users!comments_user_id_fkey(github_handle, display_name, avatar_url)")
    .eq("contribution_id", contributionId)
    .order("upvotes", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getComments error:", error.message);
    return [];
  }

  return (data as unknown as CommentWithUser[]) ?? [];
}

export async function getUserCommentVotes(
  contributionId: string
): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Set();

  // Get comment IDs for this contribution, then get votes
  const { data: comments } = await supabase
    .from("comments")
    .select("id")
    .eq("contribution_id", contributionId);

  if (!comments || comments.length === 0) return new Set();

  const commentIds = comments.map((c) => c.id);
  const { data: votes } = await supabase
    .from("comment_votes")
    .select("comment_id")
    .eq("user_id", user.id)
    .in("comment_id", commentIds);

  return new Set(votes?.map((v) => v.comment_id) ?? []);
}

export async function isSubscribedToHub(domain: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("scope_type", "hub")
    .eq("scope_value", domain)
    .single();

  return !!data;
}

export async function getUserInstalls(): Promise<
  {
    contribution_id: string;
    version: string;
    installed_at: string;
    contributions: {
      id: string;
      name: string;
      type: "skill" | "agent";
      description: string;
      domain: string;
    };
  }[]
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("installs")
    .select(
      "contribution_id, version, installed_at, contributions(id, name, type, description, domain)"
    )
    .eq("user_id", user.id)
    .eq("active", true)
    .order("installed_at", { ascending: false });

  if (error) {
    console.error("getUserInstalls error:", error.message);
    return [];
  }
  return (data as unknown as Awaited<ReturnType<typeof getUserInstalls>>) ?? [];
}

export async function getUserPurchases(): Promise<
  {
    id: string;
    contribution_id: string;
    amount_cents: number;
    status: string;
    purchased_at: string;
    refund_eligible_until: string | null;
    contributions: {
      id: string;
      name: string;
      type: "skill" | "agent";
      description: string;
    };
  }[]
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("purchases")
    .select(
      "id, contribution_id, amount_cents, status, purchased_at, refund_eligible_until, contributions(id, name, type, description)"
    )
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("purchased_at", { ascending: false });

  if (error) {
    console.error("getUserPurchases error:", error.message);
    return [];
  }
  return (data as unknown as Awaited<ReturnType<typeof getUserPurchases>>) ?? [];
}

export async function getUserActiveSubscriptionsPaid(): Promise<
  {
    id: string;
    contribution_id: string;
    amount_cents: number;
    status: string;
    current_period_end: string;
    started_at: string;
    contributions: {
      id: string;
      name: string;
      type: "skill" | "agent";
      description: string;
    };
  }[]
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("active_subscriptions")
    .select(
      "id, contribution_id, amount_cents, status, current_period_end, started_at, contributions(id, name, type, description)"
    )
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("started_at", { ascending: false });

  if (error) {
    console.error("getUserActiveSubscriptionsPaid error:", error.message);
    return [];
  }
  return (data as unknown as Awaited<ReturnType<typeof getUserActiveSubscriptionsPaid>>) ?? [];
}

export async function getContributorEarnings(userId: string): Promise<{
  totalCents: number;
  thisMonthCents: number;
}> {
  const supabase = await createClient();

  const { data: allTime } = await supabase
    .from("payout_ledger")
    .select("contributor_payout_cents")
    .eq("contributor_user_id", userId);

  const totalCents = allTime?.reduce((sum, r) => sum + r.contributor_payout_cents, 0) ?? 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: monthly } = await supabase
    .from("payout_ledger")
    .select("contributor_payout_cents")
    .eq("contributor_user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  const thisMonthCents = monthly?.reduce((sum, r) => sum + r.contributor_payout_cents, 0) ?? 0;

  return { totalCents, thisMonthCents };
}

export interface ReviewWithUser {
  id: string;
  user_id: string;
  contribution_id: string;
  rating: number;
  works_as_described: boolean;
  model_tested: string | null;
  body: string | null;
  created_at: string;
  updated_at: string;
  users: {
    github_handle: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export async function getReviews(
  contributionId: string
): Promise<ReviewWithUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, user_id, contribution_id, rating, works_as_described, model_tested, body, created_at, updated_at, users!reviews_user_id_fkey(github_handle, display_name, avatar_url)"
    )
    .eq("contribution_id", contributionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getReviews error:", error.message);
    return [];
  }
  return (data as unknown as ReviewWithUser[]) ?? [];
}

export async function getUserReview(
  contributionId: string
): Promise<ReviewWithUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, user_id, contribution_id, rating, works_as_described, model_tested, body, created_at, updated_at, users!reviews_user_id_fkey(github_handle, display_name, avatar_url)"
    )
    .eq("contribution_id", contributionId)
    .eq("user_id", user.id)
    .single();

  if (error) return null;
  return data as unknown as ReviewWithUser;
}

export async function getUserSubscriptions(): Promise<
  { scope_type: string; scope_value: string; created_at: string }[]
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("subscriptions")
    .select("scope_type, scope_value, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}
