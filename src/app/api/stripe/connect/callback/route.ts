import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const isRefresh = url.searchParams.get("refresh") === "true";
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const { data: profile } = await supabase
    .from("users")
    .select("stripe_account_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_account_id) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isRefresh) {
    // User needs to re-do onboarding — create a new account link
    const accountLink = await getStripe().accountLinks.create({
      account: profile.stripe_account_id,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vibecodin.gg"}/api/stripe/connect/callback?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vibecodin.gg"}/api/stripe/connect/callback`,
      type: "account_onboarding",
    });
    return NextResponse.redirect(accountLink.url);
  }

  // Check if onboarding is complete
  const account = await getStripe().accounts.retrieve(profile.stripe_account_id);

  if (account.details_submitted) {
    await supabase
      .from("users")
      .update({ stripe_onboarding_complete: true })
      .eq("id", user.id);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
