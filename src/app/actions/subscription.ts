"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleHubSubscription(domain: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // Check if already subscribed
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("scope_type", "hub")
    .eq("scope_value", domain)
    .single();

  if (existing) {
    await supabase.from("subscriptions").delete().eq("id", existing.id);
  } else {
    await supabase.from("subscriptions").insert({
      user_id: user.id,
      scope_type: "hub",
      scope_value: domain,
    });
  }

  revalidatePath("/", "layout");
}
