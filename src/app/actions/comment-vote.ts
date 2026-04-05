"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleCommentVote(
  commentId: string,
  contributionId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("comment_votes")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("comment_id", commentId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("comment_votes")
      .delete()
      .eq("user_id", user.id)
      .eq("comment_id", commentId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("comment_votes").insert({
      user_id: user.id,
      comment_id: commentId,
    });
    if (error) return { error: error.message };
  }

  revalidatePath(`/c/${contributionId}`);
  return { success: true };
}
