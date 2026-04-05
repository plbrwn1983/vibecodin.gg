"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addComment(
  contributionId: string,
  body: string,
  parentId?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };
  if (!body.trim()) return { error: "Comment cannot be empty" };

  const { error } = await supabase.from("comments").insert({
    contribution_id: contributionId,
    user_id: user.id,
    parent_id: parentId || null,
    body: body.trim(),
  });

  if (error) return { error: error.message };

  revalidatePath(`/c/${contributionId}`);
  return { success: true };
}

export async function deleteComment(commentId: string, contributionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Soft delete — only the comment owner can delete
  const { error } = await supabase
    .from("comments")
    .update({ deleted_at: new Date().toISOString(), deleted_by: user.id })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/c/${contributionId}`);
  return { success: true };
}
