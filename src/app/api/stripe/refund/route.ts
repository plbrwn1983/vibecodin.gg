import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { purchase_id } = await request.json();

  if (!purchase_id) {
    return NextResponse.json({ error: "Missing purchase_id" }, { status: 400 });
  }

  // Get purchase
  const { data: purchase } = await supabase
    .from("purchases")
    .select("*")
    .eq("id", purchase_id)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .single();

  if (!purchase) {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }

  // Check refund window
  if (
    !purchase.refund_eligible_until ||
    new Date(purchase.refund_eligible_until) < new Date()
  ) {
    return NextResponse.json(
      { error: "Refund window has expired (48 hours)" },
      { status: 400 }
    );
  }

  if (!purchase.stripe_payment_intent_id) {
    return NextResponse.json(
      { error: "No payment intent found" },
      { status: 400 }
    );
  }

  // Issue Stripe refund
  await getStripe().refunds.create({
    payment_intent: purchase.stripe_payment_intent_id,
  });

  // Update purchase status (webhook will also fire, but update immediately for UX)
  await supabase
    .from("purchases")
    .update({
      status: "refunded",
      refunded_at: new Date().toISOString(),
    })
    .eq("id", purchase_id);

  return NextResponse.json({ success: true });
}
