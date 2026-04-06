export function PriceBadge({
  pricingModel,
  priceOneTime,
  priceSubscription,
}: {
  pricingModel: string;
  priceOneTime: number | null;
  priceSubscription: number | null;
}) {
  if (pricingModel === "free") {
    return (
      <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-green-500/10 text-green-400">
        Free
      </span>
    );
  }

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;

  const parts: string[] = [];
  if (
    (pricingModel === "one_time" || pricingModel === "both") &&
    priceOneTime
  ) {
    parts.push(formatPrice(priceOneTime));
  }
  if (
    (pricingModel === "subscription" || pricingModel === "both") &&
    priceSubscription
  ) {
    parts.push(`${formatPrice(priceSubscription)}/mo`);
  }

  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/10 text-amber-400">
      {parts.join(" · ") || "Premium"}
    </span>
  );
}
