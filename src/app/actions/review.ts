"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const contributionId = formData.get("contribution_id") as string;
  const rating = parseInt(formData.get("rating") as string, 10);
  const worksAsDescribed = formData.get("works_as_described") === "true";
  const modelTested = (formData.get("model_tested") as string) || null;
  const body = (formData.get("body") as string) || null;

  if (!contributionId || !rating || rating < 1 || rating > 5) {
    return { error: "Invalid review data" };
  }

  const { error } = await supabase.from("reviews").upsert(
    {
      user_id: user.id,
      contribution_id: contributionId,
      rating,
      works_as_described: worksAsDescribed,
      model_tested: modelTested,
      body,
    },
    { onConflict: "user_id,contribution_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${contributionId}`);
  return { ok: true };
}

export async function deleteReview(contributionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("user_id", user.id)
    .eq("contribution_id", contributionId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${contributionId}`);
  return { ok: true };
}
