"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search skills & agents..."
        className="h-8 w-56 rounded-md border border-border bg-muted/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent lg:w-72"
      />
      <kbd className="pointer-events-none absolute right-2 top-1.5 hidden rounded border border-border px-1.5 text-[10px] text-muted-foreground lg:inline-block">
        /
      </kbd>
    </form>
  );
}
