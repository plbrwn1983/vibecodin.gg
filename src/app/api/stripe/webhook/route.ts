import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

// Use service role client for webhook (no user session)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Webhook event data types vary across Stripe SDK versions.
  // We use `any` for event.data.object since the shape is guaranteed by Stripe's webhook contract.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = event.data.object as any;

  switch (event.type) {
    case "checkout.session.completed": {
      const userId = obj.metadata?.user_id;
      const contributionId = obj.metadata?.contribution_id;
      const mode = obj.metadata?.mode;

      if (!userId || !contributionId) break;

      if (mode === "payment") {
        const amountCents = obj.amount_total ?? 0;
        const platformFee = Math.round(amountCents * 0.2);

        await supabase.from("purchases").upsert(
          {
            user_id: userId,
            contribution_id: contributionId,
            stripe_checkout_session_id: obj.id,
            stripe_payment_intent_id:
              typeof obj.payment_intent === "string"
                ? obj.payment_intent
                : obj.payment_intent?.id,
            amount_cents: amountCents,
            platform_fee_cents: platformFee,
            status: "completed",
            refund_eligible_until: new Date(
              Date.now() + 48 * 60 * 60 * 1000
            ).toISOString(),
          },
          { onConflict: "user_id,contribution_id" }
        );

        await supabase.from("payout_ledger").insert({
          contributor_user_id: await getContributorUserId(contributionId),
          contribution_id: contributionId,
          gross_cents: amountCents,
          platform_fee_cents: platformFee,
          contributor_payout_cents: amountCents - platformFee,
        });
      } else if (mode === "subscription") {
        const subscriptionId =
          typeof obj.subscription === "string"
            ? obj.subscription
            : obj.subscription?.id;

        if (subscriptionId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sub = (await getStripe().subscriptions.retrieve(subscriptionId)) as any;
          const amountCents = sub.items?.data?.[0]?.price?.unit_amount ?? 0;

          await supabase.from("active_subscriptions").upsert(
            {
              user_id: userId,
              contribution_id: contributionId,
              stripe_subscription_id: subscriptionId,
              stripe_price_id: sub.items?.data?.[0]?.price?.id ?? "",
              amount_cents: amountCents,
              status: "active",
              current_period_end: new Date(
                sub.current_period_end * 1000
              ).toISOString(),
            },
            { onConflict: "user_id,contribution_id" }
          );
        }
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const subscriptionId =
        typeof obj.subscription === "string"
          ? obj.subscription
          : obj.subscription?.id;

      if (!subscriptionId) break;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub = (await getStripe().subscriptions.retrieve(subscriptionId)) as any;
      const { data: activeSub } = await supabase
        .from("active_subscriptions")
        .select("id, contribution_id")
        .eq("stripe_subscription_id", subscriptionId)
        .single();

      if (activeSub) {
        await supabase
          .from("active_subscriptions")
          .update({
            current_period_end: new Date(
              sub.current_period_end * 1000
            ).toISOString(),
            status: "active",
          })
          .eq("id", activeSub.id);

        if (obj.billing_reason === "subscription_cycle") {
          const amountCents = obj.amount_paid ?? 0;
          const platformFee = Math.round(amountCents * 0.2);
          const contributorId = await getContributorUserId(
            activeSub.contribution_id
          );

          await supabase.from("payout_ledger").insert({
            contributor_user_id: contributorId,
            contribution_id: activeSub.contribution_id,
            subscription_id: activeSub.id,
            gross_cents: amountCents,
            platform_fee_cents: platformFee,
            contributor_payout_cents: amountCents - platformFee,
          });
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      await supabase
        .from("active_subscriptions")
        .update({
          status: obj.status === "active" ? "active" : "past_due",
          current_period_end: new Date(
            obj.current_period_end * 1000
          ).toISOString(),
        })
        .eq("stripe_subscription_id", obj.id);
      break;
    }

    case "customer.subscription.deleted": {
      await supabase
        .from("active_subscriptions")
        .update({
          status: "canceled",
          canceled_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", obj.id);
      break;
    }

    case "charge.refunded": {
      const paymentIntentId =
        typeof obj.payment_intent === "string"
          ? obj.payment_intent
          : obj.payment_intent?.id;

      if (paymentIntentId) {
        await supabase
          .from("purchases")
          .update({
            status: "refunded",
            refunded_at: new Date().toISOString(),
          })
          .eq("stripe_payment_intent_id", paymentIntentId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function getContributorUserId(
  contributionId: string
): Promise<string | null> {
  const { data: contribution } = await supabase
    .from("contributions")
    .select("author")
    .eq("id", contributionId)
    .single();

  if (!contribution) return null;

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("github_handle", contribution.author)
    .single();

  return user?.id ?? null;
}
