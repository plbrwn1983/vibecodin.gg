"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SortKey } from "@/lib/data";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "upvotes", label: "Upvotes" },
  { key: "usage", label: "Usage" },
  { key: "recent", label: "Recent" },
  { key: "verified", label: "Verified" },
];

export function SortControls({
  current = "upvotes",
  basePath,
}: {
  current?: SortKey;
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSort(key: SortKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", key);
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="mr-1 text-muted-foreground">Sort:</span>
      {sortOptions.map((opt) => (
        <button
          key={opt.key}
          onClick={() => handleSort(opt.key)}
          className={`rounded-md px-2 py-1 transition-colors ${
            current === opt.key
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
