import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <div className="flex items-center gap-4">
          <span>vibecodin.gg</span>
          <span className="hidden sm:inline">
            Open source skills & agents for LLMs
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/hubs" className="hover:text-foreground">
            Hubs
          </Link>
          <a
            href="https://github.com/plbrwn1983/vibecodin.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
