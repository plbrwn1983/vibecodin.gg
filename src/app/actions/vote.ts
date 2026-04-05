"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleVote(contributionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check if already voted
  const { data: existing } = await supabase
    .from("votes")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("contribution_id", contributionId)
    .single();

  if (existing) {
    // Remove vote
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("user_id", user.id)
      .eq("contribution_id", contributionId);

    if (error) return { error: error.message };
  } else {
    // Add vote
    const { error } = await supabase.from("votes").insert({
      user_id: user.id,
      contribution_id: contributionId,
    });

    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function getUserVotes(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Set();

  const { data } = await supabase
    .from("votes")
    .select("contribution_id")
    .eq("user_id", user.id);

  return new Set(data?.map((v) => v.contribution_id) ?? []);
}
