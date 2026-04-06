import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user already has a Stripe account
  const { data: profile } = await supabase
    .from("users")
    .select("stripe_account_id, stripe_onboarding_complete")
    .eq("id", user.id)
    .single();

  let accountId = profile?.stripe_account_id;

  if (!accountId) {
    // Create a new Stripe Connect Express account
    const account = await getStripe().accounts.create({
      type: "express",
      email: user.email,
      metadata: { user_id: user.id },
    });

    accountId = account.id;

    // Store the account ID
    await supabase
      .from("users")
      .update({ stripe_account_id: accountId })
      .eq("id", user.id);
  }

  // Create an account link for onboarding
  const accountLink = await getStripe().accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vibecodin.gg"}/api/stripe/connect/callback?refresh=true`,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vibecodin.gg"}/api/stripe/connect/callback`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}

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

  return NextResponse.json({
    connected: !!profile?.stripe_account_id,
    onboardingComplete: profile?.stripe_onboarding_complete ?? false,
  });
}
