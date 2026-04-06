"use client";

import { useState } from "react";

export function RefundButton({ purchaseId }: { purchaseId: string }) {
  const [loading, setLoading] = useState(false);
  const [refunded, setRefunded] = useState(false);

  async function handleRefund() {
    if (!confirm("Are you sure you want to request a refund?")) return;

    setLoading(true);
    const res = await fetch("/api/stripe/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchase_id: purchaseId }),
    });

    const data = await res.json();

    if (res.ok) {
      setRefunded(true);
    } else {
      alert(data.error || "Refund failed");
    }
    setLoading(false);
  }

  if (refunded) {
    return (
      <span className="text-xs text-green-400">Refunded</span>
    );
  }

  return (
    <button
      onClick={handleRefund}
      disabled={loading}
      className="rounded bg-red-600/10 px-2 py-0.5 text-[10px] font-medium text-red-400 hover:bg-red-600/20 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Refund"}
    </button>
  );
}
