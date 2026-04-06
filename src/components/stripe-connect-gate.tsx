"use client";

import { useState } from "react";

export function StripeConnectGate({
  onboarded,
  children,
}: {
  onboarded: boolean;
  children: React.ReactNode;
}) {
  const [connecting, setConnecting] = useState(false);

  if (onboarded) {
    return <>{children}</>;
  }

  async function handleConnect() {
    setConnecting(true);
    const res = await fetch("/api/stripe/connect", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setConnecting(false);
    }
  }

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
      <h3 className="text-sm font-medium text-foreground">
        Stripe Connect Required
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        To sell premium contributions, you need to connect a Stripe account to
        receive payouts. The platform takes a 20% fee, and you receive 80% of
        each sale.
      </p>
      <button
        onClick={handleConnect}
        disabled={connecting}
        className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
      >
        {connecting ? "Connecting..." : "Connect Stripe Account"}
      </button>
    </div>
  );
}
