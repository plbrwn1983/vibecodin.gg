"use client";

import { useTransition } from "react";
import { toggleHubSubscription } from "@/app/actions/subscription";

export function SubscribeButton({
  domain,
  isSubscribed,
  isAuthenticated,
}: {
  domain: string;
  isSubscribed: boolean;
  isAuthenticated: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }
    startTransition(async () => {
      await toggleHubSubscription(domain);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
        isSubscribed
          ? "border border-border bg-card text-foreground hover:bg-muted"
          : "bg-blue-600 text-white hover:bg-blue-500"
      } ${isPending ? "opacity-50" : ""}`}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
