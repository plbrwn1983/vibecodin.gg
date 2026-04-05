import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SearchBar } from "./search-bar";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/submit"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Submit
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <a
                href="/auth/logout"
                className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                Sign out
              </a>
            </div>
          ) : (
            <a
              href="/auth/login"
              className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              Sign in
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
