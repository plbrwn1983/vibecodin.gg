"use client";

import { useState } from "react";

export function PurchaseButton({
  contributionId,
  mode,
  label,
}: {
  contributionId: string;
  mode: "payment" | "subscription";
  label: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contribution_id: contributionId, mode }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Failed to create checkout session");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
    >
      {loading ? "Redirecting..." : label}
    </button>
  );
}
