import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { subscription_id } = await request.json();

  if (!subscription_id) {
    return NextResponse.json(
      { error: "subscription_id is required" },
      { status: 400 }
    );
  }

  // Verify the subscription belongs to this user
  const { data: sub, error } = await supabase
    .from("active_subscriptions")
    .select("stripe_subscription_id")
    .eq("id", subscription_id)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (error || !sub) {
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 }
    );
  }

  // Cancel at period end (user retains access until billing period ends)
  const stripe = getStripe();
  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    cancel_at_period_end: true,
  });

  // Update local status
  await supabase
    .from("active_subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
    })
    .eq("id", subscription_id);

  return NextResponse.json({ ok: true });
}
