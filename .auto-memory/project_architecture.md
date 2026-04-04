---
name: Platform architecture decisions
description: Complete architecture for vibecodin.gg — all layers designed, all open questions resolved, front-end spec included. Ready for build.
type: project
---

Platform architecture documented in `docs/ARCHITECTURE.md`. All initial questions resolved as of 2026-04-04.

**Front-End:**
- Next.js (App Router) + TypeScript, hosted on Vercel.
- Tailwind CSS + shadcn/ui for dark, minimal, dev-tool aesthetic (Linear/Vercel/Raycast reference points).
- Route structure: `/hubs/[hub]/[subdomain]`, `/c/[id]`, `/u/[handle]`, `/search`, `/dashboard`, `/admin`.

**Data Layer:**
- One-way sync: Git → Supabase. Platform fields never written back to repo.
- Supabase for DB, auth (GitHub OAuth), storage/CDN, edge functions, and real-time.
- 7 tables: contributions, users, votes, comments, subscriptions, hub_moderators, installs.
- Edge function API proxy for assembler clients (5 endpoints with full request/response contracts).
- Content versioning: latest only. Version pinning deferred.

**Social Layer:**
- Hub-centric navigation, four core signals (verified, usage, upvotes, author).
- Subscriptions with "what's new" digest.
- Verification via four-item manual checklist. Contributions visible immediately; badge earned separately.
- Moderation: hide, remove, delete comment, lock thread, ban. No shadow banning.

**Assembler:**
- Meta-skill + CLI, shared local state, authenticated installs via GitHub OAuth.

**Hub Slugs:**
- Concise URL-safe identifiers, not verbatim hyphenations. E.g., "Accounts Payable & Receivable" → `accounts-payable`.
- Canonical mapping maintained in DB, seeded from HUBS.md.

**How to apply:** `docs/ARCHITECTURE.md` is the build reference. The Claude Code session should read this doc first.
