import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, getAuth } from "./config.js";

let client: SupabaseClient | null = null;

export function getClient(): SupabaseClient {
  if (!client) {
    const auth = getAuth();
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: auth ? { Authorization: `Bearer ${auth.access_token}` } : {},
      },
    });
  }
  return client;
}

export interface Contribution {
  id: string;
  name: string;
  type: "skill" | "agent";
  version: string;
  description: string;
  author: string;
  tags: string[];
  license: string;
  created: string;
  updated: string;
  tested_with: string[];
  skill_fields: Record<string, unknown> | null;
  agent_fields: Record<string, unknown> | null;
  raw_readme: string;
  domain: string;
  subdomain: string | null;
  verified: boolean;
  verification_date: string | null;
  verification_model: string | null;
  upvotes: number;
  usage_count: number;
  pricing_model: "free" | "one_time" | "subscription" | "both";
  price_one_time: number | null;
  price_subscription: number | null;
}

export type SortKey = "upvotes" | "usage" | "recent" | "verified";

export async function searchContributions(options: {
  query?: string;
  hub?: string;
  type?: "skill" | "agent";
  sort?: SortKey;
  verified?: boolean;
  limit?: number;
}): Promise<Contribution[]> {
  const supabase = getClient();
  let q = supabase.from("contributions").select("*").is("deleted_at", null);

  if (options.query) {
    q = q.or(
      `name.ilike.%${options.query}%,description.ilike.%${options.query}%`
    );
  }
  if (options.hub) {
    q = q.eq("domain", options.hub);
  }
  if (options.type) {
    q = q.eq("type", options.type);
  }
  if (options.verified) {
    q = q.eq("verified", true);
  }

  // Sort
  switch (options.sort ?? "upvotes") {
    case "upvotes":
      q = q.order("upvotes", { ascending: false });
      break;
    case "usage":
      q = q.order("usage_count", { ascending: false });
      break;
    case "recent":
      q = q.order("updated", { ascending: false });
      break;
    case "verified":
      q = q
        .order("verified", { ascending: false })
        .order("upvotes", { ascending: false });
      break;
  }

  if (options.limit) {
    q = q.limit(options.limit);
  } else {
    q = q.limit(20);
  }

  const { data, error } = await q;
  if (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
  return data as Contribution[];
}

export async function getContribution(
  id: string
): Promise<Contribution | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as Contribution;
}

export async function getContributionFiles(
  id: string,
  type: "skill" | "agent"
): Promise<{ name: string; url: string }[]> {
  const supabase = getClient();
  const storagePath = `contributions/${type}s/${id}`;

  const { data, error } = await supabase.storage
    .from("contributions")
    .list(storagePath);

  if (error || !data) return [];

  return data.map((file) => ({
    name: file.name,
    url: `${SUPABASE_URL}/storage/v1/object/public/contributions/${storagePath}/${file.name}`,
  }));
}

export async function downloadFile(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.status}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

export async function recordInstall(
  contributionId: string,
  version: string
): Promise<void> {
  const auth = getAuth();
  if (!auth) return;

  const supabase = getClient();
  const { error } = await supabase.from("installs").upsert(
    {
      user_id: auth.user_id,
      contribution_id: contributionId,
      version,
    },
    { onConflict: "user_id,contribution_id" }
  );
  if (error) {
    console.error(`Failed to record install: ${error.message}`);
  }
}

export async function checkPurchaseAccess(
  contributionId: string
): Promise<boolean> {
  const auth = getAuth();
  if (!auth) return false;

  const supabase = getClient();
  const { data, error } = await supabase.rpc("check_purchase_access", {
    p_user_id: auth.user_id,
    p_contribution_id: contributionId,
  });

  if (error) {
    console.error(`Failed to check purchase access: ${error.message}`);
    return false;
  }
  return !!data;
}
