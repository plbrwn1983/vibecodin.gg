import Link from "next/link";
import { SearchBar } from "./search-bar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">
              vibecodin<span className="text-muted-foreground">.</span>g<span className="text-muted-foreground">g</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link
              href="/hubs"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Hubs
            </Link>
            <Link
              href="/search"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          <Link
            href="/dashboard"
            className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
