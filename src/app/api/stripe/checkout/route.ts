import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, calculatePlatformFee } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contribution_id, mode } = await request.json();

  if (!contribution_id || !["payment", "subscription"].includes(mode)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Get contribution details
  const { data: contribution } = await supabase
    .from("contributions")
    .select("id, name, pricing_model, price_one_time, price_subscription, stripe_price_one_time_id, stripe_price_subscription_id, author")
    .eq("id", contribution_id)
    .single();

  if (!contribution || contribution.pricing_model === "free") {
    return NextResponse.json({ error: "Contribution not available for purchase" }, { status: 400 });
  }

  // Check if already purchased
  const { data: existingPurchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("contribution_id", contribution_id)
    .eq("status", "completed")
    .single();

  if (existingPurchase) {
    return NextResponse.json({ error: "Already purchased" }, { status: 400 });
  }

  const { data: existingSub } = await supabase
    .from("active_subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("contribution_id", contribution_id)
    .eq("status", "active")
    .single();

  if (existingSub) {
    return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
  }

  // Get contributor's Stripe account
  const { data: contributor } = await supabase
    .from("users")
    .select("stripe_account_id")
    .eq("github_handle", contribution.author)
    .single();

  if (!contributor?.stripe_account_id) {
    return NextResponse.json({ error: "Contributor has not set up payments" }, { status: 400 });
  }

  // Get or create Stripe customer for the buyer
  let { data: buyer } = await supabase
    .from("users")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let customerId = buyer?.stripe_customer_id;

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("users")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vibecodin.gg";

  if (mode === "payment") {
    // One-time purchase
    const priceId = contribution.stripe_price_one_time_id;
    if (!priceId) {
      return NextResponse.json({ error: "One-time purchase not available" }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      payment_intent_data: {
        application_fee_amount: calculatePlatformFee(contribution.price_one_time!),
        transfer_data: {
          destination: contributor.stripe_account_id,
        },
      },
      metadata: {
        user_id: user.id,
        contribution_id: contribution.id,
        mode: "payment",
      },
      success_url: `${siteUrl}/c/${contribution.id}?purchased=true`,
      cancel_url: `${siteUrl}/c/${contribution.id}`,
    });

    return NextResponse.json({ url: session.url });
  } else {
    // Subscription
    const priceId = contribution.stripe_price_subscription_id;
    if (!priceId) {
      return NextResponse.json({ error: "Subscription not available" }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        application_fee_percent: 20,
        transfer_data: {
          destination: contributor.stripe_account_id,
        },
        metadata: {
          user_id: user.id,
          contribution_id: contribution.id,
        },
      },
      metadata: {
        user_id: user.id,
        contribution_id: contribution.id,
        mode: "subscription",
      },
      success_url: `${siteUrl}/c/${contribution.id}?subscribed=true`,
      cancel_url: `${siteUrl}/c/${contribution.id}`,
    });

    return NextResponse.json({ url: session.url });
  }
}
