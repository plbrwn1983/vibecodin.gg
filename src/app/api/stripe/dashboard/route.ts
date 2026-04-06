import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("stripe_account_id, stripe_onboarding_complete")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_account_id || !profile.stripe_onboarding_complete) {
    return NextResponse.json(
      { error: "Stripe Connect not set up" },
      { status: 400 }
    );
  }

  const loginLink = await getStripe().accounts.createLoginLink(
    profile.stripe_account_id
  );

  return NextResponse.json({ url: loginLink.url });
}
