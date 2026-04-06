"use client";

import { useState } from "react";

export function CancelSubscriptionButton({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [canceled, setCanceled] = useState(false);

  async function handleCancel() {
    if (!confirm("Cancel this subscription? You'll retain access until the end of the current billing period.")) return;

    setLoading(true);
    const res = await fetch("/api/stripe/cancel-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription_id: subscriptionId }),
    });

    const data = await res.json();

    if (res.ok) {
      setCanceled(true);
    } else {
      alert(data.error || "Failed to cancel subscription");
    }
    setLoading(false);
  }

  if (canceled) {
    return (
      <span className="text-xs text-muted-foreground">Canceled</span>
    );
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="rounded bg-red-600/10 px-2 py-0.5 text-[10px] font-medium text-red-400 hover:bg-red-600/20 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Cancel"}
    </button>
  );
}
